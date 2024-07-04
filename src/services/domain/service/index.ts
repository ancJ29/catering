import {
  Actions,
  configs as actionConfigs,
} from "@/auto-generated/api-configs";
import callApi from "@/services/api";
import { loadAll } from "@/services/data-loaders";
import { z } from "zod";

const response = actionConfigs[Actions.GET_SERVICES].schema.response;

const serviceSchema = response.shape.services.transform(
  (array) => array[0],
);

export type Service = z.infer<typeof serviceSchema>;

export async function getServiceByCustomerId(
  customerId: string,
): Promise<Service[]> {
  return await loadAll<Service>({
    key: "services",
    action: Actions.GET_SERVICES,
    params: { customerId },
  });
}

const { request: updateRequest } =
  actionConfigs[Actions.UPDATE_SERVICE].schema;
type UpdateRequest = z.infer<typeof updateRequest>;

export async function updateService(params: UpdateRequest) {
  await callApi<UpdateRequest, { id: string }>({
    action: Actions.UPDATE_SERVICE,
    params,
    options: {
      toastMessage: "Your changes have been saved",
    },
  });
}
