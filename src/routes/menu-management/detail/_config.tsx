import {
  ClientRoles,
  ClientRoles as Roles,
} from "@/auto-generated/api-configs";
import NumberInput from "@/components/common/NumberInput";
import {
  DailyMenu,
  Product,
  type DailyMenuDetailMode as Mode,
} from "@/services/domain";
import { DataGridColumnProps, Payload } from "@/types";
import { numberWithDelimiter } from "@/utils";
import { Button, Flex, Text } from "@mantine/core";
import store from "./_item.store";

export const _configs = (
  t: (key: string) => string,
  mode: Mode,
  user: Payload,
  cateringId: string,
  _disabled: boolean,
  dailyMenu?: DailyMenu,
): DataGridColumnProps[] => {
  const role = user.others.roles[0];
  let disabled = _disabled;
  const isCatering = role === Roles.CATERING;

  if (!_disabled) {
    if (role === ClientRoles.PRODUCTION) {
      disabled = mode === "modified";
    } else if (role === ClientRoles.CATERING) {
      disabled = mode === "detail";
    }
  }
  return [
    {
      key: "typeName",
      header: t("Product type"),
      width: "10%",
      renderCell: (_: unknown, product: Product) => {
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
      width: isCatering ? "45rem" : "15rem",
    },
    {
      key: "quantity",
      header: t("Quantity"),
      width: "100px",
      renderCell(_: unknown, product: Product) {
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
            disabled={disabled}
            min={0}
            defaultValue={dailyMenu?.others.quantity[product.id] ?? 1}
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
      hidden: isCatering,
      textAlign: "right",
      renderCell: (_: unknown, product: Product) => {
        const cost =
          product.others.costPriceByCatering?.[cateringId] || 0;
        return (
          <Text w="100%" ta="right">
            {cost ? `${numberWithDelimiter(cost)} đ` : "N/A"}
          </Text>
        );
      },
    },
    {
      key: "avgCostPrice",
      header: t("Average cost price"),
      width: "120px",
      hidden: isCatering,
      textAlign: "right",
      renderCell: () => {
        const cost = 0;
        return (
          <Text w="100%" ta="right">
            {cost ? `${numberWithDelimiter(cost)} đ` : "N/A"}
          </Text>
        );
      },
    },
    {
      key: "ratio",
      header: t("Ratio"),
      width: "100px",
      textAlign: "right",
      hidden: isCatering,
      renderCell() {
        const ratio = Math.floor(Math.random() * 10000) / 100 + "%";
        return (
          <Text w="100%" ta="right">
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
      // hidden: isCatering,
      renderCell: (_: unknown, product: Product) => {
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
              disabled={disabled || isCatering}
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
