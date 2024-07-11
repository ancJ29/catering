import CateringSelector from "@/components/c-catering/CateringSelector";
import CustomButton from "@/components/c-catering/CustomButton";
import MaterialFilter from "@/components/c-catering/MaterialFilter";
import DataGrid from "@/components/common/DataGrid";
import useFilterData from "@/hooks/useFilterData";
import useTranslation from "@/hooks/useTranslation";
import useUrlHash from "@/hooks/useUrlHash";
import {
  Department,
  Material,
  getInventoryDepartments,
  updateInventory,
} from "@/services/domain";
import useMaterialStore from "@/stores/material.store";
import useMetaDataStore from "@/stores/meta-data.store";
import { Flex, Group, Radio, Stack } from "@mantine/core";
import {
  useCallback,
  useEffect,
  useMemo,
  useState,
  useSyncExternalStore,
} from "react";
import { CheckType, FilterType, configs, filter } from "./_configs";
import store from "./_inventory.store";

const CheckInventory = () => {
  const t = useTranslation();
  const { materials } = useMaterialStore();
  const { departmentNameById } = useMetaDataStore();
  const [key, setKey] = useState(Date.now());
  const [cateringId, setCateringId] = useState("");
  const [caterings, setCaterings] = useState<Department[]>([]);

  const { updated } = useSyncExternalStore(
    store.subscribe,
    store.getSnapshot,
  );

  const dataGridConfigs = useMemo(() => configs(t), [t]);

  const cateringName = useMemo(() => {
    return departmentNameById.get(cateringId) || "";
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
    defaultCondition: {
      type: "",
      group: "",
      checkType: CheckType.ALL,
    },
  });

  const setCatering = useCallback(
    (cateringId?: string) => {
      if (!cateringId) {
        setCateringId("");
        store.reset();
      } else if (departmentNameById.has(cateringId)) {
        setCateringId(cateringId);
        store.load(cateringId).then(() => {
          setKey(Date.now());
        });
      }
    },
    [departmentNameById],
  );

  const save = useCallback(() => {
    updateInventory(store.getUpdates()).then(() => {
      cateringId &&
        store.load(cateringId).then(() => setKey(Date.now()));
    });
  }, [cateringId]);

  const callback = useCallback(
    ({ cateringId }: { cateringId: string }) => {
      if (!cateringId) {
        return;
      }
      setCateringId(cateringId);
      store.load(cateringId).then(() => setKey(Date.now()));
    },
    [],
  );

  useUrlHash({ cateringId }, callback);

  useEffect(() => {
    getInventoryDepartments().then(setCaterings);
  }, []);

  return (
    <Stack gap={10}>
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
        <CustomButton
          w="4.5vw"
          confirm
          disabled={!updated}
          onClick={save}
        >
          {t("Save")}
        </CustomButton>
      </Flex>
      {cateringId && (
        <RadioGroup
          checkType={condition?.checkType || CheckType.ALL}
          onChange={updateCondition.bind(
            null,
            "checkType",
            CheckType.ALL,
          )}
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

function RadioGroup({
  checkType,
  onChange,
}: {
  checkType: CheckType;
  onChange: (value: CheckType) => void;
}) {
  const t = useTranslation();

  return (
    <Radio.Group
      value={checkType}
      onChange={(value) => onChange(value as CheckType)}
    >
      <Group>
        {Object.values(CheckType).map((el: CheckType, idx) => {
          return (
            <Radio
              h="2.2rem"
              pt=".8rem"
              key={idx}
              value={el}
              label={t(el)}
            />
          );
        })}
      </Group>
    </Radio.Group>
  );
}
