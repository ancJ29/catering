import {
  Actions,
  configs as actionConfigs,
} from "@/auto-generated/api-configs";
import cache from "@/services/cache";
import { loadAll } from "@/services/data-loaders";
import logger from "@/services/logger";
import { z } from "zod";

const response =
  actionConfigs[Actions.GET_DEPARTMENTS].schema.response;

const customerSchema = response.shape.departments.transform(
  (array) => array[0],
);

const schema = response.omit({ cursor: true, hasMore: true });

export type Department = z.infer<typeof customerSchema>;

export async function getAllDepartments(
  type?: string,
): Promise<Department[]> {
  const key = "domain.department.getAllDepartments";
  if (cache.has(key)) {
    const res = schema.safeParse(cache.get(key));
    if (res.success) {
      logger.debug("cache hit", key);
      return res.data.departments;
    }
  }
  const departments = loadAll<Department>({
    key: "departments",
    action: Actions.GET_DEPARTMENTS,
    params: { type },
    noCache: true,
  });
  cache.set(key, { departments });
  return departments;
}
