import PurchaseRequestStatus from "@/components/c-catering/PurchaseRequestSteppers/PurchaseRequestStatus";
import { PurchaseCoordination } from "@/services/domain";
import { DataGridColumnProps } from "@/types";
import { formatTime } from "@/utils";
import { Department } from "../catering-management/_configs";
import Priority from "../purchase-request-management/components/Priority";
import { User } from "../user-management/_configs";
import MemoPopover from "./components/MemoPopover";
import PurchaseCoordinationStatus from "./components/Status";

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
      key: "kitchen",
      header: t("Purchase coordination catering"),
      width: "10%",
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
      key: "purchaseStatus",
      header: t("Purchase status"),
      width: "15%",
      textAlign: "center",
      renderCell: (_, row: PurchaseCoordination) => {
        if (!row.others.status) {
          return "N/A";
        }
        return (
          <PurchaseRequestStatus
            status={row.others.purchaseRequestStatus}
          />
        );
      },
    },
    {
      key: "priority",
      header: t("Purchase coordination priority"),
      width: "9%",
      textAlign: "center",
      renderCell: (_, row: PurchaseCoordination) => {
        if (!row.others.priority) {
          return "N/A";
        }
        return <Priority priority={row.others.priority} />;
      },
    },
    {
      key: "type",
      header: t("Purchase coordination type"),
      width: "9%",
      renderCell: (_, row: PurchaseCoordination) => {
        if (!row.others.type) {
          return "N/A";
        }
        const type = t(`purchaseRequest.type.${row.others.type}`);
        return <span>{type}</span>;
      },
    },
    {
      key: "dispatchCode",
      header: t("Purchase coordination code"),
      width: "11%",
      style: { fontWeight: "bold" },
      renderCell: (_, row: PurchaseCoordination) => {
        return row.code || "N/A";
      },
    },
    {
      key: "coordinationStatus",
      header: t("Coordination status"),
      width: "20%",
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
      key: "deliveryDate",
      header: t("Purchase coordination date"),
      width: "12%",
      renderCell: (_, row: PurchaseCoordination) => {
        return formatTime(row.deliveryDate);
      },
    },
    {
      key: "memo",
      header: t("Memo"),
      width: "3%",
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
