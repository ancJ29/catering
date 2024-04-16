import LastUpdated from "@/components/common/LastUpdated";
import NumberInput from "@/components/common/NumberInput";
import { Material } from "@/services/domain";
import { DataGridColumnProps } from "@/types";
import { Center, Checkbox } from "@mantine/core";
import store from "./_inventory.store";

export type MaterialFilterType = {
  type: string;
  group: string;
  checked: "All" | "Checked" | "Not Checked";
};

export type CateringFilterType = {
  cateringId?: string;
};

export function filter(m: Material, condition?: MaterialFilterType) {
  if (condition?.group && m.others.group !== condition.group) {
    return false;
  }
  if (condition?.type && m.others.type !== condition.type) {
    return false;
  }
  if (condition?.checked === "Checked") {
    return store.checked(m.id);
  }
  if (condition?.checked === "Not Checked") {
    return !store.checked(m.id);
  }
  return true;
}

export const defaultCondition: CateringFilterType = {};

export enum ActionType {
  SET_CATERING_ID = "SET_CATERING_ID",
  CLEAR_CATERING_ID = "CLEAR_CATERING_ID",
}

export const reducer = (
  state: CateringFilterType,
  action: {
    type: ActionType;
    cateringId?: string;
  },
): CateringFilterType => {
  switch (action.type) {
    case ActionType.CLEAR_CATERING_ID:
      return { ...state, cateringId: undefined };
    case ActionType.SET_CATERING_ID:
      if (action.cateringId) {
        return { ...state, cateringId: action.cateringId };
      }
      break;
    default:
      break;
  }
  return state;
};

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
    // {
    //   key: "difference",
    //   header: t("Difference"),
    //   textAlign: "right",
    //   width: "300px",
    //   renderCell: (_, row) => {
    //     return (
    //       <div>{store.getDifference(row.id).toLocaleString()}</div>
    //     );
    //   },
    // },
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
