import {
  Actions,
  configs as actionConfigs,
} from "@/auto-generated/api-configs";
import callApi from "@/services/api";
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

export async function updateInventory(materials: Inventory[]) {
  await callApi<Request, unknown>({
    action: Actions.UPDATE_INVENTORY,
    params: materials,
  });
}
