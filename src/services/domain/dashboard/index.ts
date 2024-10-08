import {
  Actions,
  configs as actionConfigs,
} from "@/auto-generated/api-configs";
import callApi from "@/services/api";
import { z } from "zod";

const cateringDashboardResponse =
  actionConfigs[Actions.GET_CATERING_DASHBOARD].schema.response;

export type CateringDashboard = z.infer<
  typeof cateringDashboardResponse
>;

export async function getCateringDashboard(
  customerIds: string[],
): Promise<undefined | CateringDashboard> {
  return await callApi<unknown, CateringDashboard>({
    action: Actions.GET_CATERING_DASHBOARD,
    params: { customerIds },
  });
}

const ownerDashboardResponse =
  actionConfigs[Actions.GET_OWNER_DASHBOARD].schema.response;

export type OwnerDashboard = z.infer<typeof ownerDashboardResponse>;

export async function getOwnerDashboard(): Promise<
undefined | OwnerDashboard
> {
  return await callApi<unknown, OwnerDashboard>({
    action: Actions.GET_OWNER_DASHBOARD,
  });
}

const addOwnerDashboardResponse =
  actionConfigs[Actions.ADD_OWNER_DASHBOARD].schema.request;

export type AddOwnerDashboard = z.infer<
  typeof addOwnerDashboardResponse
>;

export async function addOwnerDashboard(params: AddOwnerDashboard) {
  return await callApi<AddOwnerDashboard, { id: string }>({
    action: Actions.ADD_OWNER_DASHBOARD,
    params,
  });
}
