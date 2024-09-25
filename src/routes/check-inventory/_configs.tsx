import NumberInput from "@/components/common/NumberInput";
import { Material } from "@/services/domain";
import { DataGridColumnProps } from "@/types";
import {
  Center,
  Checkbox,
  Stack,
  Text,
  TextInput,
} from "@mantine/core";
import store from "./_inventory.store";

export const configs = (
  t: (key: string) => string,
  isAuditedAllItems: boolean,
  onAuditedAllItems: (checked: boolean) => void,
): DataGridColumnProps[] => {
  return [
    {
      key: "name",
      sortable: true,
      header: t("Material name"),
      width: "15%",
      defaultVisible: true,
    },
    {
      key: "unit",
      width: "5%",
      textAlign: "center",
      header: t("Unit"),
      defaultVisible: true,
      renderCell: (_, row: Material) => {
        return row.others?.unit?.name || "N/A";
      },
    },
    {
      key: "amountAfterAudit",
      header: t("Amount after audit"),
      textAlign: "right",
      width: "8%",
      renderCell: (_, row: Material) => {
        return store.getAmountAfterAudit(row.id).toLocaleString();
      },
    },
    {
      key: "amountShippedAfterAudit",
      header: t("Amount shipped after audit"),
      textAlign: "right",
      width: "8%",
      renderCell: (_, row: Material) => {
        return store
          .getAmountShippedAfterAudit(row.id)
          .toLocaleString();
      },
    },
    {
      key: "amountReceivedAfterAudit",
      header: t("Amount received after audit"),
      textAlign: "right",
      width: "8%",
      renderCell: (_, row: Material) => {
        return store
          .getAmountReceivedAfterAudit(row.id)
          .toLocaleString();
      },
    },
    {
      key: "systemAmount",
      header: t("System amount"),
      width: "8%",
      textAlign: "right",
      renderCell: (_, row: Material) => {
        return store.getSystemAmount(row.id).toLocaleString();
      },
    },
    {
      key: "physicalAmount",
      header: t("Physical amount"),
      textAlign: "right",
      width: "10%",
      renderCell: (_, row: Material) => {
        return (
          <NumberInput
            key={row.id}
            thousandSeparator=""
            isPositive={true}
            defaultValue={store.getAmount(row.id)}
            onChange={(value) => store.setAmount(row.id, value)}
            allowDecimal={row?.others.unit?.allowFloat || false}
            isInteger={!row?.others.unit?.allowFloat}
            style={{ paddingLeft: "2rem" }}
          />
        );
      },
    },
    {
      key: "difference",
      header: t("Difference"),
      textAlign: "right",
      width: "8%",
      renderCell: (_, row: Material) => {
        return store.getDifference(row.id).toLocaleString();
      },
    },
    {
      key: "memo",
      header: t("Memo"),
      headerStyle: {
        paddingLeft: "0.8rem",
      },
      width: "15%",
      renderCell: (_, row: Material) => {
        return (
          <TextInput
            defaultValue={store.getMemo(row.id)}
            onChange={(e) => store.setMemo(row.id, e.target.value)}
            style={{ paddingLeft: "1rem" }}
          />
        );
      },
    },
    {
      key: "checked",
      header: (
        <Stack gap={5} align="center">
          <Text fw="bold">{t("Checked")}</Text>
          <Checkbox
            defaultChecked={isAuditedAllItems}
            color="white"
            iconColor="primary"
            onChange={(value) =>
              onAuditedAllItems(value.target.checked)
            }
          />
        </Stack>
      ),
      headerMobile: t("Checked"),
      width: "6%",
      textAlign: "center",
      renderCell: (_, row: Material) => {
        return (
          <Center w="full">
            <Checkbox
              key={row.id}
              defaultChecked={store.getIsAudited(row.id)}
              onChange={(value) =>
                store.setIsAudited(row.id, value.target.checked)
              }
            />
          </Center>
        );
      },
    },
  ];
};

export enum CheckType {
  ALL = "All",
  CHECKED = "Checked",
  NOT_CHECKED = "Not Checked",
}

export type FilterType = {
  type: string;
  group: string;
  checkType: CheckType;
};

export const defaultCondition: FilterType = {
  type: "",
  group: "",
  checkType: CheckType.ALL,
};

export function filter(m: Material, condition?: FilterType) {
  if (condition?.group && m.others.group !== condition.group) {
    return false;
  }
  if (condition?.type && m.others.type !== condition.type) {
    return false;
  }
  if (condition?.checkType === CheckType.CHECKED) {
    return store.getIsAudited(m.id);
  }
  if (condition?.checkType === CheckType.NOT_CHECKED) {
    return !store.getIsAudited(m.id);
  }
  return true;
}
