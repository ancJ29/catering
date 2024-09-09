import Switch from "@/components/common/Switch";
import { Target } from "@/services/domain";
import { DataGridColumnProps } from "@/types";
import { numberWithDelimiter } from "@/utils";
import { Flex } from "@mantine/core";

export const configs = (
  t: (key: string) => string,
  actives: Map<string, boolean>,
  setActive: (key: string, active: boolean) => void,
): DataGridColumnProps[] => {
  return [
    {
      key: "name",
      sortable: true,
      header: t("Meal target audience"),
      width: "30%",
      defaultVisible: true,
    },
    {
      key: "shift",
      header: t("Meal shift"),
      width: "5%",
      textAlign: "center",
      defaultVisible: true,
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
      renderCell: (_, row: Target) => {
        return numberWithDelimiter(row.price);
      },
    },
    {
      key: "Served",
      header: t("Served"),
      width: "20%",
      textAlign: "center",
      renderCell: (_, row: Target) => {
        const key = `${row.name}-${row.shift}`;
        const checked =
          actives.get(key) !== undefined
            ? actives.get(key)
            : row.enabled;
        return (
          <Flex justify="center">
            <Switch
              defaultChecked={checked || false}
              onChangeValue={(value) => setActive(key, value)}
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

export function filter(t: Target, condition?: FilterType) {
  if (condition?.served && t.enabled && condition.served !== SERVED) {
    return false;
  }
  if (
    condition?.served &&
    !t.enabled &&
    condition.served !== NOT_SERVED
  ) {
    return false;
  }
  return true;
}
