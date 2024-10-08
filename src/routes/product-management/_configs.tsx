import ActionIcon from "@/components/c-catering/ActionIcon";
import {
  FilterType as ProductFilterType,
  Tab,
} from "@/routes/bom-management/_configs";
import { Product } from "@/services/domain";
import { DataGridColumnProps } from "@/types";
import { buildHash } from "@/utils";
import { isNotEmpty } from "@mantine/form";
import { IconSoup } from "@tabler/icons-react";
import { NavigateFunction } from "react-router-dom";

export const configs = (
  t: (key: string) => string,
  navigate: NavigateFunction,
): DataGridColumnProps[] => {
  return [
    {
      key: "name",
      sortable: true,
      header: t("Cuisine name"),
      width: "30%",
      defaultVisible: true,
    },
    {
      key: "code",
      sortable: true,
      header: t("Cuisine code"),
      width: "20%",
      defaultVisible: true,
      renderCell: (_, product: Product) => {
        return product.others.internalCode;
      },
    },
    {
      key: "typeName",
      sortable: true,
      header: t("Cuisine type"),
      width: "20%",
      renderCell: (_, product: Product) => {
        return t(`products.type.${product.others.type}`);
      },
    },
    {
      key: "enabled",
      width: "15%",
      header: t("On sale"),
      style: {
        flexGrow: 1,
        justifyContent: "end",
        paddingRight: "1rem",
        display: "flex",
      },
      renderCell: (value: boolean) => {
        return value ? t("YES") : t("NO");
      },
    },
    {
      key: "amount",
      width: "15%",
      header: t("Amount"),
      textAlign: "center",
      renderCell: (_, product: Product) => {
        const condition: ProductFilterType = {
          productId: product.id,
          tab: Tab.STANDARD,
        };
        const hash = buildHash(condition);
        return (
          <ActionIcon
            onClick={() => navigate(`/bom-management#${hash}`)}
          >
            <IconSoup strokeWidth="1.5" />
          </ActionIcon>
        );
      },
    },
  ];
};

export type FilterType = {
  type: string;
  onSaleOnly: boolean;
};

export const defaultCondition: FilterType = {
  type: "",
  onSaleOnly: false,
};

export function filter(p: Product, x?: FilterType) {
  if (!x) {
    return true;
  }
  if (x.type && p.others.type !== x.type) {
    return false;
  }
  if (x.onSaleOnly && !p.enabled) {
    return false;
  }
  return true;
}

export type ProductRequest = {
  id: string;
  name: string;
  code: string;
  description: string;
  enabled: boolean;
  others: {
    type: string;
    oldId: number;
    internalCode: string;
    category: string;
    party: boolean;
    normal: boolean;
    supply: boolean;
  };
};

export const initialValues: ProductRequest = {
  id: "",
  name: "",
  code: "",
  description: "",
  enabled: true,
  others: {
    type: "",
    oldId: 0,
    internalCode: "",
    category: "",
    party: true,
    normal: true,
    supply: true,
  },
};

export function _validate(t: (s: string) => string) {
  return {
    "name": isNotEmpty(t("Field is required")),
    "others.internalCode": isNotEmpty(t("Field is required")),
    "others.type": isNotEmpty(t("Field is required")),
    "others.category": isNotEmpty(t("Field is required")),
  };
}
