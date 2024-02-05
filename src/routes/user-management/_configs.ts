import { DataGridColumnProps } from "@/types";

const configs = (
  t: (key: string) => string,
): DataGridColumnProps[] => {
  return [
    {
      key: "userName",
      header: t("Username"),
      width: "15%",
    },
    {
      key: "email",
      header: t("Email"),
      width: "20%",
    },
    {
      key: "roles",
      header: t("Role"),
      width: "20%",
      renderCell: (roles: { name: string }[]) => {
        return roles.map((role) => t(role.name)).join(", ");
      },
    },
    {
      key: "active",
      header: t("Status"),
      width: "20%",
      // textAlign: "center",
      renderCell: (active) => {
        return active ? t("Active") : t("Disabled");
      },
    },
  ];
};

export default configs;
