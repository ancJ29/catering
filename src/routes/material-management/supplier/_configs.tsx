import NumberInput from "@/components/common/NumberInput";
import Switch from "@/components/common/Switch";
import { Material } from "@/services/domain";
import { DataGridColumnProps } from "@/types";
import { Button, Flex } from "@mantine/core";

export type SupplierMaterial = {
  price: number;
  supplier: {
    id: string;
    name: string;
    others: {
      active: boolean;
    };
  };
};

export const configs = (
  t: (key: string) => string,
  material: Material,
  prices: Map<string, number>,
  setPrice: (supplierId: string, price: number) => void,
  removeSupplier: (supplierId: string) => void,
  actives: Map<string, boolean>,
  setActive: (supplierId: string, active: boolean) => void,
): DataGridColumnProps[] => {
  return [
    {
      key: "name",
      header: t("Supplier name"),
      width: "25%",
      textAlign: "left",
      defaultVisible: true,
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
        return (
          <NumberInput
            defaultValue={sm.price || prices.get(sm.supplier.id) || 0}
            suffix=" đ"
            step={1000}
            onChange={(price) => setPrice(sm.supplier.id, price)}
          />
        );
      },
    },
    {
      key: "active",
      header: t("Status"),
      width: "20%",
      textAlign: "center",
      renderCell: (_, sm: SupplierMaterial) => {
        const checked =
          actives.get(sm.supplier.id) !== undefined
            ? actives.get(sm.supplier.id)
            : sm.supplier.others.active;
        return (
          <Flex justify="center">
            <Switch
              defaultChecked={checked || false}
              onChangeValue={(value) =>
                setActive(sm.supplier.id, value)
              }
            />
          </Flex>
        );
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
