import {
  Actions,
  configs as actionConfigs,
} from "@/auto-generated/api-configs";
import Autocomplete from "@/components/common/Autocomplete";
import DataGrid from "@/components/common/DataGrid";
import useOnMounted from "@/hooks/useOnMounted";
import useTranslation from "@/hooks/useTranslation";
import callApi from "@/services/api";
import { GenericObject } from "@/types";
import { Flex, Stack } from "@mantine/core";
import { useCallback, useMemo, useState } from "react";
import { z } from "zod";
import configs from "./_configs";

const { request, response } =
  actionConfigs[Actions.GET_CUSTOMERS].schema;
export type Request = z.infer<typeof request>;
export type Response = z.infer<typeof response>;

const CustomerManagement = () => {
  const t = useTranslation();
  const dataGridConfigs = useMemo(() => configs(t), [t]);
  const [products, setProducts] = useState<GenericObject[]>([]);
  const [data, setData] = useState<GenericObject[]>([]);
  const [names, setNames] = useState([""]);

  const _reload = useCallback(async (noCache?: boolean) => {
    if (noCache) {
      await new Promise((resolve) => setTimeout(resolve, 300));
    }
    _loadData(noCache).then((products) => {
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

async function _loadData(
  noCache?: boolean,
  cursor?: string,
): Promise<GenericObject[]> {
  const res = await callApi<Request, Response>({
    action: Actions.GET_CUSTOMERS,
    params: {
      take: 100,
      cursor,
    },
    options: { noCache },
  });

  if (res?.hasMore) {
    const _customers = (res?.customers || []) as GenericObject[];
    return _customers.concat(await _loadData(noCache, res.cursor));
  }
  return res?.customers || [];
}

export default CustomerManagement;
