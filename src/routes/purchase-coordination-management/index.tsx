import DataGrid from "@/components/common/DataGrid";
import {
  FilterType,
  defaultCondition,
  filter,
} from "@/configs/filters/purchase-coordination";
import useFilterData from "@/hooks/useFilterData";
import useTranslation from "@/hooks/useTranslation";
import {
  PurchaseCoordination,
  getPurchaseCoordinations,
  typePriorityAndStatusCoordinationsOptions,
} from "@/services/domain";
import useCateringStore from "@/stores/catering.store";
import useUserStore from "@/stores/user.store";
import { endOfWeek, startOfDay } from "@/utils";
import { Flex, Stack } from "@mantine/core";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { configs } from "./_config";
import PurchaseCoordinationFilter from "./components/PurchaseCoordinationFilter";

const PurchaseCoordinationManagement = () => {
  const t = useTranslation();
  const navigate = useNavigate();
  const [purchaseCoordinations, setPurchaseCoordinations] = useState<
  PurchaseCoordination[]
  >([]);
  const { caterings } = useCateringStore();
  const { users } = useUserStore();

  const [typeOptions, priorityOptions, statusOptions] =
    useMemo(() => {
      return typePriorityAndStatusCoordinationsOptions(t);
    }, [t]);

  const dataGridConfigs = useMemo(
    () => configs(t, caterings, users),
    [t, caterings, users],
  );

  const getData = async (from?: number, to?: number) => {
    setPurchaseCoordinations(
      await getPurchaseCoordinations(from, to),
    );
  };

  useEffect(() => {
    getData();
  }, []);

  const dataLoader = useCallback(() => {
    return purchaseCoordinations;
  }, [purchaseCoordinations]);

  const {
    condition,
    counter,
    data,
    page,
    setPage,
    updateCondition,
    filtered,
    reset,
  } = useFilterData<PurchaseCoordination, FilterType>({
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

  const onRowClick = (item: PurchaseCoordination) => {
    navigate(`/purchase-coordination-management/detail/${item.id}`);
  };

  return (
    <Stack gap={10} key={caterings.size}>
      <Flex justify="end" align="end" gap={10} key={counter}>
        <PurchaseCoordinationFilter
          from={condition?.from}
          to={condition?.to}
          types={condition?.types}
          priorities={condition?.priorities}
          statuses={condition?.statuses}
          receivingCateringIds={condition?.receivingCateringIds}
          typeOptions={typeOptions}
          priorityOptions={priorityOptions}
          statusOptions={statusOptions}
          clearable={filtered}
          onClear={reset}
          onChangeTypes={updateCondition.bind(null, "types", "")}
          onChangePriorities={updateCondition.bind(
            null,
            "priorities",
            "",
          )}
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

export default PurchaseCoordinationManagement;