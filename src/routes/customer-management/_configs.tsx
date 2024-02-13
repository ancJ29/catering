import { Customer } from "@/services/domain";
import { DataGridColumnProps } from "@/types";

export const configs = (
  t: (key: string) => string,
): DataGridColumnProps[] => {
  return [
    {
      key: "name",
      sortable: true,
      header: t("Customer"),
      width: "20%",
    },
    {
      key: "code",
      header: t("Code"),
      width: "10%",
      textAlign: "left",
    },
    {
      key: "catering",
      header: t("Catering name"),
      width: "20%",
      textAlign: "left",
      renderCell: (_, row: Customer) => {
        return row.others?.cateringName || "-";
      },
    },
    {
      key: "type",
      header: t("Customer type"),
      width: "10%",
      textAlign: "left",
      renderCell: (_, row: Customer) => {
        return row.others?.type ? t(row.others?.type) : "-";
      },
    },
  ];
};
