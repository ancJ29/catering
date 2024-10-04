import {
  Actions,
  configs as actionConfigs,
} from "@/auto-generated/api-configs";
import callApi from "@/services/api";
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

export async function getSupplierById(
  id: string,
): Promise<Supplier | undefined> {
  let suppliers = await loadAll<Supplier>({
    key: "suppliers",
    action: Actions.GET_SUPPLIERS,
    params: { id },
    noCache: true,
  });
  suppliers = suppliers.map((supplier) => {
    supplier.name = supplier.name.replace(/\.[0-9]+$/g, "");
    return supplier;
  });
  return suppliers.length ? suppliers[0] : undefined;
}

export async function getAllSuppliers(
  noCache = false,
): Promise<Supplier[]> {
  const key = "domain.supplier.getAllSuppliers";
  if (!noCache && cache.has(key)) {
    const res = schema.safeParse(cache.get(key));
    if (res.success) {
      logger.trace("cache hit", key);
      return res.data.suppliers;
    }
  }
  let suppliers = await loadAll<Supplier>({
    key: "suppliers",
    action: Actions.GET_SUPPLIERS,
    take: 300,
    noCache,
  });
  suppliers = suppliers.map((supplier) => {
    supplier.name = supplier.name.replace(/\.[0-9]+$/g, "");
    return supplier;
  });
  cache.set(key, { suppliers });
  return suppliers;
}

const { request: updateRequest } =
  actionConfigs[Actions.UPDATE_SUPPLIER].schema;
type UpdateRequest = z.infer<typeof updateRequest>;

export async function updateSupplier(params: UpdateRequest) {
  await callApi<UpdateRequest, { id: string }>({
    action: Actions.UPDATE_SUPPLIER,
    params,
  });
}
