import { Material } from "@/services/domain";
import { DataGridColumnProps } from "@/types";
import { positivePrice } from "@/utils";
import { Button, NumberInput } from "@mantine/core";
import { useState } from "react";

export type SupplierMaterial = {
  price: number;
  material: {
    id: string;
    name: string;
  };
};

export type FilterType = {
  type: string;
  group: string;
};

export const defaultCondition: FilterType = {
  type: "",
  group: "",
};

export function filter(m: Material, condition?: FilterType) {
  if (condition?.group && m.others.group !== condition.group) {
    return false;
  }
  if (condition?.type && m.others.type !== condition.type) {
    return false;
  }
  return true;
}

export const configs = (
  t: (key: string) => string,
  materialById: Map<string, Material>,
  setPrice: (materialId: string, price: number) => void,
  removeMaterial: (materialId: string) => void,
): DataGridColumnProps[] => {
  return [
    {
      key: "name",
      header: t("Material name"),
      width: "35%",
      textAlign: "left",
      renderCell(_, sm: SupplierMaterial) {
        return <span>{sm.material.name}</span>;
      },
    },
    {
      key: "price",
      header: t("Material price"),
      width: "10%",
      textAlign: "left",
      renderCell(_, sm: SupplierMaterial) {
        const Component = () => {
          const [price, setInternalPrice] = useState(sm.price);
          return (
            <NumberInput
              suffix=" đ"
              step={1000}
              onChange={(value) => {
                const price = positivePrice(value);
                setInternalPrice(price);
                setPrice(sm.material.id, price);
              }}
              thousandSeparator="."
              decimalSeparator=","
              value={price}
            />
          );
        };
        return <Component />;
      },
    },
    {
      key: "unit",
      header: t("Material unit"),
      width: "10%",
      textAlign: "center",
      renderCell: (_, sm: SupplierMaterial) => {
        const material = materialById.get(sm.material.id);
        return material?.others?.unit?.name || "N/A";
      },
    },
    {
      key: "type",
      header: t("Material type"),
      width: "15%",
      textAlign: "center",
      renderCell: (_, sm: SupplierMaterial) => {
        const material = materialById.get(sm.material.id);
        if (!material?.others?.type) {
          return "N/A";
        }
        const code = material.others.type;
        const type = t(`materials.type.${code}`);
        return <span>{`${type} (${code})`}</span>;
      },
    },
    {
      key: "group",
      header: t("Material group"),
      width: "15%",
      textAlign: "center",
      renderCell: (_, sm: SupplierMaterial) => {
        const material = materialById.get(sm.material.id);
        if (!material?.others?.type) {
          return material?.name || "N/A";
        }
        const code = material.others.group;
        const group = t(`materials.group.${code}`);
        return <span>{`${group} (${code})`}</span>;
      },
    },
    {
      key: "remove",
      style: { flexGrow: 1 },
      textAlign: {
        cell: "right",
      },
      renderCell(_, sm: SupplierMaterial) {
        return (
          <Button
            mr={10}
            size="compact-xs"
            variant="light"
            color="error"
            onClick={removeMaterial.bind(null, sm.material.id)}
          >
            {t("Remove")}
          </Button>
        );
      },
    },
  ];
};
