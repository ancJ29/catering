import {
  Actions,
  configs as actionConfigs,
} from "@/auto-generated/api-configs";
import { loadAll } from "@/services/data-loaders";
import materialStore from "@/stores/material.store";
import { z } from "zod";

const { response } =
  actionConfigs[Actions.GET_MONTHLY_INVENTORIES].schema;
const inventorySchema = response.transform(
  (el) => el.monthlyInventories[0],
);

export type MonthlyInventory = z.infer<typeof inventorySchema> & {
  name: string;
};

export async function getAllMonthlyInventories(
  date: Date,
): Promise<MonthlyInventory[]> {
  const { materials } = materialStore.getState();
  const monthlyInventories = await loadAll<MonthlyInventory>({
    key: "monthlyInventories",
    action: Actions.GET_MONTHLY_INVENTORIES,
    params: { date },
  });
  return monthlyInventories.map((el) => ({
    ...el,
    name: materials.get(el.materialId)?.name || "",
  }));
}
