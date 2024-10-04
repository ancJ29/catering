import { Material, Supplier } from "@/services/domain";
import { DataGridColumnProps } from "@/types";

export const configs = (
  t: (key: string) => string,
  suppliers: Map<string, Supplier>,
  cateringId?: string,
): DataGridColumnProps[] => {
  return [
    {
      key: "name",
      sortable: true,
      style: { fontWeight: "bold" },
      header: t("Material name"),
      width: "30%",
      defaultVisible: true,
    },
    {
      key: "code",
      sortable: true,
      header: t("Material code"),
      width: "10%",
      defaultVisible: true,
      renderCell: (_, row: Material) => {
        return row.others.internalCode || "N/A";
      },
    },
    {
      key: "group",
      header: t("Material group"),
      width: "10%",
      textAlign: "center",
      renderCell: (_, row: Material) => {
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
      width: "10%",
      textAlign: "right",
      header: t("Unit"),
      renderCell: (_, row: Material) => {
        return row.others?.unit?.name || "N/A";
      },
    },
    {
      key: "priorityPrice",
      width: "15%",
      textAlign: "right",
      header: t("Priority price"),
      style: { fontWeight: "bold" },
      renderCell: (_, row: Material) => {
        return (
          row?.others?.prices?.[cateringId || ""]?.price || 0
        ).toLocaleString();
      },
    },
    {
      key: "supplier",
      width: "25%",
      header: t("Supplier name"),
      textAlign: "center",
      renderCell: (_, row: Material) => {
        return suppliers.get(
          row?.others?.prices?.[cateringId || ""]?.supplierId || "",
        )?.name;
      },
    },
  ];
};
