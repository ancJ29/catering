import {
  Actions,
  configs as actionConfigs,
  xDailyMenuSchema,
} from "@/auto-generated/api-configs";
import callApi from "@/services/api";
import { ONE_WEEK } from "@/utils";
import { z } from "zod";
import { Customer } from "../customer";

const response =
  actionConfigs[Actions.GET_DAILY_MENU].schema.response;
type Response = z.infer<typeof response>;
const dailySchema = response.transform((array) => array[0]);

export type DailyMenu = z.infer<typeof dailySchema>;

export type DailyMenuStatus = z.infer<
  typeof xDailyMenuSchema.shape.others.shape.status
>;

export type DailyMenuDetailMode = "detail" | "modified";

export async function loadTodayMenu(
  noCache = false,
): Promise<DailyMenu[]> {
  const response =
    actionConfigs[Actions.GET_TODAY_MENU].schema.response;
  type Response = z.infer<typeof response>;
  const data = await callApi<unknown, Response>({
    action: Actions.GET_TODAY_MENU,
    params: {},
    options: { noCache },
  });
  return data || [];
}

export function dailyMenuStatusColor(
  status: DailyMenuStatus | undefined,
  level = 5,
) {
  const colors: Record<DailyMenuStatus, string> = {
    NEW: "",
    WAITING: "red",
    CONFIRMED: "cyan",
    PROCESSING: "yellow",
    READY: "lime",
    DELIVERED: "blue",
  };
  if (!status || status === "NEW") {
    return "";
  }
  return `${colors[status]}.${level}`;
}

export function blankDailyMenu(
  customer: Customer,
  targetName: string,
  shift: string,
  date: Date,
): DailyMenu {
  return {
    id: "",
    clientId: customer.clientId,
    menuId: "",
    date,
    menu: {
      menuProducts: [],
    },
    createdAt: new Date(),
    updatedAt: new Date(),
    customerId: customer.id,
    others: {
      status: "NEW",
      cateringId: customer.others.cateringId,
      targetName,
      shift,
      quantity: {},
    },
  };
}

export async function getDailyMenu({
  id,
  customerId,
  from = Date.now() - ONE_WEEK,
  to = Date.now() + ONE_WEEK,
  noCache = false,
}: {
  id?: string;
  from: number;
  to: number;
  customerId: string;
  noCache?: boolean;
}): Promise<DailyMenu[]> {
  const dailyMenuList = await callApi<unknown, Response>({
    action: Actions.GET_DAILY_MENU,
    params: { id, customerId, from, to },
    options: { noCache },
  });
  return dailyMenuList || [];
}

function _dailyMenuKey(
  customerId: string,
  targetName: string,
  shift: string,
  timestamp: number,
): string;
function _dailyMenuKey(m: DailyMenu): string;
function _dailyMenuKey(
  a?: string | DailyMenu,
  b?: string,
  c?: string,
  d?: number,
) {
  if (typeof a === "string") {
    return a ? `${a}.${b}.${c}.${d}` : "";
  }
  if (!a) {
    return "";
  }
  return _dailyMenuKey(
    a.customerId,
    a.others.targetName,
    a.others.shift,
    a.date.getTime(),
  );
}

export const dailyMenuKey = _dailyMenuKey;

import { ClientRoles as Roles } from "@/auto-generated/api-configs";

type X = Record<DailyMenuStatus, { actor: Roles }>;
export const dailyMenuStatusTransitionMap: X = {
  NEW: {
    actor: Roles.PRODUCTION,
  },
  WAITING: {
    actor: Roles.CATERING,
  },
  CONFIRMED: {
    actor: Roles.CATERING,
  },
  PROCESSING: {
    actor: Roles.CATERING,
  },
  READY: {
    actor: Roles.CATERING,
  },
  DELIVERED: {
    actor: Roles.CATERING,
  },
};
