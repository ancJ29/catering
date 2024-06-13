import { PurchaseOrder } from "@/services/domain/purchase-order";
import { DataGridColumnProps } from "@/types";
import { formatTime } from "@/utils";
import { Department } from "../catering-management/_configs";
import Priority from "../purchasing-request-management/components/Priority";
import Status from "./components/Status";

export const configs = (
  t: (key: string) => string,
  caterings: Map<string, Department>,
): DataGridColumnProps[] => {
  return [
    {
      key: "id",
      sortable: true,
      header: t("Purchase request id"),
      width: "15%",
      style: { fontWeight: "bold" },
      renderCell: (_, row: PurchaseOrder) => {
        return row.code || "N/A";
      },
    },
    {
      key: "kitchen",
      header: t("Purchase request kitchen"),
      width: "20%",
      renderCell: (_, row: PurchaseOrder) => {
        return (
          <span>
            {caterings.get(row.others.departmentId || "")?.name}
          </span>
        );
      },
    },
    {
      key: "type",
      header: t("Purchase request type"),
      width: "15%",
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
      header: t("Purchase request date"),
      width: "10%",
      renderCell: (_, row: PurchaseOrder) => {
        return formatTime(row.deliveryDate, "DD/MM/YYYY");
      },
    },
    {
      key: "priority",
      header: t("Purchase request priority"),
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
      width: "20%",
      textAlign: "center",
      renderCell: (_, row: PurchaseOrder) => {
        if (!row.others.status) {
          return "N/A";
        }
        return <Status status={row.others.status} />;
      },
    },
  ];
};
