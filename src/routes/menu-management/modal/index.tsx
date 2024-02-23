import Selector from "@/components/c-catering/Selector";
import Autocomplete from "@/components/common/Autocomplete";
import DataGrid from "@/components/common/DataGrid";
import Select from "@/components/common/Select";
import useFilterData from "@/hooks/useFilterData";
import useTranslation from "@/hooks/useTranslation";
import { Product } from "@/services/domain";
import useProductStore from "@/stores/product.store";
import { OptionProps } from "@/types";
import { unique } from "@/utils";
import { Box, Button, Flex, Grid, ScrollArea } from "@mantine/core";
import { useCallback, useMemo, useState } from "react";
import {
  FilterType,
  _configs,
  defaultCondition,
  filter,
} from "./_config";

const EditModal = ({
  quantity: _quantity,
  onSave,
}: {
  quantity: Map<string, number>;
  onSave: (quantity: Map<string, number>) => void;
}) => {
  const t = useTranslation();
  const { products: allProducts } = useProductStore();
  const [productIds, setProductIds] = useState(
    Array.from(_quantity.keys()),
  );
  const [changed, setChanged] = useState(false);
  const [quantity] = useState<Map<string, number>>(_quantity);
  const menuItem: Product[] = useMemo(() => {
    return productIds
      .map((productId) => allProducts.get(productId))
      .filter(Boolean) as Product[];
  }, [allProducts, productIds]);

  const typeOptions: OptionProps[] = useMemo(() => {
    const types = unique(
      Array.from(allProducts.values()).map((p) => p.others.type),
    );
    return types.map((type) => ({
      label: t(`products.type.${type}`),
      value: type,
    }));
  }, [allProducts, t]);

  const addProduct = useCallback((id: string) => {
    setChanged(true);
    setProductIds((prev) => [...prev, id]);
  }, []);

  const removeProduct = useCallback((id: string) => {
    setChanged(true);
    setProductIds((prev) => prev.filter((i) => i !== id));
  }, []);

  const menuItemConfigs = useMemo(() => {
    return _configs(t, _quantity, setQuantity, removeProduct);
    function setQuantity(productId: string, price: number) {
      setChanged(true);
      quantity.set(productId, price);
    }
  }, [_quantity, quantity, removeProduct, t]);

  const dataLoader = useCallback(() => {
    return Array.from(allProducts.values()).filter((p) => !p.enabled);
  }, [allProducts]);

  const {
    condition,
    counter,
    data,
    filtered,
    keyword,
    names,
    onKeywordChanged,
    reload,
    reset,
    updateCondition,
  } = useFilterData<Product, FilterType>({
    dataLoader,
    defaultCondition,
    filter,
  });

  return (
    <Box>
      <Box w="100%" ta="right" pb={10}>
        <Button
          disabled={!changed}
          onClick={onSave.bind(null, quantity)}
        >
          {t("Save")}
        </Button>
      </Box>
      <Grid mt={10}>
        <Grid.Col span={9}>
          <DataGrid
            hasUpdateColumn={false}
            hasOrderColumn
            columns={menuItemConfigs}
            data={menuItem}
          />
          <Box h="20vh" className="c-catering-bdr-box" p={8}>
            TODO: Detail prices
          </Box>
        </Grid.Col>
        <Grid.Col span={3} className="c-catering-bdr-box">
          <Box key={counter}>
            <Flex justify="end" align={"center"} mb="1rem">
              <Select
                label={t("Product type")}
                w={"20vw"}
                value={condition?.type || ""}
                onChange={updateCondition.bind(null, "type", "")}
                options={typeOptions}
              />
            </Flex>
            <Flex justify="end" align={"center"} mb="1rem">
              <Autocomplete
                w={"20vw"}
                onEnter={reload}
                data={names}
                defaultValue={keyword}
                label={t("Cuisine name")}
                onChange={onKeywordChanged}
              />
            </Flex>
          </Box>
          <Box ta="right" mb={10}>
            <Button disabled={!filtered} onClick={reset}>
              {t("Clear")}
            </Button>
          </Box>
          <ScrollArea h="80vh">
            <Selector
              data={data}
              selectedIds={productIds}
              onAdd={addProduct}
              onRemove={removeProduct}
              labelGenerator={(p) => `${p.name} - ${p.code}`}
            />
          </ScrollArea>
        </Grid.Col>
      </Grid>
    </Box>
  );
};

export default EditModal;
