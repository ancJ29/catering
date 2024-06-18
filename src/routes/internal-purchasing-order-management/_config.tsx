import PurchaseOrderStatus from "@/components/c-catering/PurchaseOrderStatus";
import { PurchaseOrder } from "@/services/domain/purchase-order";
import { DataGridColumnProps } from "@/types";
import { formatTime } from "@/utils";
import { Department } from "../catering-management/_configs";
import AddressPopover from "./components/AddressPopover";

export const configs = (
  t: (key: string) => string,
  caterings: Map<string, Department>,
): DataGridColumnProps[] => {
  return [
    {
      key: "ioCode",
      header: t("Purchase order io code"),
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
      key: "receivingKitchen",
      header: t("Purchase order receiving kitchen"),
      width: "17%",
      renderCell: (_, row: PurchaseOrder) => {
        return (
          <span>
            {caterings.get(row.others.cateringId || "")?.name}
          </span>
        );
      },
    },
    {
      key: "dispatchKitchen",
      header: t("Purchase order dispatch kitchen"),
      width: "17%",
      renderCell: (_, row: PurchaseOrder) => {
        return (
          <span>{caterings.get(row.departmentId || "")?.name}</span>
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
          <AddressPopover purchaseOrder={row} caterings={caterings} />
        );
      },
    },
  ];
};
