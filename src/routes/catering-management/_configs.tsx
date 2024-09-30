import {
  Actions,
  ClientRoles,
  configs as actionConfigs,
  emailSchema,
} from "@/auto-generated/api-configs";
import IconBadge from "@/components/c-catering/IconBadge";
import useMaterialStore from "@/stores/material.store";
import { DataGridColumnProps } from "@/types";
import { isVietnamesePhoneNumber, unique } from "@/utils";
import { isNotEmpty } from "@mantine/form";
import { z } from "zod";

const { response } = actionConfigs[Actions.GET_DEPARTMENTS].schema;
const departmentSchema = response.shape.departments.transform(
  (array) => array[0],
);

export type Department = z.infer<typeof departmentSchema>;

export const configs = (
  t: (key: string) => string,
): DataGridColumnProps[] => {
  return [
    {
      key: "name",
      sortable: true,
      header: t("Catering name"),
      width: "20%",
      defaultVisible: true,
    },
    {
      key: "code",
      header: t("Code"),
      width: "15%",
      textAlign: "left",
      defaultVisible: true,
    },
    {
      key: "catering-type",
      header: t("Type"),
      width: "15%",
      renderCell: (_, row) => {
        return row.others?.isCenter
          ? t("Central catering")
          : t("Non-central catering");
      },
    },
    {
      key: "enabled",
      header: t("Status"),
      width: "15%",
      renderCell: (value) => {
        return value ? t("In operation") : t("Stopped");
      },
    },
    {
      key: "inventory-check-date",
      header: t("Inventory check date"),
      width: "10%",
      renderCell: (_, row) => {
        if (row.others?.lastInventoryDate) {
          return row.others.lastInventoryDate.toLocaleDateString();
        }
        return "N/A";
      },
    },
    {
      key: "suppliers",
      header: t("Suppliers"),
      width: "10%",
      textAlign: "right",
      renderCell: (_, row: Department) => {
        const suppliers = findSuppliersByCateringId(row.id);
        return (
          <IconBadge
            total={suppliers.length}
            navigateUrl={`/catering-management/supplier/${row.id}`}
          />
        );
      },
    },
  ];
};

function findSuppliersByCateringId(cateringId: string) {
  const { materials } = useMaterialStore.getState();
  const suppliers: string[] = [];
  for (const material of materials.values()) {
    if (
      material.others.prices &&
      material.others.prices[cateringId]
    ) {
      suppliers.push(material.others.prices[cateringId].supplierId);
    }
  }
  return unique(suppliers);
}

export type FilterType = {
  onSaleOnly: boolean;
};

export const defaultCondition: FilterType = {
  onSaleOnly: false,
};

export function filter(c: Department, x?: FilterType) {
  if (!x) {
    return true;
  }
  if (x.onSaleOnly && !c.enabled) {
    return false;
  }
  return true;
}

export type CateringRequest = {
  id: string;
  name: string;
  code: string;
  enabled: boolean;
  level: number;
  phone: string;
  email: string;
  shortName: string;
  address: string;
  others: {
    role: ClientRoles;
    isCenter: boolean;
    totalSupplier: number;
  };
};

export const initialValues: CateringRequest = {
  id: "",
  name: "",
  code: "",
  enabled: true,
  level: 1,
  phone: "",
  email: "",
  shortName: "",
  address: "",
  others: {
    role: ClientRoles.CATERING,
    isCenter: false,
    totalSupplier: 0,
  },
};

export function _validate(t: (s: string) => string) {
  return {
    name: isNotEmpty(t("Field is required")),
    phone: (value: unknown) => {
      if (value) {
        if (typeof value !== "string") {
          return t("Invalid phone number");
        }
        if (value && !isVietnamesePhoneNumber(value)) {
          return t("Invalid phone number");
        }
      }
    },
    email: (value: unknown) => {
      if (value) {
        try {
          emailSchema.parse(value);
        } catch (error) {
          return t("Invalid email");
        }
      }
    },
  };
}
