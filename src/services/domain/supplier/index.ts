import {
  Actions,
  configs as actionConfigs,
} from "@/auto-generated/api-configs";
import cache from "@/services/cache";
import { loadAll } from "@/services/data-loaders";
import logger from "@/services/logger";
import { z } from "zod";

const response = actionConfigs[Actions.GET_SUPPLIERS].schema.response;

const supplierSchema = response.shape.suppliers.transform(
  (array) => array[0],
);

const schema = response.omit({ cursor: true, hasMore: true });

export type Supplier = z.infer<typeof supplierSchema> & {
  typeName?: string;
};

export async function getAllSuppliers(): Promise<Supplier[]> {
  const key = "domain.supplier.getAllSuppliers";
  if (cache.has(key)) {
    const res = schema.safeParse(cache.get(key));
    if (res.success) {
      logger.debug("cache hit", key);
      return res.data.suppliers;
    }
  }
  let suppliers = await loadAll<Supplier>({
    key: "suppliers",
    action: Actions.GET_SUPPLIERS,
  });
  suppliers = suppliers.map((supplier) => {
    supplier.name = supplier.name.replace(/\.[0-9]+$/g, "");
    return supplier;
  });
  cache.set(key, { suppliers });
  return suppliers;
}
