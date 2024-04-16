import AutocompleteForFilterData from "@/components/c-catering/AutocompleteForFilterData";
import DataGrid from "@/components/common/DataGrid";
import useFilterData from "@/hooks/useFilterData";
import useTranslation from "@/hooks/useTranslation";
import {
  Department,
  getInventoryDepartments,
} from "@/services/domain/department";
import { Flex, Stack } from "@mantine/core";
import { useMemo } from "react";
import { configs } from "./_configs";

const CustomerManagement = () => {
  const t = useTranslation();
  const dataGridConfigs = useMemo(() => configs(t), [t]);

  const { data, names, reload } = useFilterData<Department>({
    dataLoader: getInventoryDepartments,
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

export default CustomerManagement;
