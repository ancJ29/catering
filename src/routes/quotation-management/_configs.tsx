import NumberInput from "@/components/common/NumberInput";
import { Material, Supplier } from "@/services/domain";
import { DataGridColumnProps } from "@/types";
import { numberWithDelimiter } from "@/utils";
import { TextInput } from "@mantine/core";

export const configs = (
  t: (key: string) => string,
  cateringId: string | undefined,
  suppliers: Map<string, Supplier>,
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
      textAlign: "center",
      header: t("Unit"),
      renderCell: (_, row) => {
        return row.others?.unit?.name || "N/A";
      },
    },
    {
      key: "sup",
      header: t("Sup"),
      width: "10%",
      defaultVisible: true,
      renderCell: (_, row: Material) => {
        const supplierId =
          row.others?.prices?.[cateringId || ""]?.supplierId || "";
        return suppliers.get(supplierId)?.name || "-";
      },
    },
    {
      key: "price",
      header: t("Price"),
      width: "5%",
      textAlign: "right",
      renderCell: (_, row: Material) => {
        return numberWithDelimiter(
          row.others?.prices?.[cateringId || ""]?.price || 0,
        );
      },
    },
    {
      key: "newPrice",
      header: t("New price"),
      width: "10%",
      textAlign: "center",
      headerStyle: {
        paddingLeft: "20px",
      },
      renderCell: () => {
        return (
          <NumberInput
            isPositive={true}
            defaultValue={0}
            onChange={() => null}
            allowDecimal={false}
            isInteger={true}
            ml={20}
          />
        );
      },
    },
    {
      key: "adminNote",
      header: t("Admin note"),
      width: "15%",
      textAlign: "center",
      renderCell: () => {
        return (
          <TextInput
            defaultValue=""
            onChange={() => null}
            placeholder={t("Maximum 500 characters")}
          />
        );
      },
    },
    {
      key: "supplierNote",
      header: t("Supplier note"),
      width: "15%",
      textAlign: "center",
      renderCell: () => {
        return (
          <TextInput
            defaultValue=""
            onChange={() => null}
            placeholder={t("Maximum 500 characters")}
          />
        );
      },
    },
    {
      key: "status",
      header: t("Status"),
      width: "10%",
      textAlign: "center",
      renderCell: () => {
        return <></>;
      },
    },
  ];
};

export type FilterType = {
  supplierId: string;
  type: string;
  group: string;
  status: string;
};

export const defaultCondition: FilterType = {
  supplierId: "",
  type: "",
  group: "",
  status: "",
};

export function filter(
  m: Material,
  condition: FilterType | undefined,
  cateringId: string | undefined,
) {
  const supplierId =
    m.others?.prices?.[cateringId || ""]?.supplierId || "";
  if (condition?.group && m.others.group !== condition.group) {
    return false;
  }
  if (condition?.type && m.others.type !== condition.type) {
    return false;
  }
  if (condition?.supplierId && supplierId !== condition.supplierId) {
    return false;
  }
  return true;
}
