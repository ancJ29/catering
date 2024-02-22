import Autocomplete from "@/components/common/Autocomplete";
import DataGrid from "@/components/common/DataGrid";
import Select from "@/components/common/Select";
import useFilterData from "@/hooks/useFilterData";
import useOnMounted from "@/hooks/useOnMounted";
import useTranslation from "@/hooks/useTranslation";
import { Material, typeAndGroupOptions } from "@/services/domain";
import useMaterialStore from "@/stores/material.store";
import useMetaDataStore from "@/stores/meta-data.store";
import { Button, Flex, Stack } from "@mantine/core";
import { useCallback, useMemo } from "react";
import {
  FilterType,
  configs,
  defaultCondition,
  filter,
} from "./_configs";

const MaterialManagement = () => {
  const t = useTranslation();
  const { materialGroupByType } = useMetaDataStore();
  const { materials, reload: reloadMaterial } = useMaterialStore();
  const dataGridConfigs = useMemo(() => configs(t), [t]);
  useOnMounted(reloadMaterial);

  const dataLoader = useCallback(() => {
    return Array.from(materials.values());
  }, [materials]);

  const {
    condition,
    counter,
    data,
    names,
    page,
    onKeywordChanged,
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

  const [typeOptions, groupOptions] = useMemo(() => {
    return typeAndGroupOptions(
      materialGroupByType,
      condition?.type || "",
      t,
    );
  }, [materialGroupByType, t, condition]);

  return (
    <Stack gap={10}>
      <Flex justify="end" align={"end"} gap={10} key={counter}>
        <Select
          value={condition?.type || ""}
          label={t("Material type")}
          w={"20vw"}
          options={typeOptions}
          onChange={(value) => {
            setCondition({
              type: value || "",
              group: "",
            });
          }}
        />
        <Select
          value={condition?.group || ""}
          label={t("Material group")}
          w={"20vw"}
          options={groupOptions}
          onChange={updateCondition.bind(null, "group", "")}
        />
        <Autocomplete
          label={t("Material name")}
          w={"20vw"}
          onEnter={reload}
          data={names}
          onChange={onKeywordChanged}
        />
        <Button onClick={reset}>{t("Clear")}</Button>
      </Flex>
      <DataGrid
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

export default MaterialManagement;
