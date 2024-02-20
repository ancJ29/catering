import IconBadge from "@/components/common/IconBadge";
import { Supplier } from "@/services/domain";
import { DataGridColumnProps } from "@/types";

export const configs = (
  t: (key: string) => string,
): DataGridColumnProps[] => {
  return [
    {
      key: "name",
      header: t("Supplier name"),
      width: "20%",
    },
    {
      key: "code",
      header: t("Supplier code"),
      width: "10%",
    },
    {
      key: "pic",
      header: t("Supplier PIC"),
      width: "10%",
      renderCell: (_, row) => {
        return `${row.others?.contact || "-"}`;
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
  ];
};
