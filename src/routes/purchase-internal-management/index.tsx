import DataGrid from "@/components/common/DataGrid";
import {
  FilterType,
  defaultCondition,
  filter,
} from "@/configs/filters/purchase-internal";
import useFilterData from "@/hooks/useFilterData";
import useTranslation from "@/hooks/useTranslation";
import {
  PurchaseInternal,
  getPurchaseInternals,
  statusInternalOptions,
} from "@/services/domain";
import useCateringStore from "@/stores/catering.store";
import { endOfWeek, startOfDay } from "@/utils";
import { Flex, Stack } from "@mantine/core";
import { useCallback, useEffect, useMemo, useState } from "react";
import { configs } from "./_config";
import PurchaseInternalFilter from "./components/PurchaseInternalFilter";

const PurchaseInternalManagement = () => {
  const t = useTranslation();
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

  return (
    <Stack gap={10} key={caterings.size}>
      <Flex justify="end" align="end" gap={10} key={counter}>
        <PurchaseInternalFilter
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
          onChangeDeliveryCateringIds={updateCondition.bind(
            null,
            "deliveryCateringIds",
            "",
          )}
          onChangeDateRange={onChangeDateRange}
        />
      </Flex>
      <DataGrid
        // onRowClick={onRowClick}
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
