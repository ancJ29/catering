import {
  Actions,
  configs as actionConfigs,
} from "@/auto-generated/api-configs";
import callApi from "@/services/api";
import cache from "@/services/cache";
import { loadAll } from "@/services/data-loaders";
import logger from "@/services/logger";
import { z } from "zod";

const { request } = actionConfigs[Actions.UPDATE_INVENTORY].schema;
const { response } = actionConfigs[Actions.GET_INVENTORY].schema;
const inventorySchema = response.transform((el) => el.inventories[0]);

// prettier-ignore
export type Inventory = Omit<z.infer<typeof inventorySchema>, "createdAt" | "clientId">;

type Response = z.infer<typeof response>;
type Request = z.infer<typeof request>;

export async function getInventories(departmentId: string) {
  const res = await callApi<unknown, Response>({
    action: Actions.GET_INVENTORY,
    params: { departmentId },
    options: { noCache: true },
  });
  return res?.inventories || [];
}

const schema = response.omit({ cursor: true, hasMore: true });

export async function getAllInventories(
  departmentId: string,
): Promise<Inventory[]> {
  const key = "domain.inventory.getAllInventories";
  if (cache.has(key)) {
    const res = schema.safeParse(cache.get(key));
    if (res.success) {
      logger.trace("cache hit", key);
      return res.data.inventories;
    }
  }
  const inventories = await loadAll<Inventory>({
    key: "inventories",
    action: Actions.GET_INVENTORY,
    params: { departmentId },
  });
  cache.set(key, { inventories });
  return inventories;
}

export async function getAllLowInventories(
  departmentId: string,
): Promise<Inventory[]> {
  const key = `domain.inventory.getAllLowInventories.${departmentId}`;
  if (cache.has(key)) {
    const res = schema.safeParse(cache.get(key));
    if (res.success) {
      logger.trace("cache hit", key);
      return res.data.inventories;
    }
  }
  const inventories = await loadAll<Inventory>({
    key: "inventories",
    action: Actions.GET_LOW_INVENTORIES,
    params: { departmentId },
  });
  cache.set(key, { inventories });
  return inventories;
}

export async function getAllPeriodicInventories(
  departmentId: string,
): Promise<Inventory[]> {
  const key = `domain.inventory.getAllPeriodicInventories.${departmentId}`;
  if (cache.has(key)) {
    const res = schema.safeParse(cache.get(key));
    if (res.success) {
      logger.trace("cache hit", key);
      return res.data.inventories;
    }
  }
  const inventories = await loadAll<Inventory>({
    key: "inventories",
    action: Actions.GET_PERIODIC_INVENTORIES,
    params: { departmentId },
  });
  cache.set(key, { inventories });
  return inventories;
}

export async function getAllDailyMenuInventories(
  departmentId: string,
): Promise<Inventory[]> {
  const key = `domain.inventory.getAllDailyMenuInventories.${departmentId}`;
  if (cache.has(key)) {
    const res = schema.safeParse(cache.get(key));
    if (res.success) {
      logger.trace("cache hit", key);
      return res.data.inventories;
    }
  }
  const inventories = await loadAll<Inventory>({
    key: "inventories",
    action: Actions.GET_INVENTORIES_FOR_DAILY_MENU,
    params: { departmentId },
  });
  cache.set(key, { inventories });
  return inventories;
}

export async function updateInventory(materials: Inventory[]) {
  await callApi<Request, unknown>({
    action: Actions.UPDATE_INVENTORY,
    params: materials,
  });
}
