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

const departmentSchema = response.shape.departments.transform(
  (array) => array[0],
);

const schema = response.omit({ cursor: true, hasMore: true });

export type Department = z.infer<typeof departmentSchema>;

export async function getAllDepartments() {
  const key = "domain.department.getAllDepartments";
  if (cache.has(key)) {
    const res = schema.safeParse(cache.get(key));
    if (res.success) {
      logger.trace("cache hit", key);
      return res.data.departments;
    }
  }
  const departments = await loadAll<Department>({
    key: "departments",
    action: Actions.GET_DEPARTMENTS,
    noCache: true,
  });
  cache.set(key, { departments });
  return departments;
}

export async function getInventoryDepartments() {
  return getAllDepartments().then((departments) => {
    return departments.filter((d) => Boolean(d.others.hasInventory));
  });
}
