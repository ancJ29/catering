import AutocompleteForFilterData from "@/components/c-catering/AutocompleteForFilterData";
import DataGrid from "@/components/common/DataGrid";
import useFilterData from "@/hooks/useFilterData";
import useTranslation from "@/hooks/useTranslation";
import useCateringStore from "@/stores/catering.store";
import { Flex, Stack } from "@mantine/core";
import { useCallback, useMemo } from "react";
import { Department, configs } from "./_configs";

const CateringManagement = () => {
  const t = useTranslation();
  const { caterings } = useCateringStore();
  const dataGridConfigs = useMemo(() => configs(t), [t]);

  const dataLoader = useCallback(() => {
    return Array.from(caterings.values());
  }, [caterings]);

  const { data, names, reload } = useFilterData<Department>({
    dataLoader,
  });

  return (
    <Stack gap={10}>
      <Flex justify="end" align={"center"}>
        <AutocompleteForFilterData data={names} onReload={reload} />
      </Flex>
      <DataGrid
        hasOrderColumn
        columns={dataGridConfigs}
        data={data}
      />
    </Stack>
  );
};

export default CateringManagement;
