import {
  Actions,
  ClientRoles,
  configs as actionConfigs,
  dailyMenuStatusSchema,
} from "@/auto-generated/api-configs";
import callApi from "@/services/api";
import { ONE_WEEK, isBeforeYesterday } from "@/utils";
import { z } from "zod";
import { Customer } from "../customer";

const response =
  actionConfigs[Actions.GET_DAILY_MENU].schema.response;
type Response = z.infer<typeof response>;
const dailySchema = response.transform((array) => array[0]);

export type DailyMenu = z.infer<typeof dailySchema>;

// TODO: use enums
export type DailyMenuStatus = z.infer<typeof dailyMenuStatusSchema>;

export type DailyMenuDetailMode = "detail" | "modified";

export function getAlertMenuItems(
  role?: ClientRoles,
  cateringId?: string,
) {
  if (
    role !== ClientRoles.PRODUCTION &&
    role !== ClientRoles.CATERING
  ) {
    return [];
  }
  return _loadTodayMenu().then((data) => {
    if (role == ClientRoles.CATERING) {
      if (cateringId) {
        return data
          .filter((el) => el.others.cateringId === cateringId)
          .filter((el) => el.others.status === "WAITING");
      }
    }
    if (role == ClientRoles.PRODUCTION) {
      return data?.filter((el) => el.others.status === "NEW");
    }
  });
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

export const _getDailyMenu = async function getDailyMenu({
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
};

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

export function readableDailyMenu(
  role?: ClientRoles,
  timestamp?: number,
  dailyMenu?: {
    id: string;
    others: { cateringId: string };
  },
  selfCateringId?: string,
) {
  if (!timestamp || !role) {
    return false;
  }
  switch (role) {
    case ClientRoles.OWNER:
      return true;
    case ClientRoles.CATERING:
      if (!dailyMenu?.id) {
        return false;
      }
      if (dailyMenu.others.cateringId !== selfCateringId) {
        return false;
      }
      return true;
    case ClientRoles.PRODUCTION:
      if (!dailyMenu?.id) {
        if (isBeforeYesterday(timestamp)) {
          return false;
        }
        return true;
      }
      return true;
    default:
      return false;
  }
}

export function editableDailyMenu(
  role?: ClientRoles,
  timestamp?: number,
  dailyMenu?: {
    id: string;
    others: { cateringId: string; status: DailyMenuStatus };
  },
  selfCateringId?: string,
) {
  if (!timestamp || !role) {
    return false;
  }
  const status = dailyMenu?.others.status || "NEW";
  const actor = dailyMenuStatusTransitionMap[status].actor;
  switch (role) {
    case ClientRoles.OWNER:
      return true;
    case ClientRoles.CATERING:
      if (actor !== ClientRoles.CATERING) {
        return false;
      }
      if (!dailyMenu?.id) {
        return false;
      }
      if (dailyMenu.others.cateringId !== selfCateringId) {
        return false;
      }
      if (isBeforeYesterday(timestamp)) {
        return false;
      }
      return true;
    case ClientRoles.PRODUCTION:
      if (actor !== ClientRoles.PRODUCTION) {
        return false;
      }
      if (isBeforeYesterday(timestamp)) {
        return false;
      }
      return true;
    default:
      return false;
  }
}

export function changeableDailyMenuStatus(
  current: DailyMenuStatus,
  next: DailyMenuStatus,
  role?: ClientRoles,
) {
  if (!role) {
    return false;
  }
  if (role === ClientRoles.OWNER) {
    return true;
  }
  if (role === ClientRoles.PRODUCTION) {
    if (current === "NEW" && next === "WAITING") {
      return true;
    }
    return true;
  }
  if (role === ClientRoles.CATERING) {
    if (next === "NEW" || current === "NEW") {
      return false;
    }
    if (current === "DELIVERED") {
      return false;
    }
    return true;
  }
  return false;
}

async function _loadTodayMenu(): Promise<DailyMenu[]> {
  const response =
    actionConfigs[Actions.GET_TODAY_MENU].schema.response;
  type Response = z.infer<typeof response>;
  const data = await callApi<unknown, Response>({
    action: Actions.GET_TODAY_MENU,
    params: {},
    options: { noCache: true },
  });
  return data || [];
}
