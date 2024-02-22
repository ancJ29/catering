import { Product } from "@/services/domain";
import { DataGridColumnProps } from "@/types";

export const configs = (
  t: (key: string) => string,
): DataGridColumnProps[] => {
  return [
    {
      key: "name",
      sortable: true,
      header: t("Cuisine name"),
      width: "30%",
    },
    {
      key: "code",
      sortable: true,
      header: t("Cuisine code"),
      width: "20%",
    },
    {
      key: "typeName",
      sortable: true,
      header: t("Cuisine type"),
      width: "20%",
      renderCell: (_, product: Product) => {
        return t(`products.type.${product.others.type}`);
      },
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

export type FilterType = {
  type: string;
  onSaleOnly: boolean;
};

export const defaultCondition: FilterType = {
  type: "",
  onSaleOnly: false,
};

export function filter(p: Product, x?: FilterType) {
  if (!x) {
    return true;
  }
  if (x.type && p.others.type !== x.type) {
    return false;
  }
  if (x.onSaleOnly && !p.enabled) {
    return false;
  }
  return true;
}
