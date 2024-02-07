import {
  Actions,
  configs as actionConfigs,
} from "@/auto-generated/api-configs";
import { DataGridColumnProps } from "@/types";
import { z } from "zod";

const { response } = actionConfigs[Actions.GET_CUSTOMERS].schema;
const customerSchema = response.shape.customers.transform(
  (array) => array[0],
);

export type Customer = z.infer<typeof customerSchema>;

export const configs = (
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
      renderCell: (_, row: Customer) => {
        return row.others?.cateringName || "-";
      },
    },
    {
      key: "type",
      header: t("Catering name"),
      width: "10%",
      textAlign: "left",
      renderCell: (_, row: Customer) => {
        return row.others?.type ? t(row.others?.type) : "-";
      },
    },
  ];
};
