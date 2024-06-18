import PurchaseRequestFilter from "@/components/c-catering/PurchaseRequestFilter";
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
  typePriorityAndStatusOrderOptions,
} from "@/services/domain";
import useCateringStore from "@/stores/catering.store";
import { endOfWeek, startOfDay } from "@/utils";
import { Flex, Stack } from "@mantine/core";
import { useCallback, useEffect, useMemo, useState } from "react";
import { configs } from "./_config";

const InternalPurchasingOrderManagement = () => {
  const t = useTranslation();
  const [purchaseOrders, setPurchaseOrders] = useState<
  PurchaseOrder[]
  >([]);
  const { caterings } = useCateringStore();

  const [typeOptions, priorityOptions, statusOptions] =
    useMemo(() => {
      return typePriorityAndStatusOrderOptions(t);
    }, [t]);

  const dataGridConfigs = useMemo(
    () => configs(t, caterings),
    [t, caterings],
  );

  const getData = async (from?: number, to?: number) => {
    setPurchaseOrders(
      await getPurchaseOrders({ from, to, hasDepartment: true }),
    );
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

  return (
    <Stack gap={10}>
      <Flex justify="end" align="end" gap={10} key={counter}>
        <PurchaseRequestFilter
          keyword={keyword}
          from={condition?.from}
          to={condition?.to}
          types={condition?.types}
          priorities={condition?.priorities}
          statuses={condition?.statuses}
          departmentIds={condition?.departmentIds}
          purchaseOrderIds={names}
          typeOptions={typeOptions}
          priorityOptions={priorityOptions}
          statusOptions={statusOptions}
          clearable={filtered}
          onClear={reset}
          onReload={reload}
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
          onChangeDepartmentIds={updateCondition.bind(
            null,
            "departmentIds",
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

export default InternalPurchasingOrderManagement;
