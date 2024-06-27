import PurchaseRequestStatus from "@/components/c-catering/PurchaseRequestSteppers/PurchaseRequestStatus";
import { Department, PurchaseRequest } from "@/services/domain";
import { DataGridColumnProps } from "@/types";
import { formatTime } from "@/utils";
import Priority from "./components/Priority";

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
      renderCell: (_, row: PurchaseRequest) => {
        return row.code || "N/A";
      },
    },
    {
      key: "kitchen",
      header: t("Purchase request kitchen"),
      width: "25%",
      renderCell: (_, row: PurchaseRequest) => {
        return (
          <span>{caterings.get(row.departmentId || "")?.name}</span>
        );
      },
    },
    {
      key: "type",
      header: t("Purchase request type"),
      width: "15%",
      renderCell: (_, row: PurchaseRequest) => {
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
      width: "15%",
      renderCell: (_, row: PurchaseRequest) => {
        return formatTime(row.deliveryDate);
      },
    },
    {
      key: "priority",
      header: t("Purchase request priority"),
      width: "15%",
      textAlign: "center",
      renderCell: (_, row: PurchaseRequest) => {
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
      renderCell: (_, row: PurchaseRequest) => {
        if (!row.others.status) {
          return "N/A";
        }
        return <PurchaseRequestStatus status={row.others.status} />;
      },
    },
  ];
};
