import Selector from "@/components/c-catering/Selector";
import Autocomplete from "@/components/common/Autocomplete";
import DataGrid from "@/components/common/DataGrid";
import Select from "@/components/common/Select";
import useFilterData from "@/hooks/useFilterData";
import useTranslation from "@/hooks/useTranslation";
import { Product } from "@/services/domain";
import useProductStore from "@/stores/product.store";
import { OptionProps } from "@/types";
import {
  Box,
  Button,
  Flex,
  Grid,
  NumberInput,
  ScrollArea,
} from "@mantine/core";
import { useCallback, useMemo, useState } from "react";
import TabControll from "../components/TabControll";
import {
  FilterType,
  _configs,
  defaultCondition,
  filter,
} from "./_config";

const EditModal = ({
  quantity: originQuantity,
  onSave,
}: {
  quantity: Map<string, number>;
  onSave: (quantity: Map<string, number>) => void;
}) => {
  const t = useTranslation();
  const [tab, setActiveTab] = useState<string>("detail");
  const { allTypes, products: allProducts } = useProductStore();
  const [changed, setChanged] = useState(false);
  const [quantity] = useState<Map<string, number>>(originQuantity);
  const [productIds, setProductIds] = useState(
    Array.from(originQuantity.keys()),
  );
  const menuItem: Product[] = useMemo(() => {
    return productIds
      .map((productId) => allProducts.get(productId))
      .filter(Boolean) as Product[];
  }, [allProducts, productIds]);
  const typeOptions: OptionProps[] = useMemo(() => {
    return allTypes.map((type) => ({
      label: t(`products.type.${type}`),
      value: type,
    }));
  }, [allTypes, t]);

  const { numberByTypes } = useMemo(() => {
    const numberByTypes = new Map<string, number>();
    menuItem.forEach((p) => {
      numberByTypes.set(
        p.others.type,
        (numberByTypes.get(p.others.type) || 0) + 1,
      );
    });

    return { numberByTypes };
  }, [menuItem]);

  const addProduct = useCallback((id: string) => {
    setChanged(true);
    setProductIds((prev) => [...prev, id]);
  }, []);

  const removeProduct = useCallback((id: string) => {
    setChanged(true);
    setProductIds((prev) => prev.filter((i) => i !== id));
  }, []);

  const configs = useMemo(() => {
    return _configs(t, originQuantity, setQuantity, removeProduct);
    function setQuantity(productId: string, price: number) {
      setChanged(true);
      quantity.set(productId, price);
    }
  }, [originQuantity, quantity, removeProduct, t]);

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
      <Flex
        align="center"
        justify="space-between"
        w="100%"
        ta="right"
        pb={10}
      >
        <TabControll onChange={setActiveTab} />
        <Button
          disabled={!changed}
          onClick={onSave.bind(null, quantity)}
        >
          {t("Save")}
        </Button>
      </Flex>
      <Grid mt={10}>
        <Grid.Col span={9}>
          {tab === "detail" && (
            <Box>
              <Grid
                mb={5}
                w="15vw"
                gutter="sm"
                justify="center"
                align="flex-start"
              >
                {Array.from(numberByTypes.keys()).map((type) => {
                  return (
                    <>
                      <Grid.Col key={`${type}.1`} span={10}>
                        {t(`products.type.${type}`)}
                      </Grid.Col>
                      <Grid.Col key={`${type}.1`} span={2}>
                        {numberByTypes.get(type) || 0}
                      </Grid.Col>
                    </>
                  );
                })}
              </Grid>
              <Flex
                gap={10}
                justify="start"
                align="start"
                className="c-catering-bdr-t"
                mt={10}
                pt={5}
              >
                <NumberInput
                  label={t("Total sets")}
                  w="160px"
                  thousandSeparator="."
                  decimalSeparator=","
                  step={1}
                />
                <NumberInput
                  disabled
                  label={t("Price per set")}
                  w="160px"
                  defaultValue={
                    20e3 + Math.floor(Math.random() * 20) * 1e3
                  }
                  thousandSeparator="."
                  decimalSeparator=","
                  suffix=" đ"
                  step={1000}
                />
                <NumberInput
                  disabled
                  label={t("Cost price")}
                  w="160px"
                  defaultValue={
                    10e3 + Math.floor(Math.random() * 20) * 1e3
                  }
                  thousandSeparator="."
                  decimalSeparator=","
                  suffix=" đ"
                  step={1000}
                />
                <NumberInput
                  disabled
                  label={t("Average cost price")}
                  w="160px"
                  defaultValue={
                    10e3 + Math.floor(Math.random() * 20) * 1e3
                  }
                  thousandSeparator="."
                  decimalSeparator=","
                  suffix=" đ"
                  step={1000}
                />
              </Flex>
            </Box>
          )}
          <DataGrid
            hasUpdateColumn={false}
            hasOrderColumn
            columns={configs}
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
