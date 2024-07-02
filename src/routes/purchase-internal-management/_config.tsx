import AddressPopover from "@/components/c-catering/AddressPopover";
import { PurchaseInternal } from "@/services/domain";
import { DataGridColumnProps } from "@/types";
import { formatTime } from "@/utils";
import { Department } from "../catering-management/_configs";
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
