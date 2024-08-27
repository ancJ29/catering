import {
  Actions,
  configs as actionConfigs,
} from "@/auto-generated/api-configs";
import callApi from "@/services/api";
import { z } from "zod";

const response =
  actionConfigs[Actions.GET_CATERING_DASHBOARD].schema.response;

export type CateringDashboard = z.infer<typeof response>;

export async function getCateringDashboard(
  customerIds: string[],
  cateringId?: string,
): Promise<undefined | CateringDashboard> {
  return await callApi<unknown, CateringDashboard>({
    action: Actions.GET_CATERING_DASHBOARD,
    params: { cateringId, customerIds },
  });
}
