import AutocompleteForFilterData from "@/components/c-catering/AutocompleteForFilterData";
import CustomButton from "@/components/c-catering/CustomButton";
import DataGrid from "@/components/common/DataGrid";
import Select from "@/components/common/Select";
import {
  FilterType,
  defaultCondition,
  filter,
} from "@/configs/filters/materials";
import useFilterData from "@/hooks/useFilterData";
import useTranslation from "@/hooks/useTranslation";
import { Material, typeAndGroupOptions } from "@/services/domain";
import useMaterialStore from "@/stores/material.store";
import useMetaDataStore from "@/stores/meta-data.store";
import { Flex, Stack } from "@mantine/core";
import { useCallback, useMemo } from "react";
import { configs } from "./_configs";

const MaterialManagement = () => {
  const t = useTranslation();
  const { materialGroupByType } = useMetaDataStore();
  const { materials } = useMaterialStore();
  const dataGridConfigs = useMemo(() => configs(t), [t]);

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
        <AutocompleteForFilterData
          label={t("Material name")}
          w={"20vw"}
          data={names}
          defaultValue={keyword}
          onReload={reload}
        />
        <CustomButton disabled={!filtered} onClick={reset}>
          {t("Clear")}
        </CustomButton>
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
