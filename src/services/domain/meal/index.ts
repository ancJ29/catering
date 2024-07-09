import {
  Actions,
  configs as actionConfigs,
} from "@/auto-generated/api-configs";
import callApi from "@/services/api";
import { loadAll } from "@/services/data-loaders";
import { z } from "zod";

const response = actionConfigs[Actions.GET_MEALS].schema.response;

const serviceSchema = response.shape.meals.transform(
  (array) => array[0],
);

export type Meal = z.infer<typeof serviceSchema>;

export async function getAllMeals(): Promise<Meal[]> {
  return await loadAll<Meal>({
    key: "meals",
    action: Actions.GET_MEALS,
  });
}

export async function getMealByCustomerId(
  customerId: string,
): Promise<Meal[]> {
  return await loadAll<Meal>({
    key: "meals",
    action: Actions.GET_MEALS,
    params: { customerId },
  });
}

const { request: updateMealRequest } =
  actionConfigs[Actions.UPDATE_MEAL].schema;
type UpdateMealRequest = z.infer<typeof updateMealRequest>;

export async function updateMeal(params: UpdateMealRequest) {
  await callApi<UpdateMealRequest, { id: string }>({
    action: Actions.UPDATE_MEAL,
    params,
    options: {
      toastMessage: "Your changes have been saved",
    },
  });
}
