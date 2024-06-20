import { PurchaseCoordination } from "@/services/domain";
import { DataGridColumnProps } from "@/types";
import { formatTime } from "@/utils";
import { Department } from "../catering-management/_configs";
import Priority from "../purchase-request-management/components/Priority";
import { User } from "../user-management/_configs";
import MemoPopover from "./components/MemoPopover";
import PurchaseCoordinationStatus from "./components/PurchaseCoordinationStatus";

export const configs = (
  t: (key: string) => string,
  caterings: Map<string, Department>,
  users: Map<string, User>,
): DataGridColumnProps[] => {
  return [
    {
      key: "prCode",
      header: t("Purchase coordination pr code"),
      width: "11%",
      style: { fontWeight: "bold" },
      renderCell: (_, row: PurchaseCoordination) => {
        return row.others.prCode || "N/A";
      },
    },
    {
      key: "dispatchCode",
      header: t("Purchase coordination code"),
      width: "12%",
      style: { fontWeight: "bold" },
      renderCell: (_, row: PurchaseCoordination) => {
        return row.code || "N/A";
      },
    },
    {
      key: "kitchen",
      header: t("Purchase coordination catering"),
      width: "15%",
      renderCell: (_, row: PurchaseCoordination) => {
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
      key: "type",
      header: t("Purchase coordination type"),
      width: "10%",
      renderCell: (_, row: PurchaseCoordination) => {
        if (!row.others.type) {
          return "N/A";
        }
        const type = t(`purchaseRequest.type.${row.others.type}`);
        return <span>{type}</span>;
      },
    },
    {
      key: "deliveryDate",
      header: t("Purchase coordination date"),
      width: "12%",
      renderCell: (_, row: PurchaseCoordination) => {
        return formatTime(row.deliveryDate);
      },
    },
    {
      key: "priority",
      header: t("Purchase coordination priority"),
      width: "10%",
      textAlign: "center",
      renderCell: (_, row: PurchaseCoordination) => {
        if (!row.others.priority) {
          return "N/A";
        }
        return <Priority priority={row.others.priority} />;
      },
    },
    {
      key: "status",
      header: t("Status"),
      width: "25%",
      textAlign: "center",
      renderCell: (_, row: PurchaseCoordination) => {
        if (!row.others.status) {
          return "N/A";
        }
        return (
          <PurchaseCoordinationStatus status={row.others.status} />
        );
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
      renderCell: (_, row: PurchaseCoordination) => {
        return (
          <MemoPopover purchaseCoordination={row} users={users} />
        );
      },
    },
  ];
};
