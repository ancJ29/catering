import AddressPopover from "@/components/c-catering/AddressPopover";
import { Supplier } from "@/services/domain";
import { PurchaseOrder } from "@/services/domain/purchase-order";
import { DataGridColumnProps } from "@/types";
import { formatTime } from "@/utils";
import { Department } from "../catering-management/_configs";
import PurchaseOrderStatus from "./components/PurchaseOrderStatus";

export const configs = (
  t: (key: string) => string,
  caterings: Map<string, Department>,
  suppliers: Map<string, Supplier>,
): DataGridColumnProps[] => {
  return [
    {
      key: "poCode",
      header: t("Purchase order po code"),
      width: "12%",
      style: { fontWeight: "bold" },
      renderCell: (_, row: PurchaseOrder) => {
        return row.code || "N/A";
      },
    },
    {
      key: "prCode",
      header: t("Purchase order id"),
      width: "12%",
      style: { fontWeight: "bold" },
      renderCell: (_, row: PurchaseOrder) => {
        return row.others.prCode || "N/A";
      },
    },
    {
      key: "kitchen",
      header: t("Purchase order catering"),
      width: "17%",
      renderCell: (_, row: PurchaseOrder) => {
        return (
          <span>
            {
              caterings.get(row.others.receivingCateringId || "")
                ?.name
            }
          </span>
        );
      },
    },
    {
      key: "supplier",
      header: t("Purchase order supplier"),
      width: "17%",
      renderCell: (_, row: PurchaseOrder) => {
        return (
          <span>{suppliers.get(row.supplierId || "")?.name}</span>
        );
      },
    },
    {
      key: "deliveryDate",
      header: t("Purchase order date"),
      width: "12%",
      renderCell: (_, row: PurchaseOrder) => {
        return formatTime(row.deliveryDate);
      },
    },
    {
      key: "status",
      header: t("Status"),
      width: "25%",
      textAlign: "center",
      renderCell: (_, row: PurchaseOrder) => {
        if (!row.others.status) {
          return "N/A";
        }
        return <PurchaseOrderStatus status={row.others.status} />;
      },
    },
    {
      key: "address",
      header: t("Purchase order address"),
      width: "5%",
      textAlign: "center",
      cellStyle: {
        display: "flex",
        justifyContent: "center",
      },
      renderCell: (_, row: PurchaseOrder) => {
        return (
          <AddressPopover
            value={
              caterings.get(row.others.receivingCateringId)?.address
            }
          />
        );
      },
    },
  ];
};
