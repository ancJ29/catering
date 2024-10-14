import NumberInput from "@/components/common/NumberInput";
import { PurchaseInternalDetail } from "@/services/domain";
import useMaterialStore from "@/stores/material.store";
import { TextAlign } from "@/types";
import { convertAmountBackward } from "@/utils";
import { Table, TextInput } from "@mantine/core";
import { useState } from "react";

type ItemProps = {
  purchaseInternalDetail: PurchaseInternalDetail;
  onChangeAmount: (amount: number) => void;
  onChangeInternalNote: (internalNote: string) => void;
  onChangeKitchenDeliveryNote: (kitchenDeliveryNote: string) => void;
  disabled: boolean;
};

const Item = ({
  purchaseInternalDetail,
  onChangeAmount,
  onChangeInternalNote,
  onChangeKitchenDeliveryNote,
  disabled,
}: ItemProps) => {
  const { materials } = useMaterialStore();
  const material = materials.get(purchaseInternalDetail.materialId);
  const [amount] = useState(
    convertAmountBackward({
      material,
      amount: purchaseInternalDetail.amount,
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
          w="15vw"
          isPositive={true}
          defaultValue={amount}
          onChange={onChangeAmount}
          allowDecimal={material?.others.unit?.allowFloat || false}
          isInteger={!material?.others.unit?.allowFloat}
          disabled={disabled}
        />
      ),
      align: "left",
      pr: 10,
    },
    {
      content: (
        <TextInput
          defaultValue={
            purchaseInternalDetail?.others.kitchenDeliveryNote || ""
          }
          onChange={(e) =>
            onChangeKitchenDeliveryNote(e.target.value)
          }
          disabled={disabled}
        />
      ),
      align: "left",
    },
    {
      content: (
        <TextInput
          defaultValue={
            purchaseInternalDetail?.others.internalNote || ""
          }
          onChange={(e) => onChangeInternalNote(e.target.value)}
          disabled={disabled}
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
