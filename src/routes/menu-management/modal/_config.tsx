import NumberInput from "@/components/common/NumberInput";
import {
  DailyMenu,
  Product,
  type DailyMenuDetailMode as Mode,
} from "@/services/domain";
import { DataGridColumnProps } from "@/types";
import { Button, Flex, Text } from "@mantine/core";
import store from "./_item.store";

export const _configs = (
  t: (key: string) => string,
  mode: Mode,
  dailyMenu?: DailyMenu,
): DataGridColumnProps[] => {
  return [
    {
      key: "typeName",
      header: t("Product type"),
      width: "10%",
      renderCell: (_, product: Product) => {
        return (
          <Text fz="sm">
            {t(`products.type.${product.others.type}`)}
          </Text>
        );
      },
    },
    {
      key: "name",
      header: t("Cuisine name"),
      width: "15rem",
    },
    {
      key: "quantity",
      header: t("Quantity"),
      width: "100px",
      renderCell(_, product: Product) {
        return (
          <NumberInput
            fw={600}
            styles={{
              input: {
                color: mode === "detail" ? "black" : "",
                backgroundColor:
                  mode === "modified"
                    ? "var(--mantine-color-red-1)"
                    : undefined,
              },
            }}
            disabled={mode === "detail"}
            defaultValue={dailyMenu?.others.quantity[product.id] || 0}
            onChange={(quantity) =>
              store.setQuantity(product.id, quantity)
            }
          />
        );
      },
    },
    {
      key: "costPrice",
      header: t("Cost price"),
      width: "100px",
      renderCell() {
        const cost = Math.floor(Math.random() * 500) * 100;
        return (
          <Text w="100%" ta="right" c="red.6">
            {cost.toLocaleString()}&nbsp;đ
          </Text>
        );
      },
    },
    {
      key: "avgCostPrice",
      header: t("Average cost price"),
      width: "100px",
      renderCell() {
        const cost = Math.floor(Math.random() * 500) * 100;
        return (
          <Text w="100%" ta="right" c="red.6">
            {cost.toLocaleString()}&nbsp;đ
          </Text>
        );
      },
    },
    {
      key: "ratio",
      header: t("Ratio"),
      width: "70px",
      renderCell() {
        const ratio = Math.floor(Math.random() * 10000) / 100 + "%";
        return (
          <Text w="100%" ta="right" c="red.6">
            {ratio}
          </Text>
        );
      },
    },
    {
      key: "action",
      textAlign: {
        cell: "right",
      },
      style: {
        paddingRight: "1rem",
        flexGrow: 1,
      },
      renderCell: (_, product: Product) => {
        return (
          <Flex justify="end" align="center" gap={10}>
            <Button
              size="compact-xs"
              onClick={() => {
                alert("Not implemented!!!");
              }}
            >
              {t("BOM")}
            </Button>
            <Button
              size="compact-xs"
              variant="light"
              color="error"
              onClick={store.removeProduct.bind(null, product.id)}
            >
              {t("Remove")}
            </Button>
          </Flex>
        );
      },
    },
  ];
};
