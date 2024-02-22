import Selector from "@/components/c-catering/Selector";
import Autocomplete from "@/components/common/Autocomplete";
import DataGrid from "@/components/common/DataGrid";
import Select from "@/components/common/Select";
import useFilterData from "@/hooks/useFilterData";
import useTranslation from "@/hooks/useTranslation";
import { Product } from "@/services/domain";
import useProductStore from "@/stores/product.store";
import { DataGridColumnProps, OptionProps } from "@/types";
import { unique } from "@/utils";
import {
  Box,
  Button,
  Flex,
  Grid,
  NumberInput,
  ScrollArea,
  Text,
} from "@mantine/core";
import { useCallback, useMemo, useState } from "react";

export type FilterType = {
  type: string;
};

export const defaultCondition: FilterType = {
  type: "",
};

export function filter(p: Product, x?: FilterType) {
  if (!x) {
    return true;
  }
  if (x.type && p.others.type !== x.type) {
    return false;
  }
  return true;
}

const _menuItemConfigs = (
  t: (key: string) => string,
  _quantity: Map<string, number>,
  setQuantity: (productId: string, price: number) => void,
  removeProduct: (id: string) => void,
): DataGridColumnProps[] => {
  return [
    {
      key: "typeName",
      header: t("Product type"),
      width: "10%",
      renderCell: (_, product: Product) => {
        return (
          <Text fz="sm">
            {t(`products.type.${product.others.type}`)}
          </Text>
        );
      },
    },
    {
      key: "name",
      header: t("Cuisine name"),
      width: "15rem",
    },
    {
      key: "quantity",
      header: t("Quantity"),
      width: "100px",
      renderCell(_, product: Product) {
        const Component = () => {
          const [quantity, setInternalQuantity] = useState(
            _quantity.get(product.id) || 0,
          );
          return (
            <NumberInput
              value={quantity}
              thousandSeparator="."
              decimalSeparator=","
              onChange={(value) => {
                let quantity = parseInt(value.toString());
                if (isNaN(quantity) || quantity < 0) {
                  quantity = 0;
                }
                setInternalQuantity(quantity);
                setQuantity(product.id, quantity);
              }}
            />
          );
        };
        return <Component />;
      },
    },
    {
      key: "costPrice",
      header: t("Cost price"),
      width: "100px",
      renderCell() {
        const cost = Math.floor(Math.random() * 500) * 100;
        return (
          <Text w="100%" ta="right" c="red.6">
            {cost.toLocaleString()}&nbsp;đ
          </Text>
        );
      },
    },
    {
      key: "avgCostPrice",
      header: t("Average cost price"),
      width: "100px",
      renderCell() {
        const cost = Math.floor(Math.random() * 500) * 100;
        return (
          <Text w="100%" ta="right" c="red.6">
            {cost.toLocaleString()}&nbsp;đ
          </Text>
        );
      },
    },
    {
      key: "ratio",
      header: t("Ratio"),
      width: "70px",
      renderCell() {
        const ratio = Math.floor(Math.random() * 10000) / 100 + "%";
        return (
          <Text w="100%" ta="right" c="red.6">
            {ratio}
          </Text>
        );
      },
    },
    {
      key: "action",
      textAlign: {
        cell: "right",
      },
      style: {
        paddingRight: "1rem",
        flexGrow: 1,
      },
      renderCell: (_, product: Product) => {
        return (
          <Flex justify="end" align="center" gap={10}>
            <Button size="compact-xs">{t("BOM")}</Button>
            <Button
              size="compact-xs"
              variant="light"
              color="error"
              onClick={removeProduct.bind(null, product.id)}
            >
              {t("Remove")}
            </Button>
          </Flex>
        );
      },
    },
  ];
};

type EditModalProps = {
  quantity: Map<string, number>;
  allProducts: Map<string, Product>;
  onSave: (quantity: Map<string, number>) => void;
};

const EditModal = ({
  quantity: _quantity,
  onSave,
}: EditModalProps) => {
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
    return _menuItemConfigs(t, _quantity, setQuantity, removeProduct);
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
              labelGenerator={labelGenerator}
            />
          </ScrollArea>
        </Grid.Col>
      </Grid>
    </Box>
  );
};

export default EditModal;

function labelGenerator(p: Product) {
  return `${p.name} - ${p.code}`;
}
