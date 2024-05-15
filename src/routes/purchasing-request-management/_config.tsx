import { Department, PurchaseRequest } from "@/services/domain";
import { DataGridColumnProps } from "@/types";
import { formatTime } from "@/utils";
import { ActionIcon } from "@mantine/core";
import { IconNotes } from "@tabler/icons-react";
import Priority from "./components/Priority";
import Status from "./components/Status";

export const configs = (
  t: (key: string) => string,
  caterings: Map<string, Department>,
  onOpenNote: (id: string) => void,
): DataGridColumnProps[] => {
  return [
    {
      key: "id",
      sortable: true,
      header: t("Purchase order id"),
      width: "18%",
      style: { fontWeight: "bold" },
      renderCell: (_, row: PurchaseRequest) => {
        return row.code || "N/A";
      },
    },
    {
      key: "kitchen",
      header: t("Purchase order kitchen"),
      width: "22%",
      renderCell: (_, row: PurchaseRequest) => {
        return (
          <span>{caterings.get(row.departmentId || "")?.name}</span>
        );
      },
    },
    {
      key: "type",
      header: t("Purchase order type"),
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
      header: t("Purchase order date"),
      width: "15%",
      renderCell: (_, row: PurchaseRequest) => {
        return formatTime(row.deliveryDate, "DD/MM/YYYY");
      },
    },
    {
      key: "priority",
      header: t("Purchase order priority"),
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
      width: "20%",
      textAlign: "center",
      renderCell: (_, row: PurchaseRequest) => {
        if (!row.others.status) {
          return "N/A";
        }
        return <Status status={row.others.status} />;
      },
    },
    {
      key: "note",
      header: t("Purchase order note"),
      width: "8%",
      textAlign: "center",
      renderCell: (_, row: PurchaseRequest) => {
        return (
          <ActionIcon
            variant="transparent"
            onClick={() => onOpenNote(row.id)}
          >
            <IconNotes size={18} stroke={1.5} />
          </ActionIcon>
        );
      },
    },
  ];
};
