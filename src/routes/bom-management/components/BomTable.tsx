import ScrollTable from "@/components/c-catering/ScrollTable";
import EmptyBox from "@/components/common/EmptyBox";
import NumberInput from "@/components/common/NumberInput";
import useTranslation from "@/hooks/useTranslation";
import useMaterialStore from "@/stores/material.store";
import { lastElement, numberWithDelimiter } from "@/utils";
import { Box, Button, Table, TextInput } from "@mantine/core";
import { useMemo, useSyncExternalStore } from "react";
import store from "../_bom.store";
import { FilterType, Tab, _customizeKey } from "../_config";

const BomTable = ({
  condition,
  errorAmounts,
}: {
  condition: FilterType;
  errorAmounts?: Record<string, number>;
}) => {
  const t = useTranslation();
  const { materials } = useMaterialStore();
  const { originalBom, materialIds } = useSyncExternalStore(
    store.subscribe,
    store.getSnapshot,
  );
  const customizeKey = useMemo(
    () => _customizeKey(condition),
    [condition],
  );

  const isStandard = condition.tab === Tab.STANDARD;

  return (
    <ScrollTable
      key={`${customizeKey}`}
      header={
        <>
          <Table.Th w="40%">{t("Material name")}</Table.Th>
          {isStandard ? (
            ""
          ) : (
            <Table.Th ta="right">{t("Price")}</Table.Th>
          )}
          <Table.Th w={150} ta="right">
            {t("Amount")}
          </Table.Th>
          <Table.Th w={120} ta="center">
            {t("Unit")}
          </Table.Th>
          <Table.Th>{t("Memo")}</Table.Th>
          <Table.Th></Table.Th>
        </>
      }
    >
      {materialIds.map((materialId) => {
        const material = materials.get(materialId);
        const others = originalBom?.others;
        const memo = customizeKey
          ? others?.memo?.[`${customizeKey}.${materialId}`]
          : others?.memo?.[materialId];
        let amount = originalBom?.bom[materialId] || 0;
        if (customizeKey) {
          amount =
            others?.customized?.[customizeKey]?.[materialId] ||
            amount;
        }
        const unit = lastElement(material?.others.unit?.units || []);
        let price = material?.others.price || 0;
        const cateringId = condition.cateringId;
        if (cateringId) {
          price =
            material?.others.prices?.[cateringId]?.price || price;
        }
        return (
          <Table.Tr key={materialId}>
            <Table.Td>{material?.name}</Table.Td>
            {isStandard ? (
              ""
            ) : (
              <Table.Td ta="right">
                {numberWithDelimiter(price)}&nbsp; đ
              </Table.Td>
            )}
            <Table.Td pr={10}>
              <NumberInput
                isInteger={false}
                ml="auto"
                w="120px"
                defaultValue={amount}
                styles={{
                  input: {
                    backgroundColor:
                      errorAmounts?.[materialId] === 0
                        ? "var(--mantine-color-red-1)"
                        : undefined,
                  },
                }}
                onChange={(amount) => {
                  store.setAmount(materialId, amount, customizeKey);
                }}
              />
            </Table.Td>
            <Table.Td ta="center">{unit || "--"}</Table.Td>
            <Table.Td px={10}>
              <TextInput
                defaultValue={memo}
                onChange={(e) => {
                  store.setMemo(
                    materialId,
                    e.target.value,
                    customizeKey,
                  );
                }}
              />
            </Table.Td>
            <Table.Td ta="center">
              <Button
                size="compact-xs"
                variant="light"
                color="error"
                onClick={() => store.remove(materialId)}
              >
                {t("Remove")}
              </Button>
            </Table.Td>
          </Table.Tr>
        );
      })}
      {!materialIds.length && (
        <Table.Tr>
          <Table.Td colSpan={4}>
            <Box w="100%">
              <EmptyBox
                noResultText={
                  condition.productId
                    ? t("No bom configured")
                    : t("Please select a product")
                }
              />
            </Box>
          </Table.Td>
        </Table.Tr>
      )}
    </ScrollTable>
  );
};

export default BomTable;
