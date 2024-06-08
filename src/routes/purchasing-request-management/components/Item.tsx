import NumberInput from "@/components/common/NumberInput";
import useTranslation from "@/hooks/useTranslation";
import { Material } from "@/services/domain";
import { TextAlign } from "@/types";
import { roundToDecimals } from "@/utils/unit";
import { Button, Checkbox, Table, TextInput } from "@mantine/core";
import { useState } from "react";
import { PurchaseDetail } from "../add/_config";

type ItemProps = {
  material?: Material;
  purchaseDetail?: PurchaseDetail;
  disabled?: boolean;
  isSelected: boolean;
  price: number;
  onChangeAmount: (value: number) => void;
  onChangeIsSelected: (value: boolean) => void;
  onChangSupplierNote: (value: string) => void;
  onChangeInternalNote: (value: string) => void;
  removeMaterial: () => void;
};

const Item = ({
  material,
  purchaseDetail,
  disabled = false,
  isSelected,
  price,
  onChangeAmount,
  onChangeIsSelected,
  onChangSupplierNote,
  onChangeInternalNote,
  removeMaterial,
}: ItemProps) => {
  const t = useTranslation();
  const [amount, setAmount] = useState(purchaseDetail?.amount || 0);

  const _onChangeAmount = (value: number) => {
    if (purchaseDetail) {
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
    { content: purchaseDetail?.inventory, align: "right" },
    { content: purchaseDetail?.needToOrder, align: "right" },
    {
      content: (
        <NumberInput
          w="10vw"
          thousandSeparator=""
          isPositive={true}
          defaultValue={amount}
          onChange={_onChangeAmount}
          allowDecimal={material?.others.allowFloat}
          isInteger={!material?.others.allowFloat}
          disabled={disabled}
        />
      ),
      align: "left",
      pr: 10,
    },
    {
      content: roundToDecimals(
        amount - (purchaseDetail?.needToOrder || 0),
        3,
      ),
      align: "right",
    },
    { content: material?.others.unit?.name, align: "center" },
    {
      content: (
        <TextInput
          defaultValue={purchaseDetail?.supplierNote}
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
          defaultValue={purchaseDetail?.internalNote}
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
        >
          {t("Remove")}
        </Button>
      ),
      align: "center",
    },
  ];

  return (
    <Table.Tr bg={price === 0 ? "blue.2" : "white"}>
      {columns.map((col, index) => (
        <Table.Td key={index} ta={col.align as TextAlign} pr={col.pr}>
          {col.content}
        </Table.Td>
      ))}
    </Table.Tr>
  );
};

export default Item;
