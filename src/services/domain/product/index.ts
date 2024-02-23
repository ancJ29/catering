import {
  Actions,
  configs as actionConfigs,
} from "@/auto-generated/api-configs";
import callApi from "@/services/api";
import cache from "@/services/cache";
import logger from "@/services/logger";
import { z } from "zod";

const response = actionConfigs[Actions.GET_ALL_PRODUCTS].schema.response;

const productSchema = response.transform(
  (array) => array[0],
);

export type Product = z.infer<typeof productSchema>;

export async function getAllProducts(
  noCache = false,
): Promise<Product[]> {
  const key = "domain.product.getAllProducts";
  if (cache.has(key)) {
    const res = response.safeParse(cache.get(key));
    if (res.success) {
      logger.trace("cache hit", key);
      return res.data;
    }
  }
  const products = await callApi<unknown, Product[]>({
    action: Actions.GET_ALL_PRODUCTS,
    params: {},
    options: { noCache },
  });
  return products || [];
}
