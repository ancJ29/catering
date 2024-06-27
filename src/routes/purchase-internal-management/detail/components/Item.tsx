import { notNullSchema } from "@/auto-generated/api-configs";
import NumberInput from "@/components/common/NumberInput";
import { PurchaseInternalDetail } from "@/services/domain";
import useMaterialStore from "@/stores/material.store";
import { TextAlign } from "@/types";
import { getConvertedAmount } from "@/utils/unit";
import { Table, TextInput } from "@mantine/core";
import { useState } from "react";

type ItemProps = {
  purchaseInternalDetail: PurchaseInternalDetail;
};

const Item = ({ purchaseInternalDetail }: ItemProps) => {
  const { materials } = useMaterialStore();
  const material = materials.get(purchaseInternalDetail.materialId);
  const [amount] = useState(
    getConvertedAmount({
      material,
      amount: purchaseInternalDetail.amount,
      reverse: true,
    }),
  );

  const columns = [
    {
      content: material?.name,
      align: "left",
    },
    {
      content: material?.others.unit?.name,
      align: "center",
    },
    {
      content: (
        <NumberInput
          w="10vw"
          thousandSeparator=""
          isPositive={true}
          value={amount}
          onChange={() => notNullSchema}
          allowDecimal={material?.others.allowFloat}
          isInteger={!material?.others.allowFloat}
          disabled={true}
        />
      ),
      align: "left",
      pr: 10,
    },
    {
      content: (
        <TextInput
          value={
            purchaseInternalDetail?.others.kitchenDeliveryNote || ""
          }
          disabled={true}
        />
      ),
      align: "left",
    },
    {
      content: (
        <TextInput
          value={purchaseInternalDetail?.others.internalNote || ""}
          disabled={true}
        />
      ),
      align: "left",
    },
  ];

  return (
    <Table.Tr>
      {columns.map((col, index) => (
        <Table.Td key={index} ta={col.align as TextAlign} pr={col.pr}>
          {col.content}
        </Table.Td>
      ))}
    </Table.Tr>
  );
};

export default Item;
