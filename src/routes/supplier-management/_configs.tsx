import { emailSchema } from "@/auto-generated/api-configs";
import IconBadge from "@/components/c-catering/IconBadge";
import { Supplier } from "@/services/domain";
import { DataGridColumnProps } from "@/types";
import { isVietnamesePhoneNumber } from "@/utils";
import { isNotEmpty } from "@mantine/form";

export const configs = (
  t: (key: string) => string,
): DataGridColumnProps[] => {
  return [
    {
      key: "name",
      header: t("Supplier name"),
      width: "15%",
      defaultVisible: true,
    },
    {
      key: "code",
      header: t("Supplier code"),
      width: "8%",
      defaultVisible: true,
    },
    {
      key: "taxCode",
      header: t("Supplier tax code"),
      width: "10%",
      renderCell: (_, row) => {
        return <>{row.others?.taxCode}</>;
      },
    },
    {
      key: "address",
      header: t("Supplier address"),
      width: "15%",
      renderCell: (_, row) => {
        return <>{row.others?.address}</>;
      },
    },
    {
      key: "contact",
      header: t("Supplier contact"),
      width: "15%",
      renderCell: (_, row) => {
        const email = row.others?.email || "Email: N/A";
        const phone = row.others?.phone || "Phone: N/A";
        return (
          <>
            {email}
            <br />
            {phone}
          </>
        );
      },
    },
    {
      key: "catering",
      header: t("Supplier total catering"),
      width: "10%",
      renderCell: (_, supplier: Supplier) => {
        return (
          <IconBadge
            total={supplier.others?.caterings?.length || 0}
            navigateUrl={`/supplier-management/catering/${supplier.id}`}
          />
        );
      },
    },
    {
      key: "material",
      header: t("Supplier material"),
      width: "10%",
      renderCell: (_, supplier: Supplier) => {
        return (
          <IconBadge
            total={supplier.supplierMaterials.length || 0}
            navigateUrl={`/supplier-management/material/${supplier.id}`}
          />
        );
      },
    },
    {
      key: "active",
      header: t("Status"),
      width: "10%",
      renderCell: (_, row) => {
        return row.others.active ? t("Active") : t("Disabled");
      },
    },
  ];
};

export type SupplierRequest = {
  id?: string;
  name: string;
  code: string;
  others: {
    active: boolean;
    taxCode: string;
    address: string;
    email: string;
    phone: string;
  };
};

export function _validate(t: (s: string) => string) {
  return {
    "name": isNotEmpty(t("Field is required")),
    "code": isNotEmpty(t("Field is required")),
    "others.phone": (value: unknown) => {
      if (value) {
        if (typeof value !== "string") {
          return t("Invalid phone number");
        }
        if (value && !isVietnamesePhoneNumber(value)) {
          return t("Invalid phone number");
        }
      }
    },
    "others.email": (value: unknown) => {
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
