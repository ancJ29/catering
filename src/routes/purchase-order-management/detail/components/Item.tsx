import useTranslation from "@/hooks/useTranslation";
import { PurchaseOrderDetail } from "@/services/domain";
import useMaterialStore from "@/stores/material.store";
import { TextAlign } from "@/types";
import { numberWithDelimiter } from "@/utils";
import { convertAmount } from "@/utils/unit";
import { Button, NumberInput, Table, TextInput } from "@mantine/core";
import { useEffect, useState } from "react";

type ItemProps = {
  purchaseOrderDetail: PurchaseOrderDetail;
};

const Item = ({ purchaseOrderDetail }: ItemProps) => {
  const t = useTranslation();
  const { materials } = useMaterialStore();
  const material = materials.get(purchaseOrderDetail.materialId);
  const [amount, setAmount] = useState(0);

  useEffect(() => {
    setAmount(
      convertAmount({
        material,
        amount: purchaseOrderDetail.amount,
        reverse: true,
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
      content: <NumberInput value={amount} disabled />,
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
          value={purchaseOrderDetail.others.supplierNote || ""}
          disabled
        />
      ),
      align: "left",
    },
    {
      content: (
        <TextInput
          value={purchaseOrderDetail.others.internalNote || ""}
          disabled
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
