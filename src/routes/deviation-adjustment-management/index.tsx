import { poStatusSchema } from "@/auto-generated/api-configs";
import DataGrid from "@/components/common/DataGrid";
import useFilterData from "@/hooks/useFilterData";
import useTranslation from "@/hooks/useTranslation";
import {
  getPurchaseOrders,
  PurchaseOrder,
  statusOrderOptions,
} from "@/services/domain";
import useCateringStore from "@/stores/catering.store";
import useSupplierStore from "@/stores/supplier.store";
import { endOfWeek, startOfDay } from "@/utils";
import { Stack } from "@mantine/core";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  configs,
  defaultCondition,
  filter,
  FilterType,
} from "./_configs";
import Filter from "./components/Filter";

const DeviationAdjustmentManagement = () => {
  const t = useTranslation();
  const navigate = useNavigate();
  const { caterings } = useCateringStore();
  const { suppliers } = useSupplierStore();
  const [currents, setCurrents] = useState<PurchaseOrder[]>([]);

  const [statusOptions] = useMemo(() => {
    return statusOrderOptions(t);
  }, [t]);

  const dataGridConfigs = useMemo(
    () => configs(t, caterings, suppliers),
    [t, caterings, suppliers],
  );

  const getData = async (from?: number, to?: number) => {
    setCurrents(
      await getPurchaseOrders({
        from,
        to,
        statuses: [
          poStatusSchema.Values.DNK,
          poStatusSchema.Values.DKTSL,
        ],
      }),
    );
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
    return currents;
  }, [currents]);

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
    navigate(`/deviation-adjustment-management/${item.id}`);
  };

  return (
    <Stack gap={10} key={suppliers.size}>
      <Filter
        key={counter}
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

export default DeviationAdjustmentManagement;
