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

export async function getCateringDashboard(): Promise<
undefined | CateringDashboard
> {
  return await callApi<unknown, CateringDashboard>({
    action: Actions.GET_CATERING_DASHBOARD,
  });
}

const addCateringDashboardResponse =
  actionConfigs[Actions.ADD_CATERING_DASHBOARD].schema.request;

export type AddCateringDashboard = z.infer<
  typeof addCateringDashboardResponse
>;

export async function addCateringDashboard(params: AddCateringDashboard) {
  return await callApi<AddCateringDashboard, { id: string }>({
    action: Actions.ADD_CATERING_DASHBOARD,
    params,
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
