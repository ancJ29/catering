import Switch from "@/components/common/Switch";
import { CustomerProduct, Product } from "@/services/domain";
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
      defaultVisible: true,
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
