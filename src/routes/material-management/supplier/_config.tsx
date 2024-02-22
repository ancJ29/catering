import { Material } from "@/services/domain";
import { DataGridColumnProps } from "@/types";
import { positivePrice } from "@/utils";
import { Button, NumberInput } from "@mantine/core";
import { useState } from "react";

export type SupplierMaterial = {
  price: number;
  supplier: {
    id: string;
    name: string;
  };
};

export const configs = (
  t: (key: string) => string,
  material: Material,
  prices: Map<string, number>,
  setPrice: (supplierId: string, price: number) => void,
  removeSupplier: (supplierId: string) => void,
): DataGridColumnProps[] => {
  return [
    {
      key: "name",
      header: t("Supplier name"),
      width: "25%",
      textAlign: "left",
      renderCell(_, sm: SupplierMaterial) {
        return <span>{sm.supplier.name}</span>;
      },
    },
    {
      key: "unit",
      header: t("Material unit"),
      width: "10%",
      renderCell() {
        return material.others.unit?.name || "N/A";
      },
    },
    {
      key: "pouUnit",
      header: t("Material PO unit"),
      width: "10%",
      renderCell() {
        if (!material?.others.unit?.units?.length) {
          return "N/A";
        }
        return material.others.unit.units[0];
      },
    },
    {
      key: "price",
      sortable: true,
      sorting: "asc",
      header: t("Material price"),
      width: "20%",
      textAlign: "left",
      sortValue: (sm: SupplierMaterial) => {
        return (
          sm.price ||
          prices.get(sm.supplier.id) ||
          0
        ).toString();
      },
      renderCell(_, sm: SupplierMaterial) {
        const Component = () => {
          const [price, setInternalPrice] = useState(
            sm.price || prices.get(sm.supplier.id) || 0,
          );
          return (
            <NumberInput
              value={price}
              thousandSeparator="."
              decimalSeparator=","
              suffix=" đ"
              step={1000}
              onChange={(value) => {
                const price = positivePrice(value);
                setInternalPrice(price);
                setPrice(sm.supplier.id, price);
              }}
            />
          );
        };
        return <Component />;
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
            onClick={() => removeSupplier(sm.supplier.id)}
          >
            {t("Remove")}
          </Button>
        );
      },
    },
  ];
};
