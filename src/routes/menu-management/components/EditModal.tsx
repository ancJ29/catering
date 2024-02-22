import Selector from "@/components/c-catering/Selector";
import Autocomplete from "@/components/common/Autocomplete";
import DataGrid from "@/components/common/DataGrid";
import Select from "@/components/common/Select";
import useFilterData from "@/hooks/useFilterData";
import useTranslation from "@/hooks/useTranslation";
import { Product } from "@/services/domain";
import { DataGridColumnProps, OptionProps } from "@/types";
import { unique } from "@/utils";
import {
  Box,
  Button,
  Flex,
  Grid,
  ScrollArea,
  Text,
  UnstyledButton,
} from "@mantine/core";
import { IconCircleMinus } from "@tabler/icons-react";
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
  removeProduct: (id: string) => void,
): DataGridColumnProps[] => {
  return [
    {
      key: "typeName",
      header: t("Product type"),
      width: "10%",
      renderCell: (_, product: Product) => {
        return t(`products.type.${product.others.type}`);
      },
    },
    {
      key: "name",
      header: t("Cuisine name"),
      width: "35%",
      renderCell(_, product) {
        return (
          <Flex justify="space-between" pr="2rem">
            <Text>{product.name}</Text>
            <UnstyledButton
              onClick={removeProduct.bind(null, product.id)}
            >
              <IconCircleMinus className="c-catering-btn-icon" />
            </UnstyledButton>
          </Flex>
        );
      },
    },
    {
      key: "costPrice",
      header: t("Cost price"),
      width: "10%",
      renderCell() {
        return "-";
      },
    },
    {
      key: "avgCostPrice",
      header: t("Average cost price"),
      width: "10%",
      renderCell() {
        return "-";
      },
    },
    {
      key: "ratio",
      header: t("Ratio"),
      width: "10%",
      renderCell() {
        return "-";
      },
    },
  ];
};

type EditModalProps = {
  productIds: string[];
  allProducts: Map<string, Product>;
  onSave: (productIds: string[]) => void;
};

const EditModal = ({
  allProducts,
  productIds: _productIds,
  onSave,
}: EditModalProps) => {
  const t = useTranslation();
  const [productIds, setProductIds] = useState(_productIds);
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
    setProductIds((prev) => [...prev, id]);
  }, []);

  const removeProduct = useCallback((id: string) => {
    setProductIds((prev) => prev.filter((i) => i !== id));
  }, []);

  const menuItemConfigs = useMemo(
    () => _menuItemConfigs(t, removeProduct),
    [removeProduct, t],
  );

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

  const changed = useMemo(() => {
    const a = _productIds.sort().join(",");
    const b = productIds.sort().join(",");
    return a !== b;
  }, [_productIds, productIds]);

  return (
    <Box>
      <Box w="100%" ta="right" pb={10}>
        <Button
          disabled={!changed}
          onClick={onSave.bind(null, productIds)}
        >
          {t("Save")}
        </Button>
      </Box>
      <Grid mt={10}>
        <Grid.Col span={8}>
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
        <Grid.Col span={4} className="c-catering-bdr-box">
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
