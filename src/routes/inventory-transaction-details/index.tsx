import DataGrid from "@/components/common/DataGrid";
import useFilterData from "@/hooks/useFilterData";
import useTranslation from "@/hooks/useTranslation";
import { MonthlyInventory } from "@/services/domain";
import useCateringStore from "@/stores/catering.store";
import useMaterialStore from "@/stores/material.store";
import { Stack } from "@mantine/core";
import { modals } from "@mantine/modals";
import {
  useCallback,
  useEffect,
  useMemo,
  useSyncExternalStore,
} from "react";
import {
  FilterType,
  configs,
  defaultCondition,
  filter,
} from "./_configs";
import store from "./_monthly_inventory.store";
import Filter from "./components/Filter";
import WarehouseReceiptDetails from "./components/WarehouseReceiptDetails";

const InventoryTransactionDetails = () => {
  const t = useTranslation();
  const { materials } = useMaterialStore();
  const { activeCaterings } = useCateringStore();

  const { currents, key, date } = useSyncExternalStore(
    store.subscribe,
    store.getSnapshot,
  );

  useEffect(() => {
    store.initData();
  }, []);

  const open = useCallback(
    (
      monthlyInventoryId: string,
      cateringId: string,
      materialId: string,
    ) => {
      modals.open({
        centered: true,
        size: "100%",
        children: (
          <WarehouseReceiptDetails
            monthlyInventoryId={monthlyInventoryId}
            cateringId={cateringId}
            materialId={materialId}
          />
        ),
      });
    },
    [],
  );

  const dataGridConfigs = useMemo(
    () => configs(t, materials, activeCaterings, open),
    [activeCaterings, materials, t, open],
  );

  const dataLoader = useCallback(() => {
    return Object.values(currents);
  }, [currents]);

  const {
    condition,
    counter,
    data,
    filtered,
    keyword,
    names,
    page,
    reload,
    reset,
    setPage,
    updateCondition,
  } = useFilterData<MonthlyInventory, FilterType>({
    dataLoader,
    filter,
    defaultCondition,
  });

  const onChangeDate = (date: number) => {
    store.initData(date);
  };

  return (
    <Stack gap={10} key={activeCaterings.size}>
      <Filter
        key={counter}
        keyword={keyword}
        cateringId={condition?.cateringId}
        type={condition?.type}
        group={condition?.group}
        date={date}
        materialNames={names}
        clearable={filtered}
        onClear={reset}
        onReload={reload}
        onChangeCateringId={updateCondition.bind(
          null,
          "cateringId",
          "",
        )}
        onChangeType={updateCondition.bind(null, "type", "")}
        onChangeGroup={updateCondition.bind(null, "group", "")}
        onChangeDate={onChangeDate}
      />
      <DataGrid
        key={key}
        page={page}
        limit={10}
        isPaginated
        hasOrderColumn
        columns={dataGridConfigs}
        data={data}
        onChangePage={setPage}
        hasUpdateColumn={false}
      />
    </Stack>
  );
};

export default InventoryTransactionDetails;
