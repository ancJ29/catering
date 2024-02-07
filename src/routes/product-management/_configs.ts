import {
  Actions,
  configs as actionConfigs,
} from "@/auto-generated/api-configs";
import { DataGridColumnProps } from "@/types";
import { z } from "zod";

const { response } = actionConfigs[Actions.GET_PRODUCTS].schema;
const productSchema = response.shape.products.transform(
  (array) => array[0],
);
export type Product = z.infer<typeof productSchema> & {
  typeName?: string;
};

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
