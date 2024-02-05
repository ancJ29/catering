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
      key: "fullName",
      header: t("Full Name"),
      width: "15%",
    },
    {
      key: "email",
      header: t("Email"),
      width: "25%",
    },
    {
      key: "roles",
      header: t("Role"),
      width: "10%",
      renderCell: (roles: { name: string }[]) => {
        return roles.map((role) => t(role.name)).join(", ");
      },
    },
    {
      key: "departments",
      header: t("Department"),
      width: "20%",
      renderCell: (departments: { name: string }[]) => {
        return (
          departments
            .map((department) => department.name)
            .join(", ") || "-"
        );
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
