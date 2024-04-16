import MaterialFilter from "@/components/c-catering/MaterialFilter";
import DataGrid from "@/components/common/DataGrid";
import {
  FilterType,
  defaultCondition,
  filter,
} from "@/configs/filters/materials";
import useFilterData from "@/hooks/useFilterData";
import useTranslation from "@/hooks/useTranslation";
import { Material } from "@/services/domain";
import useMaterialStore from "@/stores/material.store";
import { Flex, Stack } from "@mantine/core";
import { useCallback, useMemo } from "react";
import { configs } from "./_configs";

const MaterialManagement = () => {
  const t = useTranslation();
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

  return (
    <Stack gap={10}>
      <Flex justify="end" align={"end"} gap={10} key={counter}>
        <MaterialFilter
          type={condition?.type}
          group={condition?.group}
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
