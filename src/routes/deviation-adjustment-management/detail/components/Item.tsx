import NumberInput from "@/components/common/NumberInput";
import useMaterialStore from "@/stores/material.store";
import { TextAlign } from "@/types";
import { Table, TextInput } from "@mantine/core";
import { OrderDetail } from "../_configs";

type ItemProps = {
  orderDetail: OrderDetail;
  onChangePaymentAmount: (value: number) => void;
  onChangePrice: (value: number) => void;
  disabled: boolean;
};

const Item = ({
  orderDetail,
  onChangePaymentAmount,
  onChangePrice,
  disabled,
}: ItemProps) => {
  const { materials } = useMaterialStore();
  const columns = [
    {
      content: materials.get(orderDetail.materialId)?.name,
      align: "left",
    },
    {
      content: orderDetail.amount,
      align: "right",
    },
    {
      content: orderDetail.actualAmount,
      align: "right",
    },
    {
      content: (
        <NumberInput
          thousandSeparator=""
          isPositive={true}
          defaultValue={orderDetail.paymentAmount}
          onChange={onChangePaymentAmount}
          allowDecimal={
            materials.get(orderDetail.materialId)?.others.unit
              ?.allowFloat || false
          }
          isInteger={
            !materials.get(orderDetail.materialId)?.others.unit
              ?.allowFloat
          }
          disabled={disabled}
        />
      ),
      align: "center",
    },
    {
      content: (
        <NumberInput
          thousandSeparator=""
          isPositive={true}
          defaultValue={orderDetail.price}
          onChange={onChangePrice}
          allowDecimal={false}
          isInteger={true}
          disabled={disabled}
        />
      ),
      align: "center",
    },
    {
      content: orderDetail.vat,
      align: "right",
    },
    {
      content: (
        <TextInput value={orderDetail.supplierNote} disabled />
      ),
      align: "left",
    },
    {
      content: (
        <TextInput value={orderDetail.internalNote} disabled />
      ),
      align: "left",
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
