import { ClientRoles } from "@/auto-generated/api-configs";
import CateringSelector from "@/components/c-catering/CateringSelector";
import CustomButton from "@/components/c-catering/CustomButton";
import MaterialFilter from "@/components/c-catering/MaterialFilter";
import DataGrid from "@/components/common/DataGrid";
import useFilterData from "@/hooks/useFilterData";
import useTranslation from "@/hooks/useTranslation";
import useUrlHash from "@/hooks/useUrlHash";
import {
  Department,
  getInventoryDepartments,
  Material,
} from "@/services/domain";
import useAuthStore from "@/stores/auth.store";
import useMaterialStore from "@/stores/material.store";
import useMetaDataStore from "@/stores/meta-data.store";
import { Flex, Stack } from "@mantine/core";
import {
  useCallback,
  useEffect,
  useMemo,
  useState,
  useSyncExternalStore,
} from "react";
import {
  CheckType,
  configs,
  defaultCondition,
  filter,
  FilterType,
} from "./_configs";
import store from "./_inventory.store";
import RadioChecked from "./components/RadioChecked";

const CheckInventory = () => {
  const t = useTranslation();
  const { user, role } = useAuthStore();
  const { materials } = useMaterialStore();
  const { departmentNameById } = useMetaDataStore();
  const [cateringId, setCateringId] = useState("");
  const [caterings, setCaterings] = useState<Department[]>([]);
  const { updated, key, isAuditedAllItems } = useSyncExternalStore(
    store.subscribe,
    store.getSnapshot,
  );

  const dataGridConfigs = useMemo(
    () =>
      configs(
        t,
        materials,
        isAuditedAllItems,
        store.setAuditedAllItems,
      ),
    [isAuditedAllItems, materials, t],
  );

  const cateringName = useMemo(() => {
    return departmentNameById.get(cateringId || "") || "";
  }, [cateringId, departmentNameById]);

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

  useEffect(() => {
    if (role === ClientRoles.CATERING) {
      setCatering(user?.departmentIds?.[0]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const setCatering = useCallback(
    (cateringId?: string) => {
      if (!cateringId) {
        setCateringId("");
        store.reset();
      } else if (departmentNameById.has(cateringId)) {
        setCateringId(cateringId);
        store.setCateringId(cateringId);
        // .then(() => setKey(Date.now()));
      }
    },
    [departmentNameById],
  );

  const save = useCallback(() => {
    store.save();
  }, []);

  const callback = useCallback(
    ({ cateringId }: { cateringId?: string }) => {
      if (!cateringId) {
        return;
      }
      setCateringId(cateringId);
      store.setCateringId(cateringId);
      // .then(() => setKey(Date.now()));
    },
    [],
  );
  useUrlHash({ cateringId }, callback);

  useEffect(() => {
    getInventoryDepartments().then(setCaterings);
  }, []);

  return (
    <Stack gap={10}>
      {/* <PendingOrderActions /> */}
      <Flex justify="space-between" align="end" gap={10} w="100%">
        <CateringSelector
          style={{ width: "20vw" }}
          cateringName={cateringName}
          caterings={caterings}
          setCatering={setCatering}
        />
        {cateringId && (
          <Flex
            justify="end"
            align="end"
            gap={10}
            key={counter}
            w="75%"
          >
            <MaterialFilter
              type={condition?.type}
              group={condition?.group}
              keyword={keyword}
              materialNames={names}
              clearable={filtered}
              onClear={() => {
                reset();
                setCatering("");
              }}
              onReload={reload}
              onChangeGroup={updateCondition.bind(null, "group", "")}
              onChangeType={(value) => {
                setCondition({
                  type: value,
                  group: "",
                  checkType: condition?.checkType || CheckType.ALL,
                });
              }}
            />
          </Flex>
        )}
        <CustomButton confirm disabled={!updated} onClick={save}>
          {t("Save")}
        </CustomButton>
      </Flex>
      {cateringId && (
        <RadioChecked
          condition={condition}
          updateCondition={updateCondition}
        />
      )}
      <DataGrid
        key={key}
        page={page}
        limit={10}
        isPaginated
        hasOrderColumn
        hasUpdateColumn={false}
        columns={dataGridConfigs}
        data={cateringId ? data : []}
        onChangePage={setPage}
        noResultText={
          cateringId ? undefined : t("Please select a catering")
        }
      />
    </Stack>
  );
};

export default CheckInventory;
