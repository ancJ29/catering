import {
  Actions,
  configs as actionConfigs,
} from "@/auto-generated/api-configs";
import callApi from "@/services/api";
import { ONE_WEEK } from "@/utils";
import { z } from "zod";

const response =
  actionConfigs[Actions.GET_DAILY_MENU].schema.response;
type Response = z.infer<typeof response>;
const dailySchema = response.transform((array) => array[0]);

export type DailyMenu = z.infer<typeof dailySchema>;

export async function getDailyMenu({
  customerId,
  from = Date.now() - ONE_WEEK,
  to = Date.now() + ONE_WEEK,
  noCache = false,
}: {
  from: number;
  to: number;
  customerId: string;
  noCache?: boolean;
}): Promise<DailyMenu[]> {
  const dailyMenuList = await callApi<unknown, Response>({
    action: Actions.GET_DAILY_MENU,
    params: { customerId, from, to },
    options: { noCache },
  });
  return dailyMenuList || [];
}
