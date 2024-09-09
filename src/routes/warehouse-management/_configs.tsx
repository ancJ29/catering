import { Department, WarehouseReceipt } from "@/services/domain";
import { DataGridColumnProps } from "@/types";
import { endOfWeek, formatTime, startOfWeek } from "@/utils";

export const configs = (
  t: (key: string) => string,
  caterings: Map<string, Department>,
): DataGridColumnProps[] => {
  return [
    {
      key: "code",
      header: t("Warehouse receipt code"),
      width: "15%",
      defaultVisible: true,
      renderCell: (_, row: WarehouseReceipt) => {
        return row.code || "N/A";
      },
    },
    {
      key: "type",
      header: t("Warehouse receipt type"),
      width: "15%",
      defaultVisible: true,
      renderCell: (_, row: WarehouseReceipt) => {
        if (!row.others.type) {
          return "N/A";
        }
        return t(`warehouseReceipt.type.${row.others.type}`);
      },
    },
    {
      key: "catering",
      header: t("Warehouse receipt created by catering"),
      width: "15%",
      defaultVisible: true,
      renderCell: (_, row: WarehouseReceipt) => {
        return (
          <span>{caterings.get(row.departmentId || "")?.name}</span>
        );
      },
    },
    {
      key: "createAt",
      header: t("Create at"),
      width: "10%",
      textAlign: "center",
      renderCell: (_, row: WarehouseReceipt) => {
        return formatTime(row.createdAt, "DD/MM/YYYY");
      },
    },
    {
      key: "date",
      header: t("Warehouse receipt export - import date"),
      width: "10%",
      textAlign: "center",
      renderCell: (_, row: WarehouseReceipt) => {
        return formatTime(row.date, "DD/MM/YYYY");
      },
    },
    {
      key: "receivingCatering",
      header: `${t("Warehouse receipt receiving catering")} (${t(
        "Warehouse Transfer",
      )})`,
      width: "15%",
      renderCell: (_, row: WarehouseReceipt) => {
        if (!row.others.cateringId) {
          return "";
        }
        return (
          <span>{caterings.get(row.others.cateringId)?.name}</span>
        );
      },
    },
    {
      key: "otherInformation",
      header: t("Other information"),
      width: "15%",
      textAlign: "center",
      renderCell: (_, row: WarehouseReceipt) => {
        return <span>{row.others.memo}</span>;
      },
    },
  ];
};

export type FilterType = {
  from: number;
  to: number;
  types: string[];
  cateringIds: string[];
};

export const defaultCondition: FilterType = {
  from: startOfWeek(Date.now()),
  to: endOfWeek(Date.now()),
  types: [],
  cateringIds: [],
};

export function filter(wr: WarehouseReceipt, condition?: FilterType) {
  if (
    condition?.types &&
    condition.types.length > 0 &&
    !condition.types.includes(wr.others.type)
  ) {
    return false;
  }
  if (
    condition?.cateringIds &&
    condition.cateringIds.length > 0 &&
    !condition.cateringIds.includes(wr.departmentId)
  ) {
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
