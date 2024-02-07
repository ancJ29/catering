import { Actions } from "@/auto-generated/api-configs";
import Autocomplete from "@/components/common/Autocomplete";
import DataGrid from "@/components/common/DataGrid";
import useOnMounted from "@/hooks/useOnMounted";
import useTranslation from "@/hooks/useTranslation";
import { loadAll } from "@/services/data-loaders";
import { Flex, Stack } from "@mantine/core";
import { useCallback, useMemo, useState } from "react";
import { Customer, configs } from "./_configs";

const CustomerManagement = () => {
  const t = useTranslation();
  const dataGridConfigs = useMemo(() => configs(t), [t]);
  const [products, setProducts] = useState<Customer[]>([]);
  const [data, setData] = useState<Customer[]>([]);
  const [names, setNames] = useState([""]);

  const _reload = useCallback(() => {
    loadAll<Customer>({
      key: "customers",
      action: Actions.GET_CUSTOMERS,
    }).then((products) => {
      setProducts(products || []);
      setData(products || []);
      setNames(products.map((c) => c.name as string));
    });
  }, []);

  const filter = useCallback(
    (keyword: string) => {
      if (!keyword) {
        setData(products);
        return;
      }
      const _keyword = keyword.toLowerCase();
      setData(
        products.filter((c) =>
          (c.name as string)?.toLocaleLowerCase().includes(_keyword),
        ),
      );
    },
    [products],
  );

  useOnMounted(_reload);

  return (
    <Stack gap={10} w="100%" h="100%" p={10}>
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
