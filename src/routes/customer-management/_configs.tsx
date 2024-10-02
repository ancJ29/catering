import { Customer, Department } from "@/services/domain";
import { DataGridColumnProps } from "@/types";
import { isNotEmpty } from "@mantine/form";
import Actions from "./components/Actions";

export const configs = (
  t: (key: string) => string,
  caterings: Map<string, Department>,
  onProductClick: (id: string) => void,
  onTargetAudienceClick: (id: string) => void,
): DataGridColumnProps[] => {
  return [
    {
      key: "name",
      sortable: true,
      header: t("Customer"),
      width: "20%",
      defaultVisible: true,
    },
    {
      key: "code",
      header: t("Customer code"),
      width: "15%",
      textAlign: "left",
      defaultVisible: true,
    },
    {
      key: "catering",
      header: t("Catering name"),
      width: "20%",
      textAlign: "left",
      defaultVisible: true,
      renderCell: (_, row: Customer) => {
        return caterings.get(row.others?.cateringId)?.name || "-";
      },
    },
    {
      key: "type",
      header: t("Customer type"),
      width: "10%",
      textAlign: "left",
      renderCell: (_, row: Customer) => {
        return row.others?.type ? t(row.others?.type) : "-";
      },
    },
    {
      key: "action",
      header: t("Action"),
      width: "10%",
      textAlign: "center",
      renderCell: (_, row: Customer) => {
        return (
          <Actions
            customer={row}
            onTargetAudienceClick={onTargetAudienceClick}
            onProductClick={onProductClick}
          />
        );
      },
    },
  ];
};

export type CustomerRequest = {
  id: string;
  name: string;
  code: string;
  memo?: string;
  others: {
    cateringId: string;
    type: string;
    targets: {
      name: string;
      shift: string;
      price: number;
      enabled: boolean;
    }[];
  };
};

export const initialValues: CustomerRequest = {
  id: "",
  name: "",
  code: "",
  memo: "",
  others: {
    cateringId: "",
    type: "",
    targets: [],
  },
};

export function _validate(t: (s: string) => string) {
  return {
    "name": isNotEmpty(t("Field is required")),
    "code": isNotEmpty(t("Field is required")),
    "others.cateringId": isNotEmpty(t("Field is required")),
    "others.type": isNotEmpty(t("Field is required")),
  };
}
