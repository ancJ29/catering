import DataGrid from "@/components/common/DataGrid";
import useFilterData from "@/hooks/useFilterData";
import useTranslation from "@/hooks/useTranslation";
import useUrlHash from "@/hooks/useUrlHash";
import {
  getPurchaseInternalsByCatering,
  PurchaseInternalCatering as PurchaseInternal,
} from "@/services/domain";
import useAuthStore from "@/stores/auth.store";
import useCateringStore from "@/stores/catering.store";
import { endOfDay, startOfDay } from "@/utils";
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

const InternalWarehouseEntry = () => {
  const t = useTranslation();
  const navigate = useNavigate();
  const [currents, setCurrents] = useState<PurchaseInternal[]>([]);
  const { caterings } = useCateringStore();
  const { cateringId, isCatering } = useAuthStore();

  const dataGridConfigs = useMemo(
    () => configs(t, caterings),
    [t, caterings],
  );

  const getData = useCallback(
    async (from?: number, to?: number) => {
      setCurrents(
        await getPurchaseInternalsByCatering(
          from,
          to,
          isCatering ? cateringId : "xxx",
        ),
      );
    },
    [cateringId, isCatering],
  );

  const dataLoader = useCallback(() => {
    return currents;
  }, [currents]);

  const {
    condition,
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
  } = useFilterData<PurchaseInternal, FilterType>({
    dataLoader: dataLoader,
    filter,
    defaultCondition,
  });

  useEffect(() => {
    getData(condition?.from, condition?.to);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const location = useLocation();
  useEffect(() => {
    if (location.state?.refresh) {
      getData(condition?.from, condition?.to);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.state]);

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
    [condition?.from, condition?.to, getData, updateCondition],
  );

  const callback = useCallback(
    (condition: FilterType) => {
      setCondition(condition);
      onChangeDateRange(condition?.from, condition?.to);
    },
    [onChangeDateRange, setCondition],
  );
  useUrlHash(condition ?? defaultCondition, callback);

  const onRowClick = (item: PurchaseInternal) => {
    navigate(`/internal-warehouse-entry/${item.id}`);
  };

  return (
    <Stack gap={10} key={caterings.size}>
      <Filter
        keyword={keyword}
        from={condition?.from}
        to={condition?.to}
        statuses={condition?.statuses}
        deliveryCateringIds={condition?.deliveryCateringIds}
        purchaseCoordinationIds={names}
        clearable={filtered}
        onClear={reset}
        onReload={reload}
        onChangeStatuses={updateCondition.bind(null, "statuses", "")}
        onChangeDeliveryCateringIds={updateCondition.bind(
          null,
          "deliveryCateringIds",
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

export default InternalWarehouseEntry;
