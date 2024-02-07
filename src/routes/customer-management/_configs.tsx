import { DataGridColumnProps } from "@/types";

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
      width: "10%",
      textAlign: "left",
    },
    {
      key: "catering",
      header: t("Catering name"),
      width: "20%",
      textAlign: "left",
      renderCell: (_, row) => {
        return row.others?.cateringName || "-";
      },
    },
    {
      key: "type",
      header: t("Catering name"),
      width: "10%",
      textAlign: "left",
      renderCell: (_, row) => {
        return row.others?.type ? t(row.others?.type) : "-";
      },
    },
  ];
};

export default configs;
