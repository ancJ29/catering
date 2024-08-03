import NumberInput from "@/components/common/NumberInput";
import useTranslation from "@/hooks/useTranslation";
import useMaterialStore from "@/stores/material.store";
import { TextAlign } from "@/types";
import { numberWithDelimiter } from "@/utils";
import { Button, Flex, Table, TextInput } from "@mantine/core";
import { IconDeviceFloppy } from "@tabler/icons-react";
import { InternalDetail } from "../_configs";

type ItemProps = {
  index: number;
  internalDetail: InternalDetail;
  disabled: boolean;
  onChangeActualAmount: (value: number) => void;
  onChangeActualPrice: (value: number) => void;
  onChangeKitchenDeliveryNote: (value: string) => void;
};

const Item = ({
  index,
  internalDetail,
  disabled,
  onChangeActualAmount,
  onChangeActualPrice,
  onChangeKitchenDeliveryNote,
}: ItemProps) => {
  const t = useTranslation();
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
        <Flex gap={10} align="center">
          <NumberInput
            thousandSeparator=""
            isPositive={true}
            defaultValue={internalDetail.actualAmount}
            onChange={onChangeActualAmount}
            allowDecimal={material?.others.allowFloat}
            isInteger={!material?.others.allowFloat}
            disabled={disabled}
            w="50%"
          />
          <Button
            variant="outline"
            leftSection={<IconDeviceFloppy size={16} />}
            size="xs"
          >
            {t("Save")}
          </Button>
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
