import CustomButton from "@/components/c-catering/CustomButton";
import MaterialFilter from "@/components/c-catering/MaterialFilter";
import Autocomplete from "@/components/common/Autocomplete";
import DataGrid from "@/components/common/DataGrid";
import useFilterData from "@/hooks/useFilterData";
import useTranslation from "@/hooks/useTranslation";
import { Material, updateInventory } from "@/services/domain";
import {
  Department,
  getInventoryDepartments,
} from "@/services/domain/department";
import useMaterialStore from "@/stores/material.store";
import { buildMap } from "@/utils";
import { Flex, Stack } from "@mantine/core";
import {
  useCallback,
  useEffect,
  useMemo,
  useReducer,
  useState,
  useSyncExternalStore,
} from "react";
import {
  ActionType,
  MaterialFilterType,
  configs,
  defaultCondition,
  filter,
  reducer,
} from "./_configs";
import store from "./_inventory.store";

const CustomerManagement = () => {
  const t = useTranslation();
  const [key, setKey] = useState(Date.now());
  const { materials } = useMaterialStore();
  const dataGridConfigs = useMemo(() => configs(t), [t]);
  const { updated } = useSyncExternalStore(
    store.subscribe,
    store.getSnapshot,
  );

  const dataLoader = useCallback(() => {
    return Array.from(materials.values());
  }, [materials]);

  const {
    condition: materialCondition,
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
  } = useFilterData<Material, MaterialFilterType>({
    dataLoader,
    filter,
    defaultCondition: { type: "", group: "" },
  });

  const [condition, dispatch] = useReducer(reducer, defaultCondition);
  const [caterings, setCaterings] = useState<Department[]>([]);
  const cateringNameById = useMemo(
    () => buildMap(caterings),
    [caterings],
  );

  const setCatering = useCallback(
    (cateringId?: string) => {
      if (!cateringId) {
        dispatch({ type: ActionType.CLEAR_CATERING_ID });
        store.reset();
        return;
      }
      if (!cateringNameById.has(cateringId)) {
        return;
      }
      dispatch({
        type: ActionType.SET_CATERING_ID,
        cateringId,
      });
      store.load(cateringId).then(() => setKey(Date.now()));
    },
    [cateringNameById],
  );

  useEffect(() => {
    getInventoryDepartments().then(setCaterings);
  }, []);

  const save = useCallback(() => {
    updateInventory(store.getUpdates()).then(() => {
      condition.cateringId &&
        store
          .load(condition.cateringId)
          .then(() => setKey(Date.now()));
    });
  }, [condition.cateringId]);

  return (
    <Stack gap={10}>
      <Flex justify="space-between" align={"end"} gap={10} w="100%">
        <Autocomplete
          style={{ width: "20vw" }}
          key={condition.cateringId || "-"}
          label={t("Catering name")}
          defaultValue={
            cateringNameById.get(condition.cateringId || "") || ""
          }
          options={caterings.map((el) => ({
            label: el.name,
            value: el.id,
          }))}
          onClear={setCatering}
          onEnter={setCatering}
          onChange={setCatering}
        />
        {condition.cateringId ? (
          <Flex justify="end" align={"end"} gap={10} key={counter}>
            <MaterialFilter
              type={materialCondition?.type}
              group={materialCondition?.group}
              keyword={keyword}
              materialNames={names}
              clearable={filtered}
              clear={reset}
              onReload={reload}
              onChangeGroup={updateCondition.bind(null, "group", "")}
              onChangeType={(value) => {
                setCondition({
                  type: value,
                  group: "",
                });
              }}
            />
          </Flex>
        ) : (
          ""
        )}
        <CustomButton confirm disabled={!updated} onClick={save}>
          {t("Save")}
        </CustomButton>
      </Flex>
      <DataGrid
        key={key}
        page={page}
        limit={10}
        isPaginated
        hasOrderColumn
        hasUpdateColumn={false}
        columns={dataGridConfigs}
        data={condition.cateringId ? data : []}
        onChangePage={setPage}
        noResultText={
          condition.cateringId
            ? undefined
            : t("Please select a catering")
        }
      />
    </Stack>
  );
};

export default CustomerManagement;
