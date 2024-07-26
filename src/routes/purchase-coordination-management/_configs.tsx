import PurchaseRequestStatus from "@/components/c-catering/PurchaseRequestSteppers/PurchaseRequestStatus";
import { PurchaseCoordination } from "@/services/domain";
import { DataGridColumnProps } from "@/types";
import { endOfWeek, formatTime, startOfWeek } from "@/utils";
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

export type FilterType = {
  id: string;
  from: number;
  to: number;
  types: string[];
  priorities: string[];
  statuses: string[];
  receivingCateringIds: string[];
};

export const defaultCondition: FilterType = {
  id: "",
  from: startOfWeek(Date.now()),
  to: endOfWeek(Date.now()),
  types: [],
  priorities: [],
  statuses: [],
  receivingCateringIds: [],
};

export function filter(
  pc: PurchaseCoordination,
  condition?: FilterType,
) {
  if (
    condition?.types &&
    condition.types.length > 0 &&
    !condition.types.includes(pc.others.type)
  ) {
    return false;
  }
  if (
    condition?.priorities &&
    condition.priorities.length > 0 &&
    !condition.priorities.includes(pc.others.priority)
  ) {
    return false;
  }
  if (
    condition?.statuses &&
    condition.statuses.length > 0 &&
    !condition.statuses.includes(pc.others.status)
  ) {
    return false;
  }
  if (
    condition?.receivingCateringIds &&
    condition.receivingCateringIds.length > 0 &&
    pc.others.receivingCateringId &&
    !condition.receivingCateringIds.includes(
      pc.others.receivingCateringId,
    )
  ) {
    return false;
  }
  if (condition?.from && pc.deliveryDate.getTime() < condition.from) {
    return false;
  }
  if (condition?.to && pc.deliveryDate.getTime() > condition.to) {
    return false;
  }
  return true;
}
