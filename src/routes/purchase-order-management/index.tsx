import { poStatusSchema } from "@/auto-generated/api-configs";
import DataGrid from "@/components/common/DataGrid";
import useFilterData from "@/hooks/useFilterData";
import useTranslation from "@/hooks/useTranslation";
import useUrlHash from "@/hooks/useUrlHash";
import { PurchaseOrder, getPurchaseOrders } from "@/services/domain";
import useCateringStore from "@/stores/catering.store";
import useMaterialStore from "@/stores/material.store";
import useSupplierStore from "@/stores/supplier.store";
import {
  compareDatesByDay,
  convertAmountBackward,
  endOfDay,
  exportToPOByCateringExcel,
  exportToPOBySupplierExcel,
  formatTime,
  isSameDate,
  startOfDay,
} from "@/utils";
import { Button, Flex, Stack } from "@mantine/core";
import { modals } from "@mantine/modals";
import { notifications } from "@mantine/notifications";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  ExportCateringExcelData,
  ExportSupplierExcelData,
  FilterType,
  configs,
  defaultCondition,
  filter,
} from "./_configs";
import Filter from "./components/Filter";
import POSummaryForm from "./components/POSummaryForm";

const PurchaseOrderManagement = () => {
  const t = useTranslation();
  const navigate = useNavigate();
  const [purchaseOrders, setPurchaseOrders] = useState<
  PurchaseOrder[]
  >([]);
  const { caterings } = useCateringStore();
  const { suppliers } = useSupplierStore();
  const { materials } = useMaterialStore();

  const dataGridConfigs = useMemo(
    () => configs(t, caterings, suppliers),
    [t, caterings, suppliers],
  );

  const getData = async (from?: number, to?: number) => {
    setPurchaseOrders(await getPurchaseOrders({ from, to }));
  };

  useEffect(() => {
    getData();
  }, []);

  const location = useLocation();
  useEffect(() => {
    if (location.state?.refresh) {
      getData();
    }
  }, [location.state]);

  const dataLoader = useCallback(() => {
    return purchaseOrders;
  }, [purchaseOrders]);

  const {
    condition,
    counter,
    data,
    keyword,
    names,
    page,
    reload,
    setPage,
    updateCondition,
    filtered,
    reset,
    setCondition,
  } = useFilterData<PurchaseOrder, FilterType>({
    dataLoader: dataLoader,
    filter,
    defaultCondition,
  });

  const onChangeDateRange = useCallback(
    (from?: number, to?: number) => {
      if (condition?.from && condition?.to && from && to) {
        const _from = startOfDay(from);
        const _to = endOfDay(to);
        if (from < condition.from || to > condition.to) {
          getData(_from, _to);
        }
        updateCondition("from", "", _from);
        updateCondition("to", "", to);
      }
    },
    [condition?.from, condition?.to, updateCondition],
  );

  const callback = useCallback(
    (condition: FilterType) => {
      setCondition(condition);
      onChangeDateRange(condition?.from, condition?.to);
    },
    [onChangeDateRange, setCondition],
  );
  useUrlHash(condition ?? defaultCondition, callback);

  const onRowClick = (item: PurchaseOrder) => {
    navigate(`/purchase-order-management/${item.id}`);
  };

  const onPOSummary = () => {
    modals.open({
      title: t("PO summary"),
      classNames: { title: "c-catering-font-bold" },
      centered: true,
      size: "lg",
      children: (
        <POSummaryForm
          onExportExcelBySupplier={exportExcelBySupplier}
          onExportExcelByCatering={exportExcelByCatering}
        />
      ),
    });
  };

  const showFailNotification = useCallback(() => {
    notifications.show({
      color: "red.5",
      message: t("No data"),
    });
  }, [t]);

  const exportExcelBySupplier = useCallback(
    async (deliveryDate: Date, supplierId: string) => {
      let poList = purchaseOrders;
      if (
        compareDatesByDay(
          deliveryDate,
          new Date(condition?.to || ""),
        ) < 0 ||
        compareDatesByDay(
          deliveryDate,
          new Date(condition?.from || ""),
        ) > 0
      ) {
        poList = await getPurchaseOrders({
          from: startOfDay(deliveryDate.getTime()),
          to: endOfDay(deliveryDate.getTime()),
        });
      }

      const _purchaseOrders = poList.filter(
        (po) =>
          isSameDate(po.deliveryDate, deliveryDate) &&
          (supplierId === "all" || po.supplierId === supplierId) &&
          po.others.status !== poStatusSchema.Values.DTC,
      );

      if (_purchaseOrders.length === 0) {
        showFailNotification();
        return;
      }

      const purchaseOrdersBySupplier = _purchaseOrders.reduce(
        (acc, po) => {
          const supplierId = po.supplierId || "";
          if (!acc[supplierId]) {
            acc[supplierId] = [];
          }
          acc[supplierId].push(po);
          return acc;
        },
        {} as Record<string, typeof _purchaseOrders>,
      );

      const data: ExportSupplierExcelData[] = Object.keys(
        purchaseOrdersBySupplier,
      ).map((supplierId, i) => {
        const purchaseOrdersForSupplier =
          purchaseOrdersBySupplier[supplierId];
        const materialMap = new Map<
        string,
        { quantities: Record<string, number>; notes: string[] }
        >();
        const cateringSet = new Set<string>();

        purchaseOrdersForSupplier.forEach((po) => {
          const cateringName =
            caterings.get(po.others.receivingCateringId)?.name || "";

          if (cateringName) {
            cateringSet.add(cateringName);
          }

          po.purchaseOrderDetails.forEach((e) => {
            const amount = e.actualAmount || 0;
            const materialId = e.materialId;
            const supplierNote = e.others.supplierNote || "";

            if (!materialMap.has(materialId)) {
              materialMap.set(materialId, {
                quantities: {},
                notes: [],
              });
            }

            const materialEntry = materialMap.get(materialId);
            if (materialEntry) {
              materialEntry.quantities[cateringName] =
                (materialEntry.quantities[cateringName] || 0) +
                convertAmountBackward({
                  material: materials.get(materialId),
                  amount,
                });
              materialEntry.notes.push(supplierNote);
            }
          });
        });

        const cateringNames = Array.from(cateringSet);

        const sortedMaterials = Array.from(
          materialMap.entries(),
        ).sort(([a], [b]) =>
          (materials.get(a)?.name || "").localeCompare(
            materials.get(b)?.name || "",
          ),
        );
        /* cspell:disable */
        return {
          sheetName: `${i + 1}-${suppliers.get(supplierId)?.name}`,
          cateringNames,
          date: formatTime(deliveryDate, "DD/MM/YYYY HH:mm:ss"),
          title: `Danh sách vật tư cần giao dự kiến - ${formatTime(
            deliveryDate,
            "DD/MM/YYYY",
          )} - ${suppliers.get(supplierId)?.name}`,
          items: sortedMaterials.map(
            ([materialId, { quantities, notes }], index) => {
              const totalAmount = Object.values(quantities).reduce(
                (acc, amount) => acc + amount,
                0,
              );

              return {
                index: index + 1,
                materialName: materials.get(materialId)?.name || "",
                unit:
                  materials.get(materialId)?.others?.unit?.name || "",
                totalAmount,
                cateringQuantities: quantities,
                note: notes.join("; "),
              };
            },
          ),
        };
      });
      /* cspell:enable */
      exportToPOBySupplierExcel(data, deliveryDate);
    },
    [
      caterings,
      condition?.from,
      condition?.to,
      materials,
      purchaseOrders,
      showFailNotification,
      suppliers,
    ],
  );

  const exportExcelByCatering = useCallback(
    async (deliveryDate: Date, cateringId: string) => {
      let poList = purchaseOrders;
      if (
        compareDatesByDay(
          deliveryDate,
          new Date(condition?.to || ""),
        ) < 0 ||
        compareDatesByDay(
          deliveryDate,
          new Date(condition?.from || ""),
        ) > 0
      ) {
        poList = await getPurchaseOrders({
          from: startOfDay(deliveryDate.getTime()),
          to: endOfDay(deliveryDate.getTime()),
        });
      }
      const _purchaseOrders = poList.filter(
        (po) =>
          isSameDate(po.deliveryDate, deliveryDate) &&
          (cateringId === "all" ||
            po.others.receivingCateringId === cateringId) &&
          po.others.status !== poStatusSchema.Values.DTC,
      );

      if (_purchaseOrders.length === 0) {
        showFailNotification();
        return;
      }

      const data: ExportCateringExcelData[] = _purchaseOrders.map(
        (po) => {
          const sortedPODetails = po.purchaseOrderDetails.sort(
            (a, b) =>
              (materials.get(a.materialId)?.name || "").localeCompare(
                materials.get(b.materialId)?.name || "",
              ),
          );
          return {
            sheetName: po.code,
            purchaseOrderCode: po.code,
            date: formatTime(deliveryDate, "DD/MM/YYYY HH:mm:ss"),
            cateringName:
              caterings.get(po.others.receivingCateringId)?.name ||
              "",
            supplierName: suppliers.get(po.supplierId)?.name || "",
            address:
              caterings.get(po.others.receivingCateringId)?.address ||
              "",
            items: sortedPODetails.map((e, i) => {
              const material = materials.get(e.materialId);
              return {
                index: i + 1,
                materialCode: material?.others.internalCode || "",
                materialName: material?.name || "",
                unit: material?.others.unit?.name || "",
                orderAmount: convertAmountBackward({
                  material,
                  amount: e.amount,
                }),
                receivedAmount: convertAmountBackward({
                  material,
                  amount: e.actualAmount,
                }),
                paymentAmount: convertAmountBackward({
                  material,
                  amount: e.paymentAmount,
                }),
                note: e.others.supplierNote || "",
              };
            }),
          };
        },
      );
      exportToPOByCateringExcel(data);
    },
    [
      caterings,
      condition?.from,
      condition?.to,
      materials,
      purchaseOrders,
      showFailNotification,
      suppliers,
    ],
  );

  return (
    <Stack gap={10} key={suppliers.size}>
      <Flex justify="end">
        <Button onClick={onPOSummary}>{t("PO summary")}</Button>
      </Flex>
      <Filter
        key={counter}
        keyword={keyword}
        from={condition?.from}
        to={condition?.to}
        statuses={condition?.statuses}
        receivingCateringIds={condition?.receivingCateringIds}
        supplierIds={condition?.supplierIds}
        purchaseOrderIds={names}
        clearable={filtered}
        onClear={reset}
        onReload={reload}
        onChangeStatuses={updateCondition.bind(null, "statuses", "")}
        onChangeReceivingCateringIds={updateCondition.bind(
          null,
          "receivingCateringIds",
          "",
        )}
        onChangeSupplierIds={updateCondition.bind(
          null,
          "supplierIds",
          "",
        )}
        onChangeDateRange={onChangeDateRange}
      />
      <DataGrid
        onRowClick={onRowClick}
        page={page}
        limit={10}
        isPaginated
        hasOrderColumn
        columns={dataGridConfigs}
        data={data}
        onChangePage={setPage}
      />
    </Stack>
  );
};

export default PurchaseOrderManagement;
