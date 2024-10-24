import { Material, Supplier } from "@/services/domain";
import { DataGridColumnProps } from "@/types";
import {
  endOfWeek,
  formatTime,
  numberWithDelimiter,
  startOfWeek,
} from "@/utils";

export const configs = (
  t: (key: string) => string,
  cateringId: string | undefined,
  suppliers: Map<string, Supplier>,
): DataGridColumnProps[] => {
  return [
    {
      key: "sup",
      header: t("Sup"),
      width: "15%",
      defaultVisible: true,
      renderCell: (_, row: Material) => {
        const supplierId =
          row.others?.prices?.[cateringId || ""]?.supplierId || "";
        return suppliers.get(supplierId)?.name || "-";
      },
    },
    {
      key: "name",
      sortable: true,
      header: t("Material name"),
      width: "23%",
      defaultVisible: true,
    },
    {
      key: "code",
      header: t("Material code"),
      width: "7%",
      defaultVisible: true,
      renderCell: (_, row: Material) => {
        return row.others.internalCode || "N/A";
      },
    },
    {
      key: "group",
      header: t("Material group"),
      width: "15%",
      textAlign: "center",
      renderCell: (_, row) => {
        if (!row.others.group) {
          return "N/A";
        }
        const code = row.others.group;
        const group = t(`materials.group.${code}`);
        return <span>{`${group} (${code})`}</span>;
      },
    },
    {
      key: "unit",
      width: "8%",
      textAlign: "right",
      header: t("Unit"),
      renderCell: (_, row) => {
        return row.others?.unit?.name || "N/A";
      },
    },
    {
      key: "price",
      header: t("Price"),
      width: "10%",
      textAlign: "right",
      renderCell: (_, row: Material) => {
        return numberWithDelimiter(
          row.others?.prices?.[cateringId || ""]?.price || 0,
        );
      },
    },
    {
      key: "applicableDate",
      header: t("Applicable date"),
      width: "12%",
      textAlign: "center",
      renderCell: (_, row: Material) => {
        const supplierId =
          row.others?.prices?.[cateringId || ""]?.supplierId || "";
        const supplierMaterial = row.supplierMaterials.find(
          (sm) => sm.supplier.id === supplierId,
        );
        return formatTime(supplierMaterial?.updatedAt);
      },
    },
    {
      key: "status",
      header: t("Status"),
      width: "10%",
      textAlign: "center",
      renderCell: (_, row: Material) => {
        const supplierId =
          row.others?.prices?.[cateringId || ""]?.supplierId || "";
        return suppliers.get(supplierId)?.others.active
          ? t("Active")
          : t("Disabled");
      },
    },
  ];
};

export type FilterType = {
  from: number;
  to: number;
  supplierId: string;
  type: string;
  group: string;
};

export const defaultCondition: FilterType = {
  from: startOfWeek(Date.now()),
  to: endOfWeek(Date.now()),
  supplierId: "",
  type: "",
  group: "",
};

export function filter(
  m: Material,
  condition: FilterType | undefined,
  cateringId: string | undefined,
) {
  const supplierId =
    m.others?.prices?.[cateringId || ""]?.supplierId || "";
  const supplierMaterial = m.supplierMaterials.find(
    (sm) => sm.supplier.id === supplierId,
  );
  if (
    condition?.from &&
    supplierMaterial &&
    supplierMaterial.updatedAt.getTime() < condition.from
  ) {
    return false;
  }
  if (
    condition?.to &&
    supplierMaterial &&
    supplierMaterial.updatedAt.getTime() > condition.to
  ) {
    return false;
  }
  if (condition?.group && m.others.group !== condition.group) {
    return false;
  }
  if (condition?.type && m.others.type !== condition.type) {
    return false;
  }
  if (condition?.supplierId && supplierId !== condition.supplierId) {
    return false;
  }
  return true;
}
