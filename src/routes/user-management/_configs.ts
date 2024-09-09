import {
  Actions,
  configs as actionConfigs,
} from "@/auto-generated/api-configs";
import { DataGridColumnProps } from "@/types";
import { z } from "zod";

const { response } = actionConfigs[Actions.GET_USERS].schema;
const userSchema = response.shape.users.transform(
  (array) => array[0],
);
export type User = z.infer<typeof userSchema>;

export const configs = (
  t: (key: string) => string,
): DataGridColumnProps[] => {
  return [
    {
      key: "userName",
      sortable: true,
      header: t("Username"),
      width: "15%",
      defaultVisible: true,
    },
    {
      key: "fullName",
      sortable: true,
      header: t("Full name"),
      width: "15%",
      defaultVisible: true,
    },
    {
      key: "email",
      sortable: true,
      header: t("Email"),
      width: "25%",
      defaultVisible: true,
    },
    {
      key: "roles",
      header: t("Role"),
      width: "10%",
      renderCell: (_, user: User) => {
        return user.others.roles
          .map((role) => t(`user.role.${role}`))
          .join(", ");
        // return roles.map((role) => t(role.name)).join(", ");
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
      renderCell: (active) => {
        return active ? t("Active") : t("Disabled");
      },
    },
  ];
};
