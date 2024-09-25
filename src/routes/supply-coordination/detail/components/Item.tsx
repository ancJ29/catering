import NumberInput from "@/components/common/NumberInput";
import Select from "@/components/common/Select";
import useTranslation from "@/hooks/useTranslation";
import { Department, Material } from "@/services/domain";
import useCateringStore from "@/stores/catering.store";
import { OptionProps, TextAlign } from "@/types";
import {
  Button,
  Checkbox,
  Flex,
  Table,
  Text,
  TextInput,
} from "@mantine/core";
import { useMemo } from "react";
import { CoordinationDetail } from "../_purchase-coordination-detail.store";

type ItemProps = {
  currentCateringId: string | null;
  material?: Material;
  coordinationDetail?: CoordinationDetail;
  disabled?: boolean;
  isSelected: boolean;
  price: number;
  kitchenQuantity: number;
  onChangeAmount: (value: number) => void;
  onChangeIsSelected: (value: boolean) => void;
  onChangSupplierNote: (value: string) => void;
  onChangeInternalNote: (value: string) => void;
  onChangeDeliveryCatering: (value: string | null) => void;
  removeMaterial: () => void;
};

const Item = ({
  currentCateringId,
  material,
  coordinationDetail,
  disabled = false,
  isSelected,
  price,
  kitchenQuantity,
  onChangeAmount,
  onChangeIsSelected,
  onChangSupplierNote,
  onChangeInternalNote,
  onChangeDeliveryCatering,
  removeMaterial,
}: ItemProps) => {
  const t = useTranslation();
  const { activeCaterings } = useCateringStore();
  const _caterings: OptionProps[] = useMemo(() => {
    return Array.from(activeCaterings.values())
      .map((p: Department) => ({
        label: p.name,
        value: p.id,
      }))
      .filter((e) => e.value !== currentCateringId);
  }, [activeCaterings, currentCateringId]);

  const bg = () => {
    const isSold = kitchenQuantity === 0 && !isSelected;
    return isSold ? "error.0" : price === 0 ? "primary.0" : "white";
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
    },
    {
      content: material?.name,
      align: "left",
    },
    {
      content: (
        <Text>
          {coordinationDetail?.isSupply ? t("Yes") : t("No")}
        </Text>
      ),
    },
    {
      content: isSelected ? (
        coordinationDetail?.deliveryCatering
      ) : (
        <Select
          value={coordinationDetail?.deliveryCatering}
          w="max-content"
          options={_caterings}
          onChange={onChangeDeliveryCatering}
          required
          styles={{
            input: {
              marginRight: "30px",
            },
          }}
        />
      ),
    },
    { content: coordinationDetail?.orderQuantity, align: "right" },
    { content: kitchenQuantity, align: "right" },
    {
      content: (
        <NumberInput
          w="10vw"
          thousandSeparator=""
          isPositive={true}
          defaultValue={coordinationDetail?.dispatchQuantity}
          onChange={onChangeAmount}
          allowDecimal={material?.others.allowFloat}
          isInteger={!material?.others.allowFloat}
          disabled={disabled}
        />
      ),
      align: "left",
      pr: 10,
    },
    { content: material?.others.unit?.name, align: "center" },
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
          {!isSelected && (
            <Button
              size="compact-xs"
              variant="light"
              color="primary"
              onClick={() => null}
              disabled={disabled}
            >
              {t("Separate")}
            </Button>
          )}
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
    <Table.Tr bg={bg()}>
      {columns.map((col, index) => (
        <Table.Td key={index} ta={col.align as TextAlign} pr={col.pr}>
          {col.content}
        </Table.Td>
      ))}
    </Table.Tr>
  );
};

export default Item;
