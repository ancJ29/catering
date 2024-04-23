import LastUpdated from "@/components/common/LastUpdated";
import NumberInput from "@/components/common/NumberInput";
import { Material } from "@/services/domain";
import { DataGridColumnProps } from "@/types";
import { Center, Checkbox } from "@mantine/core";
import store from "./_inventory.store";

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

export function filter(m: Material, condition?: FilterType) {
  if (condition?.group && m.others.group !== condition.group) {
    return false;
  }
  if (condition?.type && m.others.type !== condition.type) {
    return false;
  }
  if (condition?.checkType === CheckType.CHECKED) {
    return store.checked(m.id);
  }
  if (condition?.checkType === CheckType.NOT_CHECKED) {
    return !store.checked(m.id);
  }
  return true;
}

export const configs = (
  t: (key: string) => string,
): DataGridColumnProps[] => {
  return [
    {
      key: "name",
      sortable: true,
      header: t("Material name"),
      width: "25vw",
    },
    {
      key: "unit",
      width: "60px",
      textAlign: "left",
      header: t("Unit"),
      renderCell: (_, row) => {
        return row.others?.unit?.name || "N/A";
      },
    },
    {
      key: "remain",
      header: t("Remain amount"),
      width: "150px",
      textAlign: "right",
      renderCell: (_, row) => {
        return store.getAmount(row.id).toLocaleString();
      },
    },
    {
      key: "actual",
      header: t("Actual amount"),
      textAlign: "right",
      width: "150px",
      renderCell: (_, row) => {
        return (
          <NumberInput
            key={row.id}
            style={{ paddingLeft: "2rem" }}
            defaultValue={store.getAmount(row.id)}
            onChange={(value) => store.setAmount(row.id, value)}
          />
        );
      },
    },
    {
      key: "checked",
      header: t("Checked"),
      width: 150,
      textAlign: "center",
      renderCell: (_, row) => {
        return (
          <Center w="full">
            <Checkbox
              key={row.id}
              defaultChecked={store.checked(row.id)}
              onChange={() => store.markChecked(row.id)}
            />
          </Center>
        );
      },
    },
    {
      key: "lastUpdated",
      className: "c-catering-last-column flex-end",
      renderCell: (_, row) => {
        const inventory = store.getInventory(row.id);
        return inventory?.updatedAt ? (
          <LastUpdated
            key={row.id}
            lastModifiedBy={inventory.lastModifiedBy || "-"}
            updatedAt={inventory.updatedAt}
          />
        ) : (
          <></>
        );
      },
    },
  ];
};
