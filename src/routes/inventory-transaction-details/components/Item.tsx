import useTranslation from "@/hooks/useTranslation";
import { TextAlign } from "@/types";
import { formatTime, roundToDecimals } from "@/utils";
import { Table } from "@mantine/core";
import { Detail } from "../_configs";

type ItemProps = {
  index: number;
  detail: Detail;
  unit?: string;
};

const Item = ({ index, detail, unit }: ItemProps) => {
  const t = useTranslation();
  const columns = [
    {
      content: index + 1,
      align: "left",
    },
    {
      content: formatTime(detail.date, "DD-MM-YYYY"),
      align: "center",
    },
    {
      content: t(`warehouseReceipt.type.${detail.type}`),
      align: "center",
    },
    {
      content: detail.deliveryCatering,
      align: "center",
    },
    {
      content: detail.receiveCatering,
      align: "center",
    },
    {
      content: unit,
      align: "center",
    },
    {
      content: roundToDecimals(detail.beginAmount, 3),
      align: "right",
    },
    {
      content: detail.amount,
      align: "right",
    },
    {
      content: detail.price,
      align: "right",
    },
    {
      content: roundToDecimals(detail.endAmount, 3),
      align: "right",
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
