import CustomButton from "@/components/c-catering/CustomButton";
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
  configs,
  defaultCondition,
  filter,
  FilterType,
} from "./_configs";
import store from "./_inventory.store";
import Filter from "./components/Filter";

const CheckInventory = () => {
  const t = useTranslation();
  const { cateringId: userCateringId, isCatering } = useAuthStore();
  const { materials } = useMaterialStore();
  const { departmentNameById } = useMetaDataStore();
  const [cateringId, setCateringId] = useState("");
  const [caterings, setCaterings] = useState<Department[]>([]);
  const { updated, key, isAuditedAllItems } = useSyncExternalStore(
    store.subscribe,
    store.getSnapshot,
  );

  const dataGridConfigs = useMemo(
    () => configs(t, isAuditedAllItems, store.setAuditedAllItems),
    [isAuditedAllItems, t],
  );

  const dataLoader = useCallback(() => {
    return Array.from(materials.values());
  }, [materials]);

  const {
    condition,
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
    if (isCatering) {
      setCatering(userCateringId);
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
      <Flex hiddenFrom="sm" justify="end">
        <CustomButton confirm disabled={!updated} onClick={save}>
          {t("Save")}
        </CustomButton>
      </Flex>
      <Filter
        cateringId={cateringId}
        caterings={caterings}
        condition={condition}
        keyword={keyword}
        names={names}
        filtered={filtered}
        reset={reset}
        reload={reload}
        updateCondition={updateCondition}
        setCatering={setCatering}
        setCondition={setCondition}
        updated={updated}
        save={save}
      />
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
