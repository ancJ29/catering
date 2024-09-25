import AddButton from "@/components/c-catering/AddButton";
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
import { Stack } from "@mantine/core";
import { modals } from "@mantine/modals";
import { useCallback, useMemo } from "react";
import { configs } from "./_configs";
import AddMaterialForm from "./components/AddMaterialForm";
import Filter from "./components/Filter";
import UpdateMaterialForm from "./components/UpdateMaterialForm";

const MaterialManagement = () => {
  const t = useTranslation();
  const { materials, reload: reloadMaterial } = useMaterialStore();
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

  const _reload = useCallback(async () => {
    reloadMaterial(true);
    modals.closeAll();
  }, [reloadMaterial]);

  const addMaterial = useCallback(() => {
    modals.open({
      title: t("Add material"),
      classNames: { title: "c-catering-font-bold" },
      centered: true,
      size: "lg",
      children: <AddMaterialForm onSuccess={_reload} />,
    });
  }, [_reload, t]);

  const updateMaterial = useCallback(
    (material: Material) => {
      modals.open({
        title: t("Update material"),
        classNames: { title: "c-catering-font-bold" },
        centered: true,
        size: "lg",
        children: (
          <UpdateMaterialForm
            material={material}
            onSuccess={_reload}
          />
        ),
      });
    },
    [_reload, t],
  );

  return (
    <Stack gap={10} pos="relative">
      <AddButton onClick={addMaterial} />
      <Filter
        counter={counter}
        condition={condition}
        keyword={keyword}
        names={names}
        filtered={filtered}
        reset={reset}
        reload={reload}
        updateCondition={updateCondition}
        setCondition={setCondition}
      />
      <DataGrid
        page={page}
        limit={10}
        isPaginated
        hasOrderColumn
        columns={dataGridConfigs}
        data={data}
        onChangePage={setPage}
        onRowClick={updateMaterial}
      />
    </Stack>
  );
};

export default MaterialManagement;
