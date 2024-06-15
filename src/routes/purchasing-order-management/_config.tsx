import { PurchaseOrder } from "@/services/domain/purchase-order";
import { DataGridColumnProps } from "@/types";
import { formatTime } from "@/utils";
import { Text } from "@mantine/core";
import { Department } from "../catering-management/_configs";
import Priority from "../purchasing-request-management/components/Priority";
import { User } from "../user-management/_configs";
import Status from "./components/Status";

export const configs = (
  t: (key: string) => string,
  caterings: Map<string, Department>,
  users: Map<string, User>,
): DataGridColumnProps[] => {
  return [
    {
      key: "id",
      header: t("Purchase request id"),
      width: "10%",
      style: { fontWeight: "bold" },
      renderCell: (_, row: PurchaseOrder) => {
        return row.code || "N/A";
      },
    },
    {
      key: "kitchen",
      header: t("Purchase request kitchen"),
      width: "15%",
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
      header: t("Purchase request type"),
      width: "8%",
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
      width: "8%",
      renderCell: (_, row: PurchaseOrder) => {
        return formatTime(row.deliveryDate, "DD/MM/YYYY");
      },
    },
    {
      key: "priority",
      header: t("Purchase request priority"),
      width: "8%",
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
    {
      key: "created",
      header: t("Purchase order create - date"),
      width: "10%",
      renderCell: (_, row: PurchaseOrder) => {
        if (!users.get(row.others.createdById)) {
          return "N/A";
        }
        return (
          <div>
            <Text fz={12}>
              {users.get(row.others.createdById)?.fullName}
            </Text>
            <Text fz={12}>
              {formatTime(row.others.createAt, "DD/MM/YYYY HH:mm")}
            </Text>
          </div>
        );
      },
    },
    {
      key: "approved",
      header: t("Purchase order approve - date"),
      width: "10%",
      renderCell: (_, row: PurchaseOrder) => {
        if (!users.get(row.others.approvedById)) {
          return "N/A";
        }
        return (
          <div>
            <Text fz={12}>
              {users.get(row.others.approvedById)?.fullName}
            </Text>
            <Text fz={12}>
              {formatTime(row.others.approvedAt, "DD/MM/YYYY HH:mm")}
            </Text>
          </div>
        );
      },
    },
  ];
};
