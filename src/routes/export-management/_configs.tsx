import { Department, WarehouseReceipt } from "@/services/domain";
import { DataGridColumnProps } from "@/types";
import { endOfMonth, formatTime, startOfMonth } from "@/utils";
import { z } from "zod";

export const configs = (
  t: (key: string) => string,
  caterings: Map<string, Department>,
): DataGridColumnProps[] => {
  return [
    {
      key: "code",
      header: t("Warehouse receipt code"),
      width: "15%",
      renderCell: (_, row: WarehouseReceipt) => {
        return row.code || "N/A";
      },
    },
    {
      key: "date",
      header: t("Warehouse receipt date"),
      width: "15%",
      renderCell: (_, row: WarehouseReceipt) => {
        return formatTime(row.date, "DD/MM/YYYY");
      },
    },
    {
      key: "deliveryKitchen",
      header: t("Warehouse receipt delivery catering"),
      width: "20%",
      renderCell: (_, row: WarehouseReceipt) => {
        return (
          <span>{caterings.get(row.departmentId || "")?.name}</span>
        );
      },
    },
    {
      key: "receivingKitchen",
      header: t("Warehouse receipt receiving catering"),
      width: "20%",
      renderCell: (_, row: WarehouseReceipt) => {
        return (
          <span>
            {caterings.get(row.others.cateringId || "")?.name ?? "-"}
          </span>
        );
      },
    },
    {
      key: "type",
      header: t("Warehouse receipt type"),
      width: "20%",
      renderCell: (_, row: WarehouseReceipt) => {
        return t(`warehouseReceipt.type.${row.others.type}`);
      },
    },
  ];
};

export type FilterType = {
  from: number;
  to: number;
  type: string;
  case: string;
};

export const defaultCondition: FilterType = {
  from: startOfMonth(Date.now()),
  to: endOfMonth(Date.now()),
  type: "",
  case: "",
};

export function filter(wr: WarehouseReceipt, condition?: FilterType) {
  if (condition?.type && condition.type !== wr.others.type) {
    return false;
  }
  if (condition?.from && wr.date.getTime() < condition.from) {
    return false;
  }
  if (condition?.to && wr.date.getTime() > condition.to) {
    return false;
  }
  return true;
}

export const caseSchema = z.enum([
  "Released from warehouse",
  "Warehouse transfer",
]);
export type Case = z.infer<typeof caseSchema>;
