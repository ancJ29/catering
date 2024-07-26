import { WRType } from "@/auto-generated/api-configs";
import {
  Department,
  Material,
  MonthlyInventory,
  WarehouseReceiptDetail,
} from "@/services/domain";
import { DataGridColumnProps } from "@/types";
import { convertAmountBackward, roundToDecimals } from "@/utils";
import { Button, Center } from "@mantine/core";
import store from "./_monthly_inventory.store";

export const configs = (
  t: (key: string) => string,
  materials: Map<string, Material>,
  caterings: Map<string, Department>,
  open: (
    monthlyInventoryId: string,
    cateringId: string,
    materialId: string,
  ) => void,
): DataGridColumnProps[] => {
  return [
    {
      key: "cateringName",
      header: t("Catering name"),
      width: "10%",
      renderCell: (_, row: MonthlyInventory) => {
        return caterings.get(row.departmentId)?.name || "N/A";
      },
    },
    {
      key: "materialType",
      width: "10%",
      header: t("Material type"),
      renderCell: (_, row: MonthlyInventory) => {
        const material = materials.get(row.materialId);
        if (!material?.others.type) {
          return "N/A";
        }
        const code = material.others.type;
        const group = t(`materials.type.${code}`);
        return <span>{group}</span>;
      },
    },
    {
      key: "materialGroup",
      width: "10%",
      header: t("Material group"),
      renderCell: (_, row: MonthlyInventory) => {
        const material = materials.get(row.materialId);
        if (!material?.others.group) {
          return "N/A";
        }
        const code = material.others.group;
        const group = t(`materials.group.${code}`);
        return <span>{group}</span>;
      },
    },
    {
      key: "materialName",
      width: "15%",
      header: t("Material name"),
      renderCell: (_, row: MonthlyInventory) => {
        return materials.get(row.materialId)?.name || "N/A";
      },
    },
    {
      key: "materialUnit",
      width: "5%",
      header: t("Material unit"),
      renderCell: (_, row: MonthlyInventory) => {
        return (
          materials.get(row.materialId)?.others.unit?.name || "N/A"
        );
      },
    },
    {
      key: "beginningInventory",
      width: "8%",
      textAlign: "right",
      header: t("Beginning inventory"),
      renderCell: (_, row: MonthlyInventory) => {
        return convertAmountBackward({
          material: materials.get(row.materialId),
          amount: row.amount,
        });
      },
    },
    {
      key: "purchasesDuringPeriod",
      width: "8%",
      textAlign: "right",
      header: t("Purchases during period"),
      renderCell: (_, row: MonthlyInventory) => {
        return store.getImportAmount(
          row.departmentId,
          row.materialId,
        );
      },
    },
    {
      key: "salesDuringPeriod",
      width: "8%",
      textAlign: "right",
      header: t("Sales during period"),
      renderCell: (_, row: MonthlyInventory) => {
        return store.getExportAmount(
          row.departmentId,
          row.materialId,
        );
      },
    },
    {
      key: "endingInventory",
      width: "8%",
      textAlign: "right",
      header: t("Ending inventory"),
      renderCell: (_, row: MonthlyInventory) => {
        return roundToDecimals(
          convertAmountBackward({
            material: materials.get(row.materialId),
            amount: row.amount,
          }) +
            store.getImportAmount(row.departmentId, row.materialId) -
            store.getExportAmount(row.departmentId, row.materialId),
          3,
        );
      },
    },
    {
      key: "action",
      width: "10%",
      textAlign: "right",
      header: "",
      renderCell: (_, row: MonthlyInventory) => {
        return (
          <Center>
            <Button
              onClick={() =>
                open(row.id, row.departmentId, row.materialId)
              }
            >
              {t("Details")}
            </Button>
          </Center>
        );
      },
    },
  ];
};

export type FilterType = {
  type: string;
  group: string;
  cateringId: string;
};

export const defaultCondition: FilterType = {
  type: "",
  group: "",
  cateringId: "",
};

export function filter(m: MonthlyInventory, condition?: FilterType) {
  if (
    condition?.cateringId &&
    m.departmentId !== condition.cateringId
  ) {
    return false;
  }
  if (condition?.type) {
    return store.isMaterialType(m.id, condition?.type);
  }
  if (condition?.group) {
    return store.isMaterialGroup(m.id, condition?.group);
  }
  return true;
}

export type Detail = {
  id: string;
  date: Date;
  type: WRType;
  deliveryCatering: string;
  receiveCatering: string;
  materialId: string;
  beginAmount: number;
  amount: number;
  endAmount: number;
  price: number;
};

export type WarehouseDetail = WarehouseReceiptDetail & {
  date: Date;
  type: WRType;
  departmentId: string;
  supplierId?: string;
  cateringId?: string;
};
