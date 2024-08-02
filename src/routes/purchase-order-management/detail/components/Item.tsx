import useTranslation from "@/hooks/useTranslation";
import { PurchaseOrderDetail } from "@/services/domain";
import useMaterialStore from "@/stores/material.store";
import { TextAlign } from "@/types";
import { convertAmountBackward, numberWithDelimiter } from "@/utils";
import { Button, NumberInput, Table, TextInput } from "@mantine/core";
import { useEffect, useState } from "react";

type ItemProps = {
  purchaseOrderDetail: PurchaseOrderDetail;
  disabled: boolean;
  onChangeAmount: (amount: number) => void;
  onChangeSupplierNote: (note: string) => void;
  onChangeInternalNote: (note: string) => void;
};

const Item = ({
  purchaseOrderDetail,
  disabled,
  onChangeAmount,
  onChangeInternalNote,
  onChangeSupplierNote,
}: ItemProps) => {
  const t = useTranslation();
  const { materials } = useMaterialStore();
  const material = materials.get(purchaseOrderDetail.materialId);
  const [amount, setAmount] = useState(0);

  useEffect(() => {
    setAmount(
      convertAmountBackward({
        material,
        amount: purchaseOrderDetail.amount,
      }),
    );
  }, [material, purchaseOrderDetail.amount]);

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
          thousandSeparator=""
          allowNegative={false}
          defaultValue={amount}
          onChange={(val) => onChangeAmount(parseInt(val.toString()))}
          allowDecimal={material?.others.allowFloat}
          disabled={disabled}
        />
      ),
      align: "center",
    },

    {
      content: numberWithDelimiter(purchaseOrderDetail.others.price),
      align: "right",
    },
    {
      content: numberWithDelimiter(
        purchaseOrderDetail.others.price * amount,
      ),
      align: "right",
      pr: 10,
    },

    {
      content: (
        <TextInput
          defaultValue={purchaseOrderDetail.others.supplierNote || ""}
          disabled={disabled}
          onChange={(e) => onChangeSupplierNote(e.target.value)}
        />
      ),
      align: "left",
    },
    {
      content: (
        <TextInput
          defaultValue={purchaseOrderDetail.others.internalNote || ""}
          disabled={disabled}
          onChange={(e) => onChangeInternalNote(e.target.value)}
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
          disabled
        >
          {t("Remove")}
        </Button>
      ),
      align: "center",
    },
  ];

  return (
    <Table.Tr key={amount}>
      {columns.map((col, index) => (
        <Table.Td key={index} ta={col.align as TextAlign} pr={col.pr}>
          {col.content}
        </Table.Td>
      ))}
    </Table.Tr>
  );
};

export default Item;
