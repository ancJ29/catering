import AddressPopover from "@/components/c-catering/AddressPopover";
import { PurchaseInternal } from "@/services/domain";
import { DataGridColumnProps } from "@/types";
import { endOfWeek, formatTime, startOfWeek } from "@/utils";
import Status from "./components/Status";

export const configs = (
  t: (key: string) => string,
  caterings: Map<string, Department>,
): DataGridColumnProps[] => {
  return [
    {
      key: "ioCode",
      header: t("Purchase internal io code"),
      width: "12%",
      style: { fontWeight: "bold" },
      renderCell: (_, row: PurchaseInternal) => {
        return row.code || "N/A";
      },
    },
    {
      key: "prCode",
      header: t("Purchase internal pr code"),
      width: "12%",
      style: { fontWeight: "bold" },
      renderCell: (_, row: PurchaseInternal) => {
        return row.others.prCode || "N/A";
      },
    },
    {
      key: "receivingKitchen",
      header: t("Purchase internal receiving catering"),
      width: "17%",
      renderCell: (_, row: PurchaseInternal) => {
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
      key: "deliveryKitchen",
      header: t("Purchase internal delivery catering"),
      width: "17%",
      renderCell: (_, row: PurchaseInternal) => {
        return (
          <span>
            {caterings.get(row.deliveryCateringId || "")?.name}
          </span>
        );
      },
    },
    {
      key: "deliveryDate",
      header: t("Purchase internal date"),
      width: "12%",
      renderCell: (_, row: PurchaseInternal) => {
        return formatTime(row.deliveryDate);
      },
    },
    {
      key: "status",
      header: t("Status"),
      width: "25%",
      textAlign: "center",
      renderCell: (_, row: PurchaseInternal) => {
        if (!row.others.status) {
          return "N/A";
        }
        return <Status status={row.others.status} />;
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
      renderCell: (_, row: PurchaseInternal) => {
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

export type FilterType = {
  id: string;
  from: number;
  to: number;
  statuses: string[];
  receivingCateringIds: string[];
  deliveryCateringIds: string[];
};

export const defaultCondition: FilterType = {
  id: "",
  from: startOfWeek(Date.now()),
  to: endOfWeek(Date.now()),
  statuses: [],
  receivingCateringIds: [],
  deliveryCateringIds: [],
};

export function filter(pi: PurchaseInternal, condition?: FilterType) {
  if (
    condition?.statuses &&
    condition.statuses.length > 0 &&
    !condition.statuses.includes(pi.others.status)
  ) {
    return false;
  }
  if (
    condition?.receivingCateringIds &&
    condition.receivingCateringIds.length > 0 &&
    pi.others.receivingCateringId &&
    !condition.receivingCateringIds.includes(
      pi.others.receivingCateringId,
    )
  ) {
    return false;
  }
  if (
    condition?.deliveryCateringIds &&
    condition.deliveryCateringIds.length > 0 &&
    pi.deliveryCateringId &&
    !condition.deliveryCateringIds.includes(pi.deliveryCateringId)
  ) {
    return false;
  }
  if (condition?.from && pi.deliveryDate.getTime() < condition.from) {
    return false;
  }
  if (condition?.to && pi.deliveryDate.getTime() > condition.to) {
    return false;
  }
  return true;
}
