import Switch from "@/components/common/Switch";
import { Meal } from "@/services/domain";
import { CustomerProduct } from "@/services/domain/customer-product";
import { DataGridColumnProps } from "@/types";
import { numberWithDelimiter } from "@/utils";
import { Flex } from "@mantine/core";

export const configs = (
  t: (key: string) => string,
  actives: Map<string, boolean>,
  setActive: (serviceId: string, active: boolean) => void,
): DataGridColumnProps[] => {
  return [
    {
      key: "name",
      sortable: true,
      header: t("Meal target audience"),
      width: "30%",
    },
    {
      key: "shift",
      header: t("Meal shift"),
      width: "5%",
      textAlign: "center",
    },
    {
      key: "allowedSpending",
      header: t("Meal allowed spending"),
      width: "15%",
      textAlign: "right",
      renderCell: () => {
        return 0;
      },
    },
    {
      key: "quantity",
      header: t("Quantity"),
      width: "15%",
      textAlign: "right",
      renderCell: () => {
        return 0;
      },
    },
    {
      key: "price",
      header: t("Price"),
      width: "15%",
      textAlign: "right",
      renderCell: (_, row: Meal) => {
        return numberWithDelimiter(row.price);
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

export function filter(m: Meal, condition?: FilterType) {
  if (condition?.served && m.enabled && condition.served !== SERVED) {
    return false;
  }
  if (
    condition?.served &&
    !m.enabled &&
    condition.served !== NOT_SERVED
  ) {
    return false;
  }
  return true;
}
