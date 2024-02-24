import {
  Actions,
  configs as actionConfigs,
} from "@/auto-generated/api-configs";
import { Customer } from "@/services/domain";
import logger from "@/services/logger";
import {
  ONE_DAY,
  ONE_WEEK,
  firstMonday,
  formatTime,
  lastSunday,
  startOfDay,
  startOfWeek,
} from "@/utils";
import { z } from "zod";

const targetSchema = actionConfigs[
  Actions.GET_CUSTOMERS
].schema.response.shape.customers
  .transform((array) => {
    return array[0].others.targets;
  })
  .transform((array) => array[0]);

export type Target = z.infer<typeof targetSchema>;

export const weekdays = [
  "Mon",
  "Tue",
  "Wed",
  "Thu",
  "Fri",
  "Sat",
  "Sun",
];

// prettier-ignore
type FilterType = {
  mode: "W" | "M";
  markDate: number;
  customer?: Customer;
  target?: Target;
  shift?: string;
  cateringId?: string;
};

// prettier-ignore
type ActionType = "SHIFT_MARK_DATE" | "OVERRIDE" | "CLEAR" | "UPDATE_CUSTOMER" | "UPDATE_CATERING_ID";

export const reducer = (
  state: FilterType,
  action: {
    type: ActionType;
    mode?: "W" | "M";
    shift?: 0 | 1 | -1;
    cateringId?: string;
    overrideState?: Partial<FilterType>;
    keys?: ("customer" | "target" | "shift" | "cateringId")[];
    customer?: Customer;
  },
): FilterType => {
  let _state: FilterType;
  switch (action.type) {
    case "OVERRIDE":
      if (action.overrideState) {
        return {
          ...state,
          ...action.overrideState,
        };
      }
      break;
    case "UPDATE_CATERING_ID":
      _state = { ...state };
      delete _state.cateringId;
      if (action.cateringId) {
        _state.cateringId = action.cateringId;
        if (_state.customer) {
          if (
            _state.customer.others.cateringId !== action.cateringId
          ) {
            delete _state.customer;
            delete _state.target;
            delete _state.shift;
          }
        }
        return _state;
      }
      break;
    case "UPDATE_CUSTOMER":
      _state = { ...state };
      delete _state.customer;
      delete _state.target;
      delete _state.shift;
      if (action.customer) {
        _state.customer = action.customer;
        _state.target = action.customer.others.targets[0];
        _state.shift = action.customer.others.targets[0].shifts[0];
      }
      return _state;
    case "SHIFT_MARK_DATE":
      if (action.shift) {
        if (state.mode === "M") {
          const markDate = new Date(state.markDate);
          markDate.setMonth(markDate.getMonth() + action.shift);
          return {
            ...state,
            markDate: markDate.getTime(),
          };
        } else {
          return {
            ...state,
            markDate: state.markDate + (action.shift || 1) * ONE_WEEK,
          };
        }
      }
      break;
    case "CLEAR":
      logger.debug("CLEAR", action.keys);
      if (action.keys?.length) {
        const _state = { ...state };
        for (const key of action.keys) {
          delete _state[key];
        }
        return _state;
      }
      break;
    default:
      return state;
  }
  return state;
};

export const defaultCondition: FilterType = {
  mode: "W",
  markDate: startOfDay(Date.now()),
};

export function parseHash(
  hash: string,
  customerIdByName: Map<string, string>,
  customers: Map<string, Customer>,
) {
  if (!hash) {
    return;
  }
  const [
    mode,
    markDate,
    cateringId,
    customerName,
    targetName,
    shift,
  ] = window.atob(hash.slice(1)).split(".").map(decodeURIComponent);

  if (!customerName || isNaN(parseInt(markDate || "x"))) {
    return;
  }
  if (mode != "M" && mode != "W") {
    return;
  }
  const customerId = customerIdByName.get(customerName);
  const customer = customers.get(customerId || "");
  if (!customer) {
    return;
  }
  const target = customer.others.targets.find(
    (el) => el.name === targetName,
  );
  if (!target) {
    return;
  }
  if (!shift && !target.shifts.includes(shift)) {
    return;
  }
  return {
    cateringId,
    mode: mode as "W" | "M",
    markDate: parseInt(markDate) * ONE_DAY,
    customer,
    target,
    shift,
  };
}

export function hash(condition: FilterType) {
  if (!condition.customer?.name) {
    return "";
  }
  const hash = window.btoa(
    [
      condition.mode,
      Math.floor(condition.markDate / ONE_DAY),
      condition.cateringId || "",
      condition.customer?.name || "",
      condition.target?.name || "",
      condition.shift,
    ]
      .filter(Boolean)
      .map((el) => encodeURIComponent(el?.toString() || ""))
      .join("."),
  );
  return "#" + hash;
}

export function isWeekView(mode: string) {
  return mode === "W";
}

export function customerId(condition: { customer?: { id: string } }) {
  return condition?.customer?.id || "";
}

export function headersAndRows(
  mode: "W" | "M",
  markDate: number,
  t: (_: string) => string,
) {
  let rows: {
    date: string;
    timestamp: number;
  }[][] = [[]];

  let headers: {
    label: string;
    timestamp?: number;
  }[] = weekdays.map((el) => ({ label: t(el) }));
  const isWeekView = mode === "W";
  const from = isWeekView
    ? startOfWeek(markDate)
    : firstMonday(markDate);
  const to = isWeekView ? from + 6 * ONE_DAY : lastSunday(markDate);

  if (isWeekView) {
    headers = weekdays.map((el, idx) => {
      const timestamp = from + idx * ONE_DAY;
      return {
        label: `${formatTime(timestamp, "DD/MM")} (${t(el)})`,
        timestamp,
      };
    });
  } else {
    const weeks = Math.round((to - from) / ONE_WEEK);
    rows = Array.from(
      {
        length: weeks,
      },
      (_, w) => {
        return ["T2", "T3", "T4", "T5", "T6", "T7", "CN"].map(
          (_, idx) => {
            const timestamp = from + w * ONE_WEEK + idx * ONE_DAY;
            return {
              timestamp,
              date: formatTime(timestamp, "DD/MM"),
            };
          },
        );
      },
    );
  }
  return { rows, headers };
}
