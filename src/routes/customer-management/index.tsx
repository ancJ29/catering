import Autocomplete from "@/components/common/Autocomplete";
import DataGrid from "@/components/common/DataGrid";
import useFilterData from "@/hooks/useFilterData";
import useTranslation from "@/hooks/useTranslation";
import { Customer, getAllCustomers } from "@/services/domain";
import { Flex, Stack } from "@mantine/core";
import { useMemo } from "react";
import { configs } from "./_configs";

const CustomerManagement = () => {
  const t = useTranslation();
  const dataGridConfigs = useMemo(() => configs(t), [t]);
  const { data, names, filter, change } = useFilterData<Customer>({
    reload: getAllCustomers,
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

export default CustomerManagement;
