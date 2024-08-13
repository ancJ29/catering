import Status from "@/routes/internal-warehouse-entry/components/Status";
import {
  Department,
  Material,
  PurchaseInternalCatering,
  PurchaseInternalDetail,
} from "@/services/domain";
import { DataGridColumnProps } from "@/types";
import {
  convertAmountBackward,
  endOfWeek,
  formatTime,
  startOfWeek,
} from "@/utils";
import store from "../../_export.store";

export const piConfigs = (
  t: (key: string) => string,
  caterings: Map<string, Department>,
): DataGridColumnProps[] => {
  return [
    {
      key: "ioCode",
      header: t("Purchase internal io code"),
      width: "20%",
      style: { fontWeight: "bold" },
      renderCell: (_, row: PurchaseInternalCatering) => {
        return row.code || "N/A";
      },
    },
    {
      key: "prCode",
      header: t("Purchase internal pr code"),
      width: "20%",
      style: { fontWeight: "bold" },
      renderCell: (_, row: PurchaseInternalCatering) => {
        return row.others.prCode || "N/A";
      },
    },
    {
      key: "receivingKitchen",
      header: t("Purchase internal receiving catering"),
      width: "20%",
      renderCell: (_, row: PurchaseInternalCatering) => {
        return (
          <span>
            {
              caterings.get(row.others.receivingCateringId || "")
                ?.name
            }
          </span>
        );
      },
    },
    {
      key: "deliveryDate",
      header: t("Purchase internal date"),
      width: "15%",
      renderCell: (_, row: PurchaseInternalCatering) => {
        return formatTime(row.deliveryDate);
      },
    },
    {
      key: "status",
      header: t("Status"),
      width: "20%",
      textAlign: "center",
      renderCell: (_, row: PurchaseInternalCatering) => {
        if (!row.others.status) {
          return "N/A";
        }
        return <Status status={row.others.status} />;
      },
    },
  ];
};

export const piDetailConfigs = (
  t: (key: string) => string,
  materials: Map<string, Material>,
): DataGridColumnProps[] => {
  return [
    {
      key: "name",
      header: t("Material name"),
      width: "30%",
      renderCell: (_, row: PurchaseInternalDetail) => {
        return materials.get(row.materialId)?.name || "N/A";
      },
    },
    {
      key: "quantity",
      header: t("Quantity"),
      width: "25%",
      textAlign: "right",
      renderCell: (_, row: PurchaseInternalDetail) => {
        return convertAmountBackward({
          material: materials.get(row.materialId),
          amount: row.amount,
        }).toLocaleString();
      },
    },
    {
      key: "inventory",
      header: t("Inventory"),
      width: "25%",
      textAlign: "right",
      renderCell: (_, row: PurchaseInternalDetail) => {
        return store.getInventory(row.materialId).toLocaleString();
      },
    },
    {
      key: "unit",
      header: t("Material unit"),
      width: "20%",
      textAlign: "center",
      renderCell: (_, row: PurchaseInternalDetail) => {
        return (
          materials.get(row.materialId)?.others?.unit?.name || "N/A"
        );
      },
    },
  ];
};

export type FilterType = {
  id: string;
  from: number;
  to: number;
  statuses: string[];
  receivingCateringIds: string[];
};

export const defaultCondition: FilterType = {
  id: "",
  from: startOfWeek(Date.now()),
  to: endOfWeek(Date.now()),
  statuses: [],
  receivingCateringIds: [],
};

export function filter(
  pi: PurchaseInternalCatering,
  condition?: FilterType,
) {
  if (
    condition?.statuses &&
    condition.statuses.length > 0 &&
    !condition.statuses.includes(pi.others.status)
  ) {
    return false;
  }
  if (
    condition?.receivingCateringIds &&
    condition.receivingCateringIds.length > 0 &&
    pi.others.receivingCateringId &&
    !condition.receivingCateringIds.includes(
      pi.others.receivingCateringId,
    )
  ) {
    return false;
  }
  if (condition?.from && pi.deliveryDate.getTime() < condition.from) {
    return false;
  }
  if (condition?.to && pi.deliveryDate.getTime() > condition.to) {
    return false;
  }
  return true;
}
