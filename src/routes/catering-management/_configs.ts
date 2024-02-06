import { DataGridColumnProps } from "@/types";

const configs = (
  t: (key: string) => string,
): DataGridColumnProps[] => {
  return [
    {
      key: "name",
      header: t("Catering name"),
      width: "30%",
    },
    {
      key: "code",
      header: t("Code"),
      width: "20%",
      textAlign: "left",
    },
    {
      key: "kitchen-type",
      header: t("Type"),
      width: "20%",
      renderCell: (_, row) => {
        return row.others?.isCenter
          ? t("Central catering")
          : t("Non-central catering");
      },
    },
    {
      key: "enabled",
      header: t("Status"),
      width: "20%",
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
      width: "20%",
      style: { textAlign: "right", paddingRight: "1rem" },
      renderCell: () => "TODO",
    },
  ];
};

export default configs;
