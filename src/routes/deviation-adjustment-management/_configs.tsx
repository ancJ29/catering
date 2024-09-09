import AddressPopover from "@/components/c-catering/AddressPopover";
import {
  Department,
  PurchaseOrder,
  Supplier,
} from "@/services/domain";
import { DataGridColumnProps } from "@/types";
import { endOfWeek, formatTime, startOfWeek } from "@/utils";
import Status from "../purchase-order-management/components/Status";

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
      defaultVisible: true,
      renderCell: (_, row: PurchaseOrder) => {
        return row.code || "N/A";
      },
    },
    {
      key: "prCode",
      header: t("Purchase order id"),
      width: "12%",
      style: { fontWeight: "bold" },
      defaultVisible: true,
      renderCell: (_, row: PurchaseOrder) => {
        return row.others.prCode || "N/A";
      },
    },
    {
      key: "kitchen",
      header: t("Purchase order catering"),
      width: "17%",
      defaultVisible: true,
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

export type FilterType = {
  id: string;
  from: number;
  to: number;
  statuses: string[];
  supplierIds: string[];
  receivingCateringIds: string[];
};

export const defaultCondition: FilterType = {
  id: "",
  from: startOfWeek(Date.now()),
  to: endOfWeek(Date.now()),
  statuses: [],
  supplierIds: [],
  receivingCateringIds: [],
};

export function filter(po: PurchaseOrder, condition?: FilterType) {
  if (
    condition?.statuses &&
    condition.statuses.length > 0 &&
    !condition.statuses.includes(po.others.status)
  ) {
    return false;
  }
  if (
    condition?.supplierIds &&
    condition.supplierIds.length > 0 &&
    po.supplierId &&
    !condition.supplierIds.includes(po.supplierId)
  ) {
    return false;
  }
  if (
    condition?.receivingCateringIds &&
    condition.receivingCateringIds.length > 0 &&
    po.others.receivingCateringId &&
    !condition.receivingCateringIds.includes(
      po.others.receivingCateringId,
    )
  ) {
    return false;
  }
  if (condition?.from && po.deliveryDate.getTime() < condition.from) {
    return false;
  }
  if (condition?.to && po.deliveryDate.getTime() > condition.to) {
    return false;
  }
  return true;
}
