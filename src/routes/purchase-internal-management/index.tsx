import DataGrid from "@/components/common/DataGrid";
import useFilterData from "@/hooks/useFilterData";
import useTranslation from "@/hooks/useTranslation";
import {
  PurchaseInternal,
  getPurchaseInternals,
  statusInternalOptions,
} from "@/services/domain";
import useCateringStore from "@/stores/catering.store";
import { endOfWeek, startOfDay } from "@/utils";
import { Stack } from "@mantine/core";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  FilterType,
  configs,
  defaultCondition,
  filter,
} from "./_configs";
import Filter from "./components/Filter";

const PurchaseInternalManagement = () => {
  const t = useTranslation();
  const navigate = useNavigate();
  const [purchaseInternals, setPurchaseInternals] = useState<
    PurchaseInternal[]
  >([]);
  const { caterings } = useCateringStore();

  const [statusOptions] = useMemo(() => {
    return statusInternalOptions(t);
  }, [t]);

  const dataGridConfigs = useMemo(
    () => configs(t, caterings),
    [t, caterings],
  );

  const getData = async (from?: number, to?: number) => {
    setPurchaseInternals(await getPurchaseInternals(from, to));
  };

  useEffect(() => {
    getData();
  }, []);

  const dataLoader = useCallback(() => {
    return purchaseInternals;
  }, [purchaseInternals]);

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
  } = useFilterData<PurchaseInternal, FilterType>({
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

  const onRowClick = (item: PurchaseInternal) => {
    navigate(`/purchase-internal-management/${item.id}`);
  };

  return (
    <Stack gap={10} key={caterings.size}>
      <Filter
        keyword={keyword}
        from={condition?.from}
        to={condition?.to}
        statuses={condition?.statuses}
        receivingCateringIds={condition?.receivingCateringIds}
        deliveryCateringIds={condition?.deliveryCateringIds}
        purchaseCoordinationIds={names}
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

export default PurchaseInternalManagement;
