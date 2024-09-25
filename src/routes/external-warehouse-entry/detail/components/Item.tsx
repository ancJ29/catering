import DateInput from "@/components/common/DateInput";
import NumberInput from "@/components/common/NumberInput";
import useMaterialStore from "@/stores/material.store";
import { TextAlign } from "@/types";
import { numberWithDelimiter } from "@/utils";
import { Checkbox, Flex, Table, TextInput } from "@mantine/core";
import { OrderDetail } from "../_configs";

type ItemProps = {
  index: number;
  orderDetail: OrderDetail;
  disabled: boolean;
  onChangeActualAmount: (value: number) => void;
  onChangeActualPrice: (value: number) => void;
  onChangeExpiryDate: (value?: number) => void;
  onChangeSupplierNote: (value: string) => void;
  onChangeChecked: (value: boolean) => void;
};

const Item = ({
  index,
  orderDetail,
  disabled,
  onChangeActualAmount,
  onChangeActualPrice,
  onChangeExpiryDate,
  onChangeSupplierNote,
  onChangeChecked,
}: ItemProps) => {
  const { materials } = useMaterialStore();
  const material = materials.get(orderDetail.materialId);

  const columns = [
    {
      content: index + 1,
      align: "center",
    },
    {
      content: material?.name || "N/A",
      align: "left",
    },
    {
      content: material?.others.unit?.name || "N/A",
      align: "center",
    },
    {
      content: numberWithDelimiter(orderDetail.amount),
      align: "right",
    },
    {
      content: numberWithDelimiter(0),
      align: "right",
    },
    {
      content: (
        <Flex gap={10} align="center" ml={10}>
          <NumberInput
            thousandSeparator=""
            isPositive={true}
            defaultValue={orderDetail.actualAmount}
            onChange={onChangeActualAmount}
            allowDecimal={material?.others.unit?.allowFloat || false}
            isInteger={!material?.others.unit?.allowFloat}
            disabled={disabled}
            w="80%"
          />
          <Checkbox
            defaultChecked={orderDetail.isChecked}
            onChange={(event) =>
              onChangeChecked(event.currentTarget.checked)
            }
          />
        </Flex>
      ),
      align: "right",
    },
    {
      content: numberWithDelimiter(orderDetail.price),
      align: "right",
    },
    {
      content: (
        <NumberInput
          thousandSeparator=""
          isPositive={true}
          defaultValue={orderDetail.actualPrice}
          onChange={onChangeActualPrice}
          disabled={disabled}
        />
      ),
      align: "right",
    },
    {
      content: (
        <DateInput
          defaultValue={new Date(orderDetail.expiryDate)}
          onChangeDate={onChangeExpiryDate}
        />
      ),
      align: "center",
    },
    {
      content: (
        <TextInput
          value={orderDetail.supplierNote}
          onChange={(e) => onChangeSupplierNote(e.target.value)}
          disabled={disabled}
        />
      ),
      align: "center",
    },
  ];

  return (
    <Table.Tr key={index}>
      {columns.map((col, index) => (
        <Table.Td key={index} ta={col.align as TextAlign}>
          {col.content}
        </Table.Td>
      ))}
    </Table.Tr>
  );
};

export default Item;
