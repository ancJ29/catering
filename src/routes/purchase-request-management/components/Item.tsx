import NumberInput from "@/components/common/NumberInput";
import useTranslation from "@/hooks/useTranslation";
import { Material } from "@/services/domain";
import { RequestDetail, TextAlign } from "@/types";
import { numberWithDelimiter, roundToDecimals } from "@/utils";
import { Button, Checkbox, Table, TextInput } from "@mantine/core";
import { useState } from "react";

type ItemProps = {
  material?: Material;
  requestDetail?: RequestDetail;
  disabled?: boolean;
  isSelected: boolean;
  onChangeAmount: (value: number) => void;
  onChangeIsSelected: (value: boolean) => void;
  onChangSupplierNote: (value: string) => void;
  onChangeInternalNote: (value: string) => void;
  removeMaterial: () => void;
  showNeedToOrder?: boolean;
};

const Item = ({
  material,
  requestDetail,
  disabled = false,
  isSelected,
  onChangeAmount,
  onChangeIsSelected,
  onChangSupplierNote,
  onChangeInternalNote,
  removeMaterial,
  showNeedToOrder = true,
}: ItemProps) => {
  const t = useTranslation();
  const needToOrder =
    (requestDetail?.needToOrder || 0) -
    (requestDetail?.inventory || 0);
  const [amount, setAmount] = useState(requestDetail?.amount || 0);

  const _onChangeAmount = (value: number) => {
    if (requestDetail) {
      setAmount(value);
      onChangeAmount(value);
    }
  };

  const columns = [
    {
      content: (
        <Checkbox
          checked={isSelected}
          onChange={(event) =>
            onChangeIsSelected(event.currentTarget.checked)
          }
          disabled={disabled}
        />
      ),
      align: "left",
    },
    {
      content: material?.name,
      align: "left",
    },
    {
      content: numberWithDelimiter(requestDetail?.inventory || 0),
      align: "right",
    },
    {
      content: (
        <NumberInput
          w="10vw"
          isPositive={true}
          defaultValue={amount}
          onChange={_onChangeAmount}
          allowDecimal={material?.others.unit?.allowFloat || false}
          isInteger={!material?.others.unit?.allowFloat}
          disabled={disabled}
        />
      ),
      align: "left",
      pr: 10,
    },
    {
      content: `${numberWithDelimiter(
        roundToDecimals(amount - needToOrder, 3),
      )} (${roundToDecimals(
        ((amount - needToOrder) / needToOrder || 0) * 100,
        3,
      )}%)`,
      align: "right",
    },
    { content: material?.others.unit?.name, align: "center" },
    {
      content: (
        <TextInput
          defaultValue={requestDetail?.supplierNote}
          onChange={(event) =>
            onChangSupplierNote(event.currentTarget.value)
          }
          disabled={disabled}
        />
      ),
      align: "left",
    },
    {
      content: (
        <TextInput
          defaultValue={requestDetail?.internalNote}
          onChange={(event) =>
            onChangeInternalNote(event.currentTarget.value)
          }
          disabled={disabled}
        />
      ),
      align: "left",
    },
    {
      content: (
        <Button
          size="compact-xs"
          variant="light"
          color="error"
          onClick={removeMaterial}
          disabled={disabled}
        >
          {t("Remove")}
        </Button>
      ),
      align: "center",
    },
  ];

  if (showNeedToOrder) {
    columns.splice(3, 0, {
      content: numberWithDelimiter(requestDetail?.needToOrder || 0),
      align: "right",
    });
  }

  return (
    <Table.Tr bg={requestDetail?.price === 0 ? "primary.0" : "white"}>
      {columns.map((col, index) => (
        <Table.Td key={index} ta={col.align as TextAlign} pr={col.pr}>
          {col.content}
        </Table.Td>
      ))}
    </Table.Tr>
  );
};

export default Item;
