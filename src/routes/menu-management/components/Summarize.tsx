import { ProductType } from "@/auto-generated/api-configs";
import NumberInput from "@/components/common/NumberInput";
import useTranslation from "@/hooks/useTranslation";
import { Product } from "@/services/domain";
import { numberWithDelimiter } from "@/utils";
import { Box, Flex, Table, TextInput } from "@mantine/core";
import { useMemo, useSyncExternalStore } from "react";
import store from "../detail/_item.store";

const tBorderStyle = {
  borderRight: "1px solid var(--border-color)",
};

const Summarize = ({
  disabled,
  selectedProduct,
}: {
  disabled: boolean;
  selectedProduct: Product[];
}) => {
  const t = useTranslation();
  const { item: updatedDailyMenu } = useSyncExternalStore(
    store.subscribe,
    store.getSnapshot,
  );

  const { numberByTypes, totalByTypes } = useMemo(() => {
    const numberByTypes = new Map<string, number>();
    const totalByTypes = new Map<string, number>();
    selectedProduct.forEach((p) => {
      const type: ProductType = p.others.type;
      let before = numberByTypes.get(type) || 0;
      numberByTypes.set(type, before + 1);
      before = totalByTypes.get(type) || 0;
      const total = updatedDailyMenu.others.quantity[p.id] || 0;
      totalByTypes.set(type, total + before);
    });

    return { numberByTypes, totalByTypes };
  }, [selectedProduct, updatedDailyMenu]);

  const { price, avgCost, ratio } = useMemo(() => {
    const total = updatedDailyMenu?.others.total || 0;
    if (total === 0) {
      return {
        ratio: 0,
        avgCost: 0,
      };
    }
    const totalCost = selectedProduct
      .map((p) => {
        const quantity = updatedDailyMenu.others.quantity[p.id];
        const cateringId = updatedDailyMenu.others.cateringId;
        let price = p.others.costPrice || 0;
        if (p.others.costPriceByCatering) {
          price = p.others.costPriceByCatering[cateringId] || price;
        }
        return quantity * price;
      })
      .reduce((a, b) => a + b, 0);
    const price = updatedDailyMenu.others.price || 0;
    const avgCost = Math.ceil(totalCost / total) || 0;
    const ratio = price ? avgCost / price : 0;
    return {
      ratio,
      avgCost,
      price,
    };
  }, [
    selectedProduct,
    updatedDailyMenu.others.cateringId,
    updatedDailyMenu.others.price,
    updatedDailyMenu.others.quantity,
    updatedDailyMenu.others.total,
  ]);

  // {/* cspell:disable */}
  return (
    <Box>
      <Table
        my={10}
        // w="60vw"
        style={{
          border: "1px solid var(--border-color)",
        }}
      >
        <Table.Thead>
          <Table.Tr>
            <Table.Th
              c="primary"
              ta="left"
              style={{
                borderRight: "1px solid var(--border-color)",
              }}
            >
              {t("Product type")}
            </Table.Th>
            <Table.Th
              c="primary"
              ta="center"
              style={{
                borderRight: "1px solid var(--border-color)",
              }}
            >
              {t("Quantity")}
            </Table.Th>
            <Table.Th
              c="primary"
              ta="center"
              style={{
                borderRight: "1px solid var(--border-color)",
              }}
            >
              Số lượng cho 1 suất ăn
            </Table.Th>
            <Table.Th
              c="primary"
              ta="center"
              style={{
                borderRight: "1px solid var(--border-color)",
              }}
            >
              Số lượng cần chuẩn bị cho &nbsp;
              <span
                style={{
                  textDecoration: "italic",
                  color: "red",
                }}
              >
                {numberWithDelimiter(
                  updatedDailyMenu.others.total || 0,
                )}
              </span>
              &nbsp; suất ăn
            </Table.Th>
            <Table.Th c="primary" ta="center">
              Số lượng bình quân cho mỗi món
            </Table.Th>
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>
          {Array.from(numberByTypes.keys()).map((_type, idx) => {
            const type = _type as ProductType;
            const total = updatedDailyMenu.others.total || 0;
            const itemByType =
              updatedDailyMenu?.others.itemByType || {};
            const nByType = numberByTypes.get(type) || 0;
            const tByType = totalByTypes.get(type) || 0;
            const iByType = itemByType?.[type] || 0;
            const all = iByType * total;
            const avg = Math.floor(all / (nByType || 1)) || 0;
            const bg = all > tByType ? "red.2" : "";
            return (
              <Table.Tr key={idx} bg={bg}>
                <Table.Td fw={700} ta="left" style={tBorderStyle}>
                  {t(`products.type.${type}`)} ({nByType})
                </Table.Td>

                <Table.Td ta="center" style={tBorderStyle}>
                  {numberWithDelimiter(tByType)}
                </Table.Td>
                <Table.Td ta="right" style={tBorderStyle}>
                  <NumberInput
                    ml="auto"
                    w="120px"
                    disabled={disabled}
                    defaultValue={iByType}
                    onChange={(value) => {
                      store.setItemByType(type, value);
                    }}
                  />
                </Table.Td>
                <Table.Td ta="center" style={tBorderStyle}>
                  {numberWithDelimiter(all)}
                </Table.Td>
                <Table.Td
                  ta="center"
                  style={{
                    borderRight: "1px solid var(--border-color)",
                  }}
                >
                  {numberWithDelimiter(avg)}
                </Table.Td>
              </Table.Tr>
            );
          })}
        </Table.Tbody>
        {/* cspell:enablr */}
      </Table>
      <Flex
        gap={10}
        justify="start"
        align="start"
        className="c-catering-bdr-t"
        mt={10}
        pt={5}
      >
        <NumberInput
          disabled={disabled}
          label={t("Total sets")}
          w="160px"
          step={1}
          defaultValue={updatedDailyMenu?.others.total || 0}
          onChange={(total) => store.setTotal(total)}
        />
        <NumberInput
          disabled={disabled}
          label={t("Price per set")}
          w="160px"
          defaultValue={price}
          onChange={(price) => store.setPrice(price)}
          suffix=" đ"
          step={100}
        />
        <TextInput
          disabled
          label={t("Average cost price")}
          w="160px"
          fw={800}
          value={`${numberWithDelimiter(avgCost)} đ`}
          styles={{
            input: {
              textAlign: "right",
              color: "black",
              opacity: 1,
            },
          }}
        />
        <TextInput
          disabled
          label={t("Ratio")}
          w="100px"
          fw={800}
          styles={{
            input: {
              textAlign: "right",
              color: "black",
              opacity: 1,
            },
          }}
          value={`${(ratio * 100).toFixed(2)}%`}
        />
      </Flex>
    </Box>
  );
};

export default Summarize;
