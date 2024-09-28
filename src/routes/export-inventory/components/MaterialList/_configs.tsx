import { materialOrderCycleSchema } from "@/auto-generated/api-configs";
import NumberInput from "@/components/common/NumberInput";
import { theme } from "@/configs/theme/mantine-theme";
import { Inventory, Material } from "@/services/domain";
import { DataGridColumnProps } from "@/types";
import { Center, Checkbox, Stack, Text } from "@mantine/core";
import { IconCheck } from "@tabler/icons-react";
import store from "../../_export.store";

export const configs = (
  t: (key: string) => string,
  inventories: Record<string, Inventory>,
  isSelectAll: boolean,
): DataGridColumnProps[] => {
  return [
    {
      key: "name",
      sortable: true,
      header: t("Material name"),
      width: "25%",
      defaultVisible: true,
    },
    {
      key: "group",
      header: t("Material group"),
      width: "25%",
      textAlign: "center",
      renderCell: (_, row: Material) => {
        if (!row.others?.group) {
          return "N/A";
        }
        const code = row.others?.group;
        const group = t(`materials.group.${code}`);
        return <span>{`${group} (${code})`}</span>;
      },
    },
    {
      key: "orderCycle",
      header: t("Daily"),
      width: "10%",
      textAlign: "center",
      renderCell: (_, row: Material) => {
        return (
          <Center w="full">
            {row.others?.orderCycle ===
              materialOrderCycleSchema.Values.HN && (
              <IconCheck color={theme.colors?.primary?.[7] || ""} />
            )}
          </Center>
        );
      },
    },
    {
      key: "unit",
      width: "10%",
      textAlign: "center",
      header: t("Unit"),
      renderCell: (_, row: Material) => {
        return row.others?.unit?.name || "N/A";
      },
    },
    {
      key: "inventory",
      width: "10%",
      textAlign: "right",
      header: t("Inventory"),
      renderCell: (_, row: Material) => {
        return inventories[row.id]?.amount || 0;
      },
    },
    {
      key: "quantity",
      header: t("Quantity"),
      textAlign: "right",
      width: "10%",
      renderCell: (_, row: Material) => {
        return (
          <NumberInput
            key={row.id}
            thousandSeparator=""
            isPositive={true}
            defaultValue={store.getAmountInventory(row.id)}
            onChange={(value) =>
              store.setAmountInventory(row.id, value)
            }
            allowDecimal={row.others.unit?.allowFloat || false}
            isInteger={!row.others.unit?.allowFloat}
            max={inventories[row.id]?.amount || 0}
            style={{ paddingLeft: "2rem" }}
          />
        );
      },
    },
    {
      key: "checked",
      header: (
        <Stack gap={5} align="center">
          <Text fw="bold">{t("Choose")}</Text>
          <Checkbox
            checked={isSelectAll}
            color="white"
            iconColor="primary"
            onChange={(value) =>
              store.setIsSelectAll(value.target.checked)
            }
          />
        </Stack>
      ),
      headerMobile: t("Choose"),
      width: "10%",
      textAlign: "center",
      defaultVisible: true,
      renderCell: (_, row: Material) => {
        return (
          <Center w="full">
            <Checkbox
              key={row.id}
              checked={store.isSelected(row.id)}
              onChange={(value) =>
                store.setSelectMaterial(row.id, value.target.checked)
              }
            />
          </Center>
        );
      },
    },
  ];
};

export type FilterType = {
  type: string;
  group: string;
  orderCycles: string[];
};

export const defaultCondition: FilterType = {
  type: "",
  group: "",
  orderCycles: [],
};

export function filter(m: Material, condition?: FilterType) {
  if (condition?.group && m.others.group !== condition.group) {
    return false;
  }
  if (condition?.type && m.others.type !== condition.type) {
    return false;
  }
  if (
    condition?.orderCycles &&
    condition?.orderCycles.length > 0 &&
    !condition.orderCycles.includes(m.others.orderCycle)
  ) {
    return false;
  }
  return true;
}
