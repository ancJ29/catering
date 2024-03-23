import AutocompleteForFilterData from "@/components/c-catering/AutocompleteForFilterData";
import useTranslation from "@/hooks/useTranslation";
import useProductStore from "@/stores/product.store";
import { Button, Flex } from "@mantine/core";
import { useCounter } from "@mantine/hooks";
import { useMemo } from "react";

const ProductFilter = ({
  productId,
  onSelect,
  onClear,
}: {
  productId?: string;
  onClear: () => void;
  onSelect: (productId: string) => void;
}) => {
  const t = useTranslation();
  const [counter, { increment }] = useCounter(0);
  const { products } = useProductStore();

  const { productNames, productIdByName } = useMemo(() => {
    const productIdByName = new Map(
      Array.from(products.values()).map((product) => [
        product.name,
        product.id,
      ]),
    );
    const productNames = Array.from(productIdByName.keys());
    return { productNames, productIdByName };
  }, [products]);

  const defaultValue = useMemo(() => {
    return productId ? products.get(productId)?.name : "";
  }, [productId, products]);

  return (
    <Flex align="flex-end" gap={10}>
      <AutocompleteForFilterData
        key={`${counter}.${defaultValue}`}
        w="300px"
        defaultValue={defaultValue}
        unFocusOnMatch
        label={t("Cuisine name")}
        data={productNames}
        onReload={(keyword) => {
          if (!keyword) {
            onClear();
          } else {
            if (keyword && productIdByName.has(keyword)) {
              const productId = productIdByName.get(keyword);
              productId && onSelect(productId);
            }
          }
        }}
      />
      <Button
        disabled={!productId}
        onClick={() => {
          increment();
          onClear();
        }}
      >
        {t("Clear")}
      </Button>
    </Flex>
  );
};

export default ProductFilter;
