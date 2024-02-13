import {
  Actions,
  configs as actionConfigs,
} from "@/auto-generated/api-configs";
import cache from "@/services/cache";
import { loadAll } from "@/services/data-loaders";
import logger from "@/services/logger";
import { z } from "zod";

const response = actionConfigs[Actions.GET_PRODUCTS].schema.response;

const productSchema = response.shape.products.transform(
  (array) => array[0],
);

const schema = response.omit({ cursor: true, hasMore: true });

export type Product = z.infer<typeof productSchema>;

export async function getAllProducts(): Promise<Product[]> {
  const key = "domain.product.getAllProducts";
  if (cache.has(key)) {
    const res = schema.safeParse(cache.get(key));
    if (res.success) {
      logger.debug("cache hit", key);
      return res.data.products;
    }
  }
  let products = await loadAll<Product>({
    key: "products",
    action: Actions.GET_PRODUCTS,
  });
  products = products.map((product) => {
    product.name = product.name.replace(/\.[0-9]+$/g, "");
    return product;
  });
  cache.set(key, { products });
  return products;
}
