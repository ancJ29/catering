import { DataGridColumnProps } from "@/types";
import SupplierSettingForm from "./SupplierSettingForm";

const configs = (
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
      style: { textAlign: "right", paddingRight: "1rem" },
      renderCell: (_, department) => {
        const totalSupplier = parseInt(
          department.others?.totalSupplier || "0",
        );
        return (
          <SupplierSettingForm
            department={department}
            totalSupplier={totalSupplier}
          />
        );
      },
    },
  ];
};

export default configs;
