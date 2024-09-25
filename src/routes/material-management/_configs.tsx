import IconBadge from "@/components/c-catering/IconBadge";
import { Material } from "@/services/domain";
import { DataGridColumnProps } from "@/types";
import { isNotEmpty } from "@mantine/form";

export const configs = (
  t: (key: string) => string,
): DataGridColumnProps[] => {
  return [
    {
      key: "name",
      sortable: true,
      header: t("Material name"),
      width: "20%",
      defaultVisible: true,
    },
    {
      key: "code",
      sortable: true,
      header: t("Material code"),
      width: "5%",
      defaultVisible: true,
      renderCell: (_, row: Material) => {
        return row.others.internalCode || "N/A";
      },
    },
    {
      key: "type",
      header: t("Material type"),
      width: "15%",
      textAlign: "center",
      renderCell: (_, row) => {
        if (!row.others.type) {
          return "N/A";
        }
        const code = row.others.type;
        const type = t(`materials.type.${code}`);
        return <span>{`${type} (${code})`}</span>;
      },
    },
    {
      key: "group",
      header: t("Material group"),
      width: "10%",
      textAlign: "center",
      renderCell: (_, row) => {
        if (!row.others.group) {
          return "N/A";
        }
        const code = row.others.group;
        const group = t(`materials.group.${code}`);
        return <span>{`${group} (${code})`}</span>;
      },
    },
    {
      key: "unit",
      width: "10%",
      textAlign: "right",
      header: t("Unit"),
      renderCell: (_, row) => {
        return row.others?.unit?.name || "N/A";
      },
    },
    {
      key: "suppliers",
      header: t("Total suppliers"),
      width: "10%",
      textAlign: "right",
      renderCell: (_, row: Material) => {
        return (
          <IconBadge
            total={row.supplierMaterials?.length || 0}
            navigateUrl={`/material-management/supplier/${row.id}`}
          />
        );
      },
    },
  ];
};

export type PushMaterialRequest = {
  id: string;
  name: string;
  sku: string;
  others: {
    oldId: number;
    internalCode: string;
    type: string;
    group: string | null;
    orderCycle: string;
    unit: string;
  };
};

export const initialValues: PushMaterialRequest = {
  id: "",
  name: "",
  sku: "",
  others: {
    oldId: 0,
    internalCode: "",
    type: "",
    group: null,
    orderCycle: "",
    unit: "",
  },
};

export function _validate(t: (s: string) => string) {
  return {
    "name": isNotEmpty(t("Field is required")),
    "others.type": isNotEmpty(t("Field is required")),
    "others.group": isNotEmpty(t("Field is required")),
    "others.orderCycle": isNotEmpty(t("Field is required")),
    "others.unit": isNotEmpty(t("Field is required")),
  };
}
