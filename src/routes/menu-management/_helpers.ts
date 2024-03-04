import { Customer, getDailyMenu } from "@/services/domain";
import useCateringStore from "@/stores/catering.store";
import useCustomerStore from "@/stores/customer.store";
import useDailyMenuStore from "@/stores/daily-menu.store";
import useProductStore from "@/stores/product.store";
import {
  ONE_DAY,
  ONE_WEEK,
  addHashToUrl,
  encodeUri,
  firstMonday,
  formatTime,
  lastSunday,
  removeHashFromUrl,
  startOfWeek,
} from "@/utils";
import { type FilterType } from "./_configs";

const weekdays = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

export function _reload() {
  useDailyMenuStore.getState().loadAlertItems();
  useProductStore.getState().reload();
  useCustomerStore.getState().reload();
  useCateringStore.getState().reload();
}

export function _getDailyMenu(customerId: string, markDate: number) {
  customerId &&
    getDailyMenu({
      customerId,
      from: markDate - 4 * ONE_WEEK,
      to: markDate + 4 * ONE_WEEK,
    }).then((data) => useDailyMenuStore.getState().push(data));
}

export function _url(
  customerName?: string,
  targetName?: string,
  shift?: string,
  timestamp?: number,
) {
  return [
    "/menu-management",
    encodeUri(customerName || ""),
    encodeUri(targetName || ""),
    encodeUri(shift || ""),
    timestamp,
  ].join("/");
}

export function _updateHash(hash: string) {
  hash ? addHashToUrl(hash) : removeHashFromUrl();
}

export function _parseHash(
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

export function _hash(condition: FilterType) {
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

export function _isWeekView(mode: string) {
  return mode === "W";
}

export function _customerId(condition: {
  customer?: { id: string };
}) {
  return condition?.customer?.id || "";
}

export function _headersAndRows(
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
