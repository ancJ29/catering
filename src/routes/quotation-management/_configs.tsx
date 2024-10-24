import { smStatusSchema } from "@/auto-generated/api-configs";
import { Material, Supplier } from "@/services/domain";
import { DataGridColumnProps } from "@/types";
import { numberWithDelimiter } from "@/utils";
import {
  ActionIcon,
  Flex,
  NumberInput,
  TextInput,
} from "@mantine/core";
import { IconCheck } from "@tabler/icons-react";
import Status from "./components/Status";

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
      key: "appliedPrice",
      header: t("Applied price"),
      width: "10%",
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
      width: "13%",
      textAlign: "center",
      headerStyle: {
        padding: "0 20px",
      },
      renderCell: (_, row: Material) => {
        const supplierId =
          row.others?.prices?.[cateringId || ""]?.supplierId || "";
        const supplierMaterial = row.supplierMaterials.find(
          (m) => m.supplier.id === supplierId,
        );
        return (
          <Flex gap={5} align="center" mx="20">
            <NumberInput
              value={supplierMaterial?.newPrice || 0}
              onChange={() => null}
              allowNegative={false}
              thousandSeparator="."
              decimalSeparator=","
            />
            {supplierMaterial?.others.status ===
              smStatusSchema.Values.TL && (
              <ActionIcon variant="transparent">
                <IconCheck size={24} stroke={1.5} />
              </ActionIcon>
            )}
          </Flex>
        );
      },
    },
    {
      key: "adminNote",
      header: t("Admin note"),
      width: "10%",
      textAlign: "center",
      renderCell: () => {
        return (
          <TextInput
            value=""
            onChange={() => null}
            placeholder={t("Maximum 500 characters")}
          />
        );
      },
    },
    {
      key: "supplierNote",
      header: t("Supplier note"),
      width: "10%",
      textAlign: "center",
      renderCell: () => {
        return (
          <TextInput
            value=""
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
      renderCell: (_, row: Material) => {
        const supplierId =
          row.others?.prices?.[cateringId || ""]?.supplierId || "";
        const supplierMaterial = row.supplierMaterials.find(
          (m) => m.supplier.id === supplierId,
        );
        if (!supplierMaterial?.others.status) {
          return "";
        }
        return <Status status={supplierMaterial.others.status} />;
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
  const status =
    m.supplierMaterials.find((m) => m.supplier.id === supplierId)
      ?.others.status || "";

  if (condition?.group && m.others.group !== condition.group) {
    return false;
  }
  if (condition?.type && m.others.type !== condition.type) {
    return false;
  }
  if (condition?.supplierId && supplierId !== condition.supplierId) {
    return false;
  }
  if (condition?.status && status !== condition.status) {
    return false;
  }
  return true;
}
