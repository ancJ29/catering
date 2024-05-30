import {
  Actions,
  configs as actionConfigs,
} from "@/auto-generated/api-configs";
import IconBadge from "@/components/c-catering/IconBadge";
import { DataGridColumnProps } from "@/types";
import { unique } from "@/utils";
import { z } from "zod";

const { response } = actionConfigs[Actions.GET_DEPARTMENTS].schema;
const departmentSchema = response.shape.departments.transform(
  (array) => array[0],
);

export type Department = z.infer<typeof departmentSchema>;

export const configs = (
  t: (key: string) => string,
): DataGridColumnProps[] => {
  return [
    {
      key: "name",
      sortable: true,
      header: t("Catering name"),
      width: "20%",
    },
    {
      key: "code",
      header: t("Code"),
      width: "15%",
      textAlign: "left",
    },
    {
      key: "catering-type",
      header: t("Type"),
      width: "15%",
      renderCell: (_, row) => {
        return row.others?.isCenter
          ? t("Central catering")
          : t("Non-central catering");
      },
    },
    {
      key: "enabled",
      header: t("Status"),
      width: "15%",
      renderCell: (value) => {
        return value ? t("In operation") : t("Stopped");
      },
    },
    {
      key: "inventory-check-date",
      header: t("Inventory check date"),
      width: "10%",
      renderCell: (_, row) => {
        if (row.others?.lastInventoryDate) {
          return row.others.lastInventoryDate.toLocaleDateString();
        }
        return "N/A";
      },
    },
    {
      key: "suppliers",
      header: t("Suppliers"),
      width: "10%",
      textAlign: "right",
      renderCell: (_, row: Department) => {
        const suppliers = unique(
          row.supplierMaterials.map(
            (supplierMaterial) => supplierMaterial.supplier.id,
          ),
        );
        return (
          <IconBadge
            total={suppliers.length}
            navigateUrl={`/catering-management/supplier/${row.id}`}
          />
        );
      },
    },
  ];
};
