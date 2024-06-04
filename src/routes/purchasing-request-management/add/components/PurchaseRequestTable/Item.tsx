import NumberInput from "@/components/common/NumberInput";
import useTranslation from "@/hooks/useTranslation";
import useMaterialStore from "@/stores/material.store";
import { TextAlign } from "@/types";
import { Button, Checkbox, Table, TextInput } from "@mantine/core";
import { useState, useSyncExternalStore } from "react";
import store from "../../_inventory.store";

type ItemProps = {
  materialId: string;
};

const Item = ({ materialId }: ItemProps) => {
  const t = useTranslation();
  const { materials } = useMaterialStore();
  const material = materials.get(materialId);
  const { currents } = useSyncExternalStore(
    store.subscribe,
    store.getSnapshot,
  );
  const purchaseDetail = currents[materialId];
  const [amount, setAmount] = useState(purchaseDetail.amount);

  const onChangeAmount = (value: number) => {
    setAmount(value);
    store.setAmount(purchaseDetail?.materialId, value);
  };

  const columns = [
    {
      content: (
        <Checkbox
          checked={store.isSelected(materialId)}
          onChange={(event) =>
            store.setIsSelected(
              materialId,
              event.currentTarget.checked,
            )
          }
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
          defaultValue={purchaseDetail?.amount}
          onChange={onChangeAmount}
          allowDecimal={material?.others.allowFloat}
          isInteger={!material?.others.allowFloat}
        />
      ),
      align: "left",
      pr: 10,
    },
    {
      content: amount - purchaseDetail?.needToOrder,
      align: "right",
    },
    { content: material?.others.unit?.name, align: "center" },
    {
      content: (
        <TextInput
          defaultValue={purchaseDetail?.supplierNote}
          onChange={(event) =>
            store.setSupplierNote(
              purchaseDetail?.materialId,
              event.currentTarget.value,
            )
          }
        />
      ),
      align: "left",
    },
    {
      content: (
        <TextInput
          defaultValue={purchaseDetail?.internalNote}
          onChange={(event) =>
            store.setInternalNote(
              purchaseDetail?.materialId,
              event.currentTarget.value,
            )
          }
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
          onClick={() =>
            store.removeMaterial(purchaseDetail?.materialId)
          }
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
