import DataGrid from "@/components/common/DataGrid";
import {
  FilterType,
  defaultCondition,
  filter,
} from "@/configs/filters/purchase-order";
import useFilterData from "@/hooks/useFilterData";
import useTranslation from "@/hooks/useTranslation";
import {
  PurchaseOrder,
  getPurchaseOrders,
  statusOrderOptions,
} from "@/services/domain";
import useCateringStore from "@/stores/catering.store";
import useSupplierStore from "@/stores/supplier.store";
import { endOfWeek, startOfDay } from "@/utils";
import { Flex, Stack } from "@mantine/core";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { configs } from "./_config";
import PurchaseOrderFilter from "./components/PurchaseOrderFilter";

const PurchaseOrderManagement = () => {
  const t = useTranslation();
  const navigate = useNavigate();
  const [purchaseOrders, setPurchaseOrders] = useState<
  PurchaseOrder[]
  >([]);
  const { caterings } = useCateringStore();
  const { suppliers } = useSupplierStore();

  const [statusOptions] = useMemo(() => {
    return statusOrderOptions(t);
  }, [t]);

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
  } = useFilterData<PurchaseOrder, FilterType>({
    dataLoader: dataLoader,
    filter,
    defaultCondition,
  });

  const onChangeDateRange = (from?: number, to?: number) => {
    if (condition?.from && condition?.to && from && to) {
      const _from = startOfDay(from);
      const _to = endOfWeek(to);
      if (from < condition.from || to > condition.to) {
        getData(_from, _to);
      }
      updateCondition("from", "", _from);
      updateCondition("to", "", to);
    }
  };

  const onRowClick = (item: PurchaseOrder) => {
    navigate(`/purchase-order-management/${item.id}`);
  };

  return (
    <Stack gap={10} key={caterings.size}>
      <Flex justify="end" align="end" gap={10} key={counter}>
        <PurchaseOrderFilter
          keyword={keyword}
          from={condition?.from}
          to={condition?.to}
          statuses={condition?.statuses}
          receivingCateringIds={condition?.receivingCateringIds}
          supplierIds={condition?.supplierIds}
          purchaseOrderIds={names}
          statusOptions={statusOptions}
          clearable={filtered}
          onClear={reset}
          onReload={reload}
          onChangeStatuses={updateCondition.bind(
            null,
            "statuses",
            "",
          )}
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
      </Flex>
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
