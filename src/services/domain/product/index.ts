import {
  Actions,
  configs as actionConfigs,
} from "@/auto-generated/api-configs";
import callApi from "@/services/api";
import cache from "@/services/cache";
import logger from "@/services/logger";
import { z } from "zod";

const response =
  actionConfigs[Actions.GET_ALL_PRODUCTS].schema.response;

const productSchema = response.transform((array) => array[0]);

export type Product = z.infer<typeof productSchema>;

export async function getAllProducts(
  noCache = false,
): Promise<Product[]> {
  if (
    localStorage.__All_PRODUCTS__ &&
    typeof localStorage.__All_PRODUCTS__ === "string"
  ) {
    const res = response.safeParse(
      JSON.parse(localStorage.__All_PRODUCTS__ || "[]"),
    );
    if (res.success && res.data.length) {
      return res.data;
    }
  }
  const key = "domain.product.getAllProducts";
  if (cache.has(key)) {
    const res = response.safeParse(cache.get(key));
    if (res.success) {
      logger.trace("cache hit", key);
      return res.data;
    }
  }
  let products = await callApi<unknown, Product[]>({
    action: Actions.GET_ALL_PRODUCTS,
    params: {},
    options: { noCache },
  });
  products = products?.map((product) => {
    product.name = product.name.split("___")[0];
    return product;
  });
  localStorage.__All_PRODUCTS__ = JSON.stringify(products || []);
  return products || [];
}

export function productTypeOptions(
  types: string[],
  t: (_: string) => string,
) {
  return types.map((type) => ({
    label: t(`products.type.${type}`),
    value: type,
  }));
}
