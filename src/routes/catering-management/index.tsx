import { Actions } from "@/auto-generated/api-configs";
import Autocomplete from "@/components/common/Autocomplete";
import DataGrid from "@/components/common/DataGrid";
import useFilterData from "@/hooks/useFilterData";
import useTranslation from "@/hooks/useTranslation";
import { loadAll } from "@/services/data-loaders";
import useMetaDataStore from "@/stores/meta-data.store";
import { Flex, Stack } from "@mantine/core";
import { useCallback, useMemo } from "react";
import { Department, configs } from "./_configs";

const CateringManagement = () => {
  const t = useTranslation();
  const { kitchenType } = useMetaDataStore();
  const dataGridConfigs = useMemo(() => configs(t), [t]);

  const _reload = useCallback(() => {
    if (!kitchenType) {
      return;
    }
    return loadAll<Department>({
      key: "departments",
      action: Actions.GET_DEPARTMENTS,
      params: { type: kitchenType },
    });
  }, [kitchenType]);

  const { data, names, filter, change } = useFilterData<Department>({
    reload: _reload,
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
