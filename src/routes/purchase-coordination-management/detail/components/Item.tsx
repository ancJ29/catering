import NumberInput from "@/components/common/NumberInput";
import useTranslation from "@/hooks/useTranslation";
import { Material } from "@/services/domain";
import { TextAlign } from "@/types";
import { numberWithDelimiter, roundToDecimals } from "@/utils";
import { Button, Flex, Table, Text, TextInput } from "@mantine/core";
import { useState } from "react";
import {
  CoordinationDetail,
  SupplierSelectItemData,
} from "../_configs";
import SupplierSelect from "./SupplierSelect";

type ItemProps = {
  material?: Material;
  coordinationDetail?: CoordinationDetail;
  price: number;
  supplierData: SupplierSelectItemData[];
  onChangeOrderQuantity: (value: number) => void;
  onChangSupplierNote: (value: string) => void;
  onChangeInternalNote: (value: string) => void;
  onChangeSupplierId: (value: string) => void;
  removeMaterial: () => void;
  disabled: boolean;
};

const Item = ({
  material,
  coordinationDetail,
  price,
  supplierData,
  onChangeOrderQuantity,
  onChangSupplierNote,
  onChangeInternalNote,
  onChangeSupplierId,
  removeMaterial,
  disabled,
}: ItemProps) => {
  const t = useTranslation();
  const [amount, setAmount] = useState(
    coordinationDetail?.orderQuantity || 0,
  );

  const _onChangeAmount = (value: number) => {
    if (coordinationDetail) {
      setAmount(value);
      onChangeOrderQuantity(value);
    }
  };

  const columns = [
    {
      content: material?.name,
      align: "left",
    },
    {
      content: roundToDecimals(
        coordinationDetail?.approvedQuantity || 0,
        3,
      ),
      align: "right",
    },
    {
      content: (
        <Flex align="center">
          <NumberInput
            thousandSeparator=""
            isPositive={true}
            defaultValue={amount}
            onChange={_onChangeAmount}
            allowDecimal={material?.others.unit?.allowFloat || false}
            isInteger={!material?.others.unit?.allowFloat}
            disabled={disabled}
          />
          <Text
            ml={10}
            w="20%"
          >{`(${material?.others.unit?.name})`}</Text>
        </Flex>
      ),
      align: "left",
      pl: 10,
    },
    {
      content: (
        <SupplierSelect
          value={coordinationDetail?.supplierId}
          onChangeValue={onChangeSupplierId}
          data={supplierData}
          disabled={disabled}
        />
      ),
      align: "right",
    },
    {
      content: numberWithDelimiter(price),
      align: "right",
    },
    {
      content: (
        <TextInput
          defaultValue={coordinationDetail?.supplierNote}
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
          defaultValue={coordinationDetail?.internalNote}
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
        <Flex justify="center" columnGap={10}>
          <Button
            size="compact-xs"
            variant="light"
            color="primary"
            onClick={() => null}
            disabled={disabled}
          >
            {t("Separate")}
          </Button>
          <Button
            size="compact-xs"
            variant="light"
            color="xOrange"
            onClick={() => null}
            disabled={disabled}
          >
            {t("Change")}
          </Button>
          <Button
            size="compact-xs"
            variant="light"
            color="error"
            onClick={removeMaterial}
            disabled={disabled}
          >
            {t("Remove")}
          </Button>
        </Flex>
      ),
      align: "center",
    },
  ];

  return (
    <Table.Tr
      bg={coordinationDetail?.supplierId ? "white" : "primary.0"}
    >
      {columns.map((col, index) => (
        <Table.Td key={index} ta={col.align as TextAlign} pl={col.pl}>
          {col.content}
        </Table.Td>
      ))}
    </Table.Tr>
  );
};

export default Item;
