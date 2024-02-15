import { Material } from "@/services/domain";
import logger from "@/services/logger";
import { DataGridColumnProps } from "@/types";
import { Button, NumberInput } from "@mantine/core";
import { useState } from "react";

export type SupplierMaterial = {
  price: number;
  material: {
    id: string;
    name: string;
  };
};

export const configs = (
  removeMaterial: (materialId: string) => void,
  t: (key: string) => string,
  materialById: Map<string, Material>,
  setPrice: (materialId: string, price: number) => void,
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
                const price = _price(value);
                setInternalPrice(price);
                setPrice(sm.material.id, _price(price));
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
        return material?.others?.purchasingUnit || "N/A";
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
      renderCell(_, sm: SupplierMaterial) {
        return (
          <Button
            mr={10}
            onClick={removeMaterial.bind(null, sm.material.id)}
          >
            {t("Remove")}
          </Button>
        );
      },
    },
  ];
};

function _price(value: string | number) {
  logger.info("value", value, typeof value);
  let price = parseInt(
    value.toString().replace(/\./g, "").replace(/,/g, "."),
  );
  if (isNaN(price) || price < 0) {
    price = 0;
  }
  return price;
}
