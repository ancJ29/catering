import { Material, WarehouseReceiptDetail } from "@/services/domain";
import { DataGridColumnProps } from "@/types";
import { convertAmountBackward } from "@/utils";

export const configs = (
  t: (key: string) => string,
  materials: Map<string, Material>,
): DataGridColumnProps[] => {
  return [
    {
      key: "code",
      header: t("Material code"),
      width: "10%",
      renderCell: (_, row: WarehouseReceiptDetail) => {
        return materials.get(row.materialId)?.code || "N/A";
      },
    },
    {
      key: "name",
      header: t("Material name"),
      width: "15%",
      renderCell: (_, row: WarehouseReceiptDetail) => {
        return materials.get(row.materialId)?.name || "N/A";
      },
    },
    {
      key: "unit",
      header: t("Material unit"),
      width: "5%",
      renderCell: (_, row: WarehouseReceiptDetail) => {
        return (
          materials.get(row.materialId)?.others.unit?.name || "N/A"
        );
      },
    },
    {
      key: "amount",
      header: t("Quantity"),
      width: "10%",
      textAlign: "right",
      renderCell: (_, row: WarehouseReceiptDetail) => {
        return convertAmountBackward({
          material: materials.get(row.materialId),
          amount: row.amount,
        });
      },
    },
    {
      key: "price",
      header: t("Price"),
      width: "10%",
      textAlign: "right",
      renderCell: (_, row: WarehouseReceiptDetail) => {
        return (row.price || 0).toLocaleString();
      },
    },
    {
      key: "totalAmount",
      header: t("Total amount"),
      width: "10%",
      renderCell: (_, row: WarehouseReceiptDetail) => {
        return (
          convertAmountBackward({
            material: materials.get(row.materialId),
            amount: row.amount,
          }) * (row.price || 0)
        ).toLocaleString();
      },
    },
    {
      key: "memo",
      header: t("Memo"),
      width: "15%",
      textAlign: "left",
      renderCell: (_, row: WarehouseReceiptDetail) => {
        return <span>{row.others.memo}</span>;
      },
    },
  ];
};
