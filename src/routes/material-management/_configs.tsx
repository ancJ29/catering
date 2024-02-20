import { DataGridColumnProps } from "@/types";

export const configs = (
  t: (key: string) => string,
): DataGridColumnProps[] => {
  return [
    {
      key: "name",
      sortable: true,
      header: t("Material name"),
      width: "20%",
    },
    {
      key: "code",
      sortable: true,
      header: t("Material code"),
      width: "5%",
    },
    {
      key: "type",
      header: t("Material type"),
      width: "15%",
      textAlign: "center",
      renderCell: (_, row) => {
        if (!row.others.type) {
          return "N/A";
        }
        const code = row.others.type;
        const type = t(`materials.type.${code}`);
        return <span>{`${type} (${code})`}</span>;
      },
    },
    {
      key: "group",
      header: t("Material group"),
      width: "10%",
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
      width: "10%",
      textAlign: "right",
      header: t("Unit"),
      renderCell: (_, row) => {
        return row.others?.unit?.name || "N/A";
      },
    },
    {
      key: "suppliers",
      width: "10%",
      textAlign: "right",
      header: t("Suppliers"),
      renderCell: () => {
        return "TODO";
      },
    },
  ];
};
