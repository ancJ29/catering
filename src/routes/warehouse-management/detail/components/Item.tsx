import { WarehouseReceiptDetail } from "@/services/domain";
import useMaterialStore from "@/stores/material.store";
import { TextAlign } from "@/types";
import { convertAmountBackward, numberWithDelimiter } from "@/utils";
import { Table } from "@mantine/core";

type ItemProps = {
  index: number;
  warehouseDetail: WarehouseReceiptDetail;
};

const Item = ({ index, warehouseDetail }: ItemProps) => {
  const { materials } = useMaterialStore();
  const material = materials.get(warehouseDetail.materialId);

  const columns = [
    {
      content: index + 1,
      align: "left",
    },
    {
      content: material?.others.internalCode,
      align: "center",
    },
    {
      content: material?.name,
      align: "left",
    },
    {
      content: material?.others.unit?.name,
      align: "center",
    },
    {
      content: convertAmountBackward({
        material,
        amount: warehouseDetail.amount,
      }),
      align: "right",
    },
    {
      content: numberWithDelimiter(warehouseDetail.price),
      align: "right",
    },
    {
      content: numberWithDelimiter(
        convertAmountBackward({
          material,
          amount: warehouseDetail.amount,
        }) * warehouseDetail.price,
      ),
      align: "right",
    },
    { content: warehouseDetail?.others.memo, align: "left" },
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
