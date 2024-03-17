import AutocompleteForFilterData from "@/components/c-catering/AutocompleteForFilterData";
import useTranslation from "@/hooks/useTranslation";
import useProductStore from "@/stores/product.store";
import { Button, Flex } from "@mantine/core";
import { useCounter, useDisclosure } from "@mantine/hooks";
import { useMemo } from "react";

const ProductFilter = ({
  onSelect,
  onClear,
}: {
  onClear: () => void;
  onSelect: (productId: string) => void;
}) => {
  const t = useTranslation();
  const [counter, { increment }] = useCounter(0);
  const { products } = useProductStore();
  const [disabled, { toggle }] = useDisclosure(true);

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

  return (
    <Flex align="flex-end" gap={10}>
      <AutocompleteForFilterData
        key={counter}
        w="300px"
        unFocusOnMatch
        label={t("Cuisine name")}
        data={productNames}
        onReload={(keyword) => {
          if (!keyword) {
            toggle();
            onClear();
          } else {
            if (keyword && productIdByName.has(keyword)) {
              toggle();
              const productId = productIdByName.get(keyword);
              productId && onSelect(productId);
            }
          }
        }}
      />
      <Button
        disabled={disabled}
        onClick={() => {
          toggle();
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
