import { poStatusSchema } from "@/auto-generated/api-configs";
import DataGrid from "@/components/common/DataGrid";
import useFilterData from "@/hooks/useFilterData";
import useTranslation from "@/hooks/useTranslation";
import {
  getPurchaseOrdersByCatering,
  PurchaseOrderCatering,
} from "@/services/domain";
import useAuthStore from "@/stores/auth.store";
import useCateringStore from "@/stores/catering.store";
import useSupplierStore from "@/stores/supplier.store";
import { endOfDay, startOfDay } from "@/utils";
import { Stack } from "@mantine/core";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  configs,
  defaultCondition,
  filter,
  FilterType,
} from "./_configs";
import Filter from "./components/Filter";

const ExternalWarehouseEntry = () => {
  const t = useTranslation();
  const navigate = useNavigate();
  const [currents, setCurrents] = useState<PurchaseOrderCatering[]>(
    [],
  );
  const { caterings } = useCateringStore();
  const { suppliers } = useSupplierStore();
  const { cateringId, isCatering } = useAuthStore();

  const dataGridConfigs = useMemo(
    () => configs(t, caterings, suppliers),
    [t, caterings, suppliers],
  );

  const getData = async (from?: number, to?: number) => {
    setCurrents(
      await getPurchaseOrdersByCatering({
        from,
        to,
        statuses: [poStatusSchema.Values.DTC],
        receivingCateringId: isCatering ? cateringId : "xxx",
      }),
    );
  };

  useEffect(() => {
    getData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
  } = useFilterData<PurchaseOrderCatering, FilterType>({
    dataLoader: dataLoader,
    filter,
    defaultCondition,
  });

  const onChangeDateRange = (from?: number, to?: number) => {
    if (condition?.from && condition?.to && from && to) {
      const _from = startOfDay(from);
      const _to = endOfDay(to);
      if (from < condition.from || to > condition.to) {
        getData(_from, _to);
      }
      updateCondition("from", "", _from);
      updateCondition("to", "", to);
    }
  };

  const onRowClick = (item: PurchaseOrderCatering) => {
    navigate(`/external-warehouse-entry/${item.id}`);
  };

  return (
    <Stack gap={10} key={suppliers.size}>
      <Filter
        key={counter}
        keyword={keyword}
        from={condition?.from}
        to={condition?.to}
        statuses={condition?.statuses}
        supplierIds={condition?.supplierIds}
        purchaseOrderIds={names}
        clearable={filtered}
        onClear={reset}
        onReload={reload}
        onChangeStatuses={updateCondition.bind(null, "statuses", "")}
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

export default ExternalWarehouseEntry;
