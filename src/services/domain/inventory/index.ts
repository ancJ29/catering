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

type Request = z.infer<typeof request>;

const schema = response.omit({ cursor: true, hasMore: true });

export async function getAllInventories(
  departmentId: string,
): Promise<Inventory[]> {
  const key = `domain.inventory.getAllInventories.${departmentId}`;
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

export async function updateInventory(inventories: Inventory[]) {
  await callApi<Request, unknown>({
    action: Actions.UPDATE_INVENTORY,
    params: inventories,
    options: {
      toastMessage: "Your changes have been saved",
      reloadOnSuccess: {
        delay: 700,
      },
    },
  });
}

export async function getMaterialInventories(materialIds: string[]) {
  return await loadAll<Inventory>({
    key: "inventories",
    action: Actions.GET_MATERIAL_INVENTORIES,
    params: { materialIds },
  });
}

const { request: changeInventoryRequest } =
  actionConfigs[Actions.ADD_TO_INVENTORY].schema;
type ChangeInventoryRequest = z.infer<typeof changeInventoryRequest>;

export async function addToInventory(params: ChangeInventoryRequest) {
  await callApi<ChangeInventoryRequest, { id: string }>({
    action: Actions.ADD_TO_INVENTORY,
    params,
  });
}

export async function removeFromInventory(
  params: ChangeInventoryRequest,
) {
  await callApi<ChangeInventoryRequest, { id: string }>({
    action: Actions.REMOVE_FROM_INVENTORY,
    params,
  });
}
