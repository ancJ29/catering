import PurchaseOrderStatus from "@/components/c-catering/PurchaseOrderStatus";
import { PurchaseOrder } from "@/services/domain/purchase-order";
import { DataGridColumnProps } from "@/types";
import { formatTime } from "@/utils";
import { Department } from "../catering-management/_configs";
import Priority from "../purchasing-request-management/components/Priority";
import { User } from "../user-management/_configs";
import MemoPopover from "./components/MemoPopover";

export const configs = (
  t: (key: string) => string,
  caterings: Map<string, Department>,
  users: Map<string, User>,
): DataGridColumnProps[] => {
  return [
    {
      key: "prCode",
      header: t("Purchase order id"),
      width: "14%",
      style: { fontWeight: "bold" },
      renderCell: (_, row: PurchaseOrder) => {
        return row.others.prCode || "N/A";
      },
    },
    {
      key: "dispatchCode",
      header: t("Purchase order dispatch code"),
      width: "14%",
      style: { fontWeight: "bold" },
      renderCell: (_, row: PurchaseOrder) => {
        return row.others.dispatchCode || "N/A";
      },
    },
    {
      key: "kitchen",
      header: t("Purchase order kitchen"),
      width: "20%",
      renderCell: (_, row: PurchaseOrder) => {
        return (
          <span>
            {caterings.get(row.others.cateringId || "")?.name}
          </span>
        );
      },
    },
    {
      key: "type",
      header: t("Purchase order type"),
      width: "10%",
      renderCell: (_, row: PurchaseOrder) => {
        if (!row.others.type) {
          return "N/A";
        }
        const type = t(`purchaseRequest.type.${row.others.type}`);
        return <span>{type}</span>;
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
      key: "priority",
      header: t("Purchase order priority"),
      width: "10%",
      textAlign: "center",
      renderCell: (_, row: PurchaseOrder) => {
        if (!row.others.priority) {
          return "N/A";
        }
        return <Priority priority={row.others.priority} />;
      },
    },
    {
      key: "status",
      header: t("Status"),
      width: "15%",
      textAlign: "center",
      renderCell: (_, row: PurchaseOrder) => {
        if (!row.others.status) {
          return "N/A";
        }
        return <PurchaseOrderStatus status={row.others.status} />;
      },
    },
    {
      key: "memo",
      header: t("Memo"),
      width: "5%",
      textAlign: "center",
      cellStyle: {
        display: "flex",
        justifyContent: "center",
      },
      renderCell: (_, row: PurchaseOrder) => {
        return <MemoPopover purchaseOrder={row} users={users} />;
      },
    },
  ];
};
