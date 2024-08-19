import DateInput from "@/components/common/DateInput";
import NumberInput from "@/components/common/NumberInput";
import useMaterialStore from "@/stores/material.store";
import { TextAlign } from "@/types";
import { numberWithDelimiter } from "@/utils";
import { Checkbox, Flex, Table, TextInput } from "@mantine/core";
import { InternalDetail } from "../_configs";

type ItemProps = {
  index: number;
  internalDetail: InternalDetail;
  disabled: boolean;
  onChangeActualAmount: (value: number) => void;
  onChangeActualPrice: (value: number) => void;
  onChangeExpiryDate: (value?: number) => void;
  onChangeKitchenDeliveryNote: (value: string) => void;
  onChangeChecked: (value: boolean) => void;
};

const Item = ({
  index,
  internalDetail,
  disabled,
  onChangeActualAmount,
  onChangeActualPrice,
  onChangeExpiryDate,
  onChangeKitchenDeliveryNote,
  onChangeChecked,
}: ItemProps) => {
  const { materials } = useMaterialStore();
  const material = materials.get(internalDetail.materialId);

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
      content: numberWithDelimiter(internalDetail.amount),
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
            defaultValue={internalDetail.actualAmount}
            onChange={onChangeActualAmount}
            allowDecimal={material?.others.allowFloat}
            isInteger={!material?.others.allowFloat}
            disabled={disabled}
            w="80%"
          />
          <Checkbox
            defaultChecked={internalDetail.isChecked}
            onChange={(event) =>
              onChangeChecked(event.currentTarget.checked)
            }
          />
        </Flex>
      ),
      align: "right",
    },
    {
      content: numberWithDelimiter(internalDetail.price),
      align: "right",
    },
    {
      content: (
        <NumberInput
          thousandSeparator=""
          isPositive={true}
          defaultValue={internalDetail.actualPrice}
          onChange={onChangeActualPrice}
          disabled={disabled}
        />
      ),
      align: "right",
    },
    {
      content: (
        <DateInput
          defaultValue={new Date(internalDetail.expiryDate)}
          onChangeDate={onChangeExpiryDate}
        />
      ),
      align: "center",
    },
    {
      content: (
        <TextInput
          value={internalDetail.kitchenDeliveryNote}
          onChange={(e) =>
            onChangeKitchenDeliveryNote(e.target.value)
          }
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
