import AutocompleteForFilterData from "@/components/c-catering/AutocompleteForFilterData";
import DataGrid from "@/components/common/DataGrid";
import useFilterData from "@/hooks/useFilterData";
import useTranslation from "@/hooks/useTranslation";
import useCateringStore from "@/stores/catering.store";
import { Button, Flex, Stack } from "@mantine/core";
import { modals } from "@mantine/modals";
import { useCallback, useMemo } from "react";
import { Department, configs } from "./_configs";
import AddCateringForm from "./components/AddCateringForm";
import UpdateCateringForm from "./components/UpdateCateringForm";

const CateringManagement = () => {
  const t = useTranslation();
  const { caterings, reload: reloadCatering } = useCateringStore();
  const dataGridConfigs = useMemo(() => configs(t), [t]);

  const dataLoader = useCallback(() => {
    return Array.from(caterings.values());
  }, [caterings]);

  const { data, names, reload } = useFilterData<Department>({
    dataLoader,
  });

  const _reload = useCallback(async () => {
    reloadCatering(true);
    modals.closeAll();
  }, [reloadCatering]);

  const addCatering = useCallback(() => {
    modals.open({
      title: t("Add catering"),
      classNames: { title: "c-catering-font-bold" },
      centered: true,
      size: "lg",
      children: <AddCateringForm onSuccess={_reload} />,
    });
  }, [_reload, t]);

  const updateCatering = useCallback(
    (catering: Department) => {
      modals.open({
        title: t("Update catering"),
        classNames: { title: "c-catering-font-bold" },
        centered: true,
        size: "lg",
        children: (
          <UpdateCateringForm
            catering={catering}
            onSuccess={_reload}
          />
        ),
      });
    },
    [_reload, t],
  );

  return (
    <Stack gap={10}>
      <Flex justify="space-between" align="center">
        <AutocompleteForFilterData
          data={names}
          onReload={reload}
          w={{ base: "50%", sm: "20rem" }}
        />
        <Button onClick={addCatering}>{t("Add")}</Button>
      </Flex>
      <DataGrid
        hasOrderColumn
        columns={dataGridConfigs}
        data={data}
        onRowClick={updateCatering}
      />
    </Stack>
  );
};

export default CateringManagement;
