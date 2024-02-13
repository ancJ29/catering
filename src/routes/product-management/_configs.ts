import { DataGridColumnProps } from "@/types";

export const configs = (
  t: (key: string) => string,
): DataGridColumnProps[] => {
  return [
    {
      key: "name",
      sortable: true,
      header: t("Product Name"),
      width: "30%",
    },
    {
      key: "code",
      sortable: true,
      header: t("Product code"),
      width: "20%",
    },
    {
      key: "typeName",
      sortable: true,
      header: t("Product type"),
      width: "20%",
    },
    {
      key: "enabled",
      width: "15%",
      header: t("On sale"),
      style: {
        flexGrow: 1,
        justifyContent: "end",
        paddingRight: "1rem",
        display: "flex",
      },
      renderCell: (value: boolean) => {
        return value ? t("YES") : t("NO");
      },
    },
  ];
};
