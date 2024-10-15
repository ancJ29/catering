import AddButton from "@/components/c-catering/AddButton";
import AutocompleteForFilterData from "@/components/c-catering/AutocompleteForFilterData";
import DataGrid from "@/components/common/DataGrid";
import useFilterData from "@/hooks/useFilterData";
import useTranslation from "@/hooks/useTranslation";
import useUrlHash from "@/hooks/useUrlHash";
import useCateringStore from "@/stores/catering.store";
import { Flex, Stack, Switch } from "@mantine/core";
import { modals } from "@mantine/modals";
import { useCallback, useMemo } from "react";
import {
  CateringRequest,
  Department,
  FilterType,
  configs,
  defaultCondition,
  filter,
} from "./_configs";
import AddCateringForm from "./components/AddCateringForm";
import UpdateCateringForm from "./components/UpdateCateringForm";

const CateringManagement = () => {
  const t = useTranslation();
  const { caterings } = useCateringStore();
  const dataGridConfigs = useMemo(() => configs(t), [t]);

  const dataLoader = useCallback(() => {
    return Array.from(caterings.values());
  }, [caterings]);

  const {
    condition,
    data,
    keyword,
    names,
    reload,
    updateCondition,
    setCondition,
  } = useFilterData<Department, FilterType>({
    dataLoader,
    filter,
    defaultCondition,
  });

  const callback = useCallback(
    (condition: FilterType) => {
      setCondition(condition);
    },
    [setCondition],
  );
  useUrlHash(condition ?? defaultCondition, callback);

  const addCatering = useCallback(
    (values?: CateringRequest) => {
      modals.open({
        title: t("Add catering"),
        classNames: { title: "c-catering-font-bold" },
        centered: true,
        size: "lg",
        children: (
          <AddCateringForm initValue={values} reOpen={addCatering} />
        ),
      });
    },
    [t],
  );

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
            reOpen={updateCatering}
          />
        ),
      });
    },
    [t],
  );

  return (
    <Stack gap={15} pos="relative">
      <AddButton onClick={() => addCatering()} label="Add catering" />
      <Flex justify="space-between" align="center">
        <Switch
          mt={10}
          checked={condition?.onSaleOnly ?? false}
          onChange={updateCondition.bind(
            null,
            "onSaleOnly",
            false,
            !(condition?.onSaleOnly ?? false),
            keyword,
          )}
          label={t("Active catering ONLY")}
        />
        <AutocompleteForFilterData
          data={names}
          onReload={reload}
          w={{ base: "50%", sm: "20rem" }}
        />
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
