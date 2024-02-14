import { DataGridColumnProps } from "@/types";

export const configs = (
  t: (key: string) => string,
): DataGridColumnProps[] => {
  return [
    {
      key: "name",
      header: t("Supplier name"),
      width: "20%",
    },
    {
      key: "code",
      header: t("Supplier code"),
      width: "10%",
    },
    {
      key: "contact",
      header: t("Supplier contact"),
      width: "10%",
      renderCell: (_, row) => {
        const email = row.others?.email;
        const phone = row.others?.phone;
        return `${row.others?.contact || "-"} ${email || ""}${
          email && phone ? " " : ""
        }${phone || ""}`;
      },
    },
  ];
};
