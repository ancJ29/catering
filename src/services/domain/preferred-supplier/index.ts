import {
  Actions,
  configs as actionConfigs,
} from "@/auto-generated/api-configs";
import cache from "@/services/cache";
import { loadAll } from "@/services/data-loaders";
import logger from "@/services/logger";
import { z } from "zod";

const { response } =
  actionConfigs[Actions.GET_PREFERRED_SUPPLIERS].schema;
const preferredSupplierSchema = response.transform(
  (el) => el.preferredSuppliers[0],
);

export type PreferredSupplier = z.infer<
  typeof preferredSupplierSchema
>;

const schema = response.omit({ cursor: true, hasMore: true });

export async function getAllPreferredSuppliers(
  departmentId: string,
): Promise<PreferredSupplier[]> {
  const key = `domain.preferredSupplier.getAllPreferredSuppliers.${departmentId}`;
  if (cache.has(key)) {
    const res = schema.safeParse(cache.get(key));
    if (res.success) {
      logger.trace("cache hit", key);
      return res.data.preferredSuppliers;
    }
  }
  const preferredSuppliers = await loadAll<PreferredSupplier>({
    key: "preferredSuppliers",
    action: Actions.GET_PREFERRED_SUPPLIERS,
    params: { departmentId },
  });
  cache.set(key, { preferredSuppliers });
  return preferredSuppliers;
}
