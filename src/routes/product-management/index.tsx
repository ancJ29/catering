import {
  Actions,
  configs as actionConfigs,
} from "@/auto-generated/api-configs";
import DataGrid from "@/components/common/DataGrid";
import useOnMounted from "@/hooks/useOnMounted";
import useTranslation from "@/hooks/useTranslation";
import callApi from "@/services/api";
import { GenericObject } from "@/types";
import { Stack } from "@mantine/core";
import { useCallback, useMemo, useState } from "react";
import { z } from "zod";
import configs from "./_configs";

const { request, response } =
  actionConfigs[Actions.GET_PRODUCTS].schema;
export type Request = z.infer<typeof request>;
export type Response = z.infer<typeof response>;

const ProductManagement = () => {
  const t = useTranslation();
  const dataGridConfigs = useMemo(() => configs(t), [t]);
  const [products, setProducts] = useState<GenericObject[]>([]);

  const _reload = useCallback(async (noCache?: boolean) => {
    if (noCache) {
      await new Promise((resolve) => setTimeout(resolve, 300));
    }
    _loadData(noCache).then((products) =>
      setProducts(products || []),
    );
  }, []);

  useOnMounted(_reload);

  return (
    <Stack gap={10} w="100%" h="100%" p={10}>
      <DataGrid
        hasOrderColumn
        columns={dataGridConfigs}
        data={products}
      />
    </Stack>
  );
};

export async function _loadData(
  noCache?: boolean,
  cursor?: string,
): Promise<GenericObject[]> {
  const res = await callApi<Request, Response>({
    action: Actions.GET_PRODUCTS,
    params: { cursor, take: 100 },
    options: { noCache },
  });
  return res?.products || [];
}

export default ProductManagement;
