import MaterialFilter from "@/components/c-catering/MaterialFilter";
import DataGrid from "@/components/common/DataGrid";
import useFilterData from "@/hooks/useFilterData";
import useTranslation from "@/hooks/useTranslation";
import { Material } from "@/services/domain";
import materialStore from "@/stores/material.store";
import { Button, Flex, NumberInput } from "@mantine/core";
import { notifications } from "@mantine/notifications";
import { useCallback, useMemo, useSyncExternalStore } from "react";
import store from "../../_export.store";
import {
  configs,
  defaultCondition,
  filter,
  FilterType,
} from "./_configs";

const MaterialList = () => {
  const t = useTranslation();
  const { materials } = materialStore();
  const { currentInventories, key, isSelectAll } =
    useSyncExternalStore(store.subscribe, store.getSnapshot);

  const dataGridConfigs = useMemo(
    () => configs(t, currentInventories, isSelectAll),
    [currentInventories, t, isSelectAll],
  );

  const dataLoader = useCallback(() => {
    return Array.from(materials.values());
  }, [materials]);

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
    setCondition,
    setPage,
    updateCondition,
  } = useFilterData<Material, FilterType>({
    dataLoader,
    filter,
    defaultCondition,
  });

  const onClear = () => {
    reset();
    store.reset();
  };

  const addToExportReceipt = () => {
    store.addMaterialToExportReceipt();
    notifications.show({
      color: "green.5",
      message: t("Add successfully"),
    });
  };

  return (
    <Flex direction="column" gap={10}>
      <Flex justify="end" align="end" gap={10} key={counter}>
        <MaterialFilter
          type={condition?.type}
          group={condition?.group}
          keyword={keyword}
          materialNames={names}
          orderCycles={condition?.orderCycles}
          clearable={filtered}
          onClear={onClear}
          onReload={reload}
          onChangeGroup={updateCondition.bind(null, "group", "")}
          onChangeType={(value) => {
            setCondition({
              type: value,
              group: "",
              orderCycles: condition?.orderCycles || [],
            });
          }}
          onChangeOrderCycles={updateCondition.bind(
            null,
            "orderCycles",
            [],
          )}
        />
      </Flex>
      <Flex justify="space-between" align="end">
        <Flex gap={10}>
          <NumberInput
            label={t("Quantity")}
            value={store.getSelectedMaterialAmount()}
            w="15vw"
            disabled
            thousandSeparator=","
          />
          <NumberInput
            label={t("Total payment")}
            value={store.getSelectedMaterialTotal()}
            w="15vw"
            disabled
            thousandSeparator=","
          />
        </Flex>
        <Button onClick={addToExportReceipt}>
          {t("Add to export receipt")}
        </Button>
      </Flex>
      <DataGrid
        key={key}
        page={page}
        limit={5}
        isPaginated
        hasOrderColumn
        hasUpdateColumn={false}
        columns={dataGridConfigs}
        data={data}
        onChangePage={setPage}
      />
    </Flex>
  );
};
export default MaterialList;
