import Switch from "@/components/common/Switch";
import { Product } from "@/services/domain";
import { CustomerProduct } from "@/services/domain/customer-product";
import { DataGridColumnProps } from "@/types";
import { Flex } from "@mantine/core";

export const configs = (
  t: (key: string) => string,
  productById: Map<string, Product>,
  actives: Map<string, boolean>,
  setActive: (customerProductId: string, active: boolean) => void,
): DataGridColumnProps[] => {
  return [
    {
      key: "name",
      sortable: true,
      header: t("Product"),
      width: "40%",
      renderCell: (_, row: CustomerProduct) => {
        return productById.get(row.productId)?.name || "N/A";
      },
    },
    {
      key: "type",
      header: t("Product type"),
      width: "20%",
      renderCell: (_, row: CustomerProduct) => {
        return t(
          `products.type.${
            productById.get(row.productId)?.others.type
          }`,
        );
      },
    },
    {
      key: "category",
      header: t("Product category"),
      width: "20%",
      renderCell: (_, row: CustomerProduct) => {
        return t(
          `products.category.${
            productById.get(row.productId)?.others.category
          }`,
        );
      },
    },
    {
      key: "Served",
      header: t("Served"),
      width: "20%",
      textAlign: "center",
      renderCell: (_, row: CustomerProduct) => {
        const checked =
          actives.get(row.id) !== undefined
            ? actives.get(row.id)
            : row.enabled;
        return (
          <Flex justify="center">
            <Switch
              defaultChecked={checked || false}
              onChangeValue={(value) => setActive(row.id, value)}
            />
          </Flex>
        );
      },
    },
  ];
};

export const SERVED = "1";
export const NOT_SERVED = "0";

export type FilterType = {
  served: string;
};

export const defaultCondition: FilterType = {
  served: "",
};

export function filter(cp: CustomerProduct, condition?: FilterType) {
  if (
    condition?.served &&
    cp.enabled &&
    condition.served !== SERVED
  ) {
    return false;
  }
  if (
    condition?.served &&
    !cp.enabled &&
    condition.served !== NOT_SERVED
  ) {
    return false;
  }
  return true;
}
