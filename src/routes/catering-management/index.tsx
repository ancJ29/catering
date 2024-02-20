import Autocomplete from "@/components/common/Autocomplete";
import DataGrid from "@/components/common/DataGrid";
import useFilterData from "@/hooks/useFilterData";
import useOnMounted from "@/hooks/useOnMounted";
import useTranslation from "@/hooks/useTranslation";
import useCateringStore from "@/stores/catering.store";
import { Flex, Stack } from "@mantine/core";
import { useCallback, useMemo } from "react";
import { Department, configs } from "./_configs";

const CateringManagement = () => {
  const t = useTranslation();
  const { reload: reloadCatering, caterings } = useCateringStore();
  const dataGridConfigs = useMemo(() => configs(t), [t]);

  useOnMounted(reloadCatering);

  const reload = useCallback(() => {
    return Array.from(caterings.values());
  }, [caterings]);
  const { data, names, filter, change } = useFilterData<Department>({
    reload,
  });

  return (
    <Stack gap={10}>
      <Flex justify="end" align={"center"}>
        <Autocomplete
          onEnter={filter}
          data={names}
          onChange={change}
        />
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
