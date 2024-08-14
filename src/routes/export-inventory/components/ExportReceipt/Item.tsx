import useTranslation from "@/hooks/useTranslation";
import useMaterialStore from "@/stores/material.store";
import { TextAlign } from "@/types";
import { formatTime, roundToDecimals } from "@/utils";
import { Button, Table } from "@mantine/core";
import { ExportDetail } from "../../_configs";
import store from "../../_export.store";

type ItemProps = {
  index: number;
  exportDetail: ExportDetail;
};

const Item = ({ index, exportDetail }: ItemProps) => {
  const t = useTranslation();
  const { materials } = useMaterialStore();
  const material = materials.get(exportDetail.materialId);
  const columns = [
    {
      content: index + 1,
      align: "center",
    },
    {
      content: material?.name,
      align: "left",
    },
    {
      content: formatTime(
        store.getExpiryDate(exportDetail.materialId),
        "DD/MM/YYYY",
      ),
      align: "center",
    },
    {
      content: exportDetail.price.toLocaleString(),
      align: "right",
    },
    {
      content: store.getInventory(exportDetail.materialId),
      align: "right",
    },
    {
      content: exportDetail.amount,
      align: "right",
    },
    {
      content: roundToDecimals(
        exportDetail.price * exportDetail.amount,
        10,
      ),
      align: "right",
    },
    {
      content: (
        <Button
          size="compact-xs"
          variant="light"
          color="error"
          onClick={() =>
            store.removeExportDetail(exportDetail.materialId)
          }
        >
          {t("Remove")}
        </Button>
      ),
      align: "center",
    },
  ];

  return (
    <Table.Tr>
      {columns.map((col, index) => (
        <Table.Td key={index} ta={col.align as TextAlign}>
          {col.content}
        </Table.Td>
      ))}
    </Table.Tr>
  );
};

export default Item;
