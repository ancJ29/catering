import {
  Actions,
  configs as actionConfigs,
} from "@/auto-generated/api-configs";
import Autocomplete from "@/components/common/Autocomplete";
import DataGrid from "@/components/common/DataGrid";
import useTranslation from "@/hooks/useTranslation";
import callApi from "@/services/api";
import useMetaDataStore from "@/stores/meta-data.store";
import { GenericObject } from "@/types";
import { unique } from "@/utils";
import { Flex, Stack } from "@mantine/core";
import { useCallback, useEffect, useMemo, useState } from "react";
import { z } from "zod";
import configs from "./_configs";

const { request, response } =
  actionConfigs[Actions.GET_PRODUCTS].schema;
export type Request = z.infer<typeof request>;
export type Response = z.infer<typeof response>;

const ProductManagement = () => {
  const t = useTranslation();
  const { enumMap } = useMetaDataStore();
  const dataGridConfigs = useMemo(() => configs(t), [t]);
  const [products, setProducts] = useState<GenericObject[]>([]);
  const [data, setData] = useState<GenericObject[]>([]);
  const [page, setPage] = useState(1);
  const [names, setNames] = useState([""]);

  const _reload = useCallback(
    async (noCache?: boolean) => {
      if (products.length > 0) {
        return;
      }
      if (enumMap.size === 0) {
        return;
      }
      if (noCache) {
        await new Promise((resolve) => setTimeout(resolve, 300));
      }
      _loadData(noCache).then((products: GenericObject[] = []) => {
        const _products = products.map((el) => {
          const type = enumMap.get(el.type as string);
          el.typeName = type ? t(type) : `${type}.s`;
          if (typeof el.name === "string") {
            const strings = el.name.split(".");
            el.name =
              strings.length > 1
                ? strings.slice(0, -1).join(".")
                : strings[0];
          }
          return el;
        });
        setProducts(_products);
        setData(_products);
        setNames(unique(_products.map((el) => el.name as string)));
      });
    },
    [enumMap, products.length, t],
  );

  const filter = useCallback(
    (keyword: string) => {
      setPage(1);
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

  useEffect(() => {
    _reload();
  }, [_reload]);

  return (
    <Stack gap={10} w="100%" h="100%" p={10}>
      <Flex justify="end" align={"center"}>
        <Autocomplete
          label="sample"
          w={"20vw"}
          onEnter={filter}
          data={names}
        />
      </Flex>
      <DataGrid
        page={page}
        limit={10}
        isPaginated
        hasOrderColumn
        columns={dataGridConfigs}
        data={data}
        onChangePage={setPage}
      />
    </Stack>
  );
};

async function _loadData(
  noCache?: boolean,
  cursor?: string,
): Promise<GenericObject[]> {
  const res = await callApi<Request, Response>({
    action: Actions.GET_PRODUCTS,
    params: {
      take: 100,
      cursor,
    },
    options: { noCache },
  });

  if (res?.hasMore) {
    const _products = (res?.products || []) as GenericObject[];
    return _products.concat(await _loadData(noCache, res.cursor));
  }
  return res?.products || [];
}

export default ProductManagement;
