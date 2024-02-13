import Autocomplete from "@/components/common/Autocomplete";
import DataGrid from "@/components/common/DataGrid";
import useOnMounted from "@/hooks/useOnMounted";
import useTranslation from "@/hooks/useTranslation";
import { Customer, getAllCustomers } from "@/services/domain";
import { Flex, Stack } from "@mantine/core";
import { useCallback, useMemo, useState } from "react";
import { configs } from "./_configs";

const CustomerManagement = () => {
  const t = useTranslation();
  const dataGridConfigs = useMemo(() => configs(t), [t]);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [data, setData] = useState<Customer[]>([]);
  const [names, setNames] = useState([""]);

  const _reload = useCallback(() => {
    getAllCustomers().then((customers) => {
      setCustomers(customers || []);
      setData(customers || []);
      setNames(customers.map((c) => c.name as string));
    });
  }, []);

  const filter = useCallback(
    (keyword: string) => {
      if (!keyword) {
        setData(customers);
        return;
      }
      const _keyword = keyword.toLowerCase();
      setData(
        customers.filter((c) =>
          (c.name as string)?.toLocaleLowerCase().includes(_keyword),
        ),
      );
    },
    [customers],
  );

  useOnMounted(_reload);

  return (
    <Stack gap={10}>
      <Flex justify="end" align={"center"}>
        <Autocomplete onEnter={filter} data={names} />
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
