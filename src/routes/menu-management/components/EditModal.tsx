import Autocomplete from "@/components/common/Autocomplete";
import DataGrid from "@/components/common/DataGrid";
import useFilterData from "@/hooks/useFilterData";
import useTranslation from "@/hooks/useTranslation";
import { Product } from "@/services/domain";
import { DataGridColumnProps } from "@/types";
import {
  Box,
  Button,
  Flex,
  Grid,
  ScrollArea,
  Text,
  UnstyledButton,
} from "@mantine/core";
import { IconCircleMinus, IconCirclePlus } from "@tabler/icons-react";
import { useCallback, useMemo, useState } from "react";

const _menuItemConfigs = (
  t: (key: string) => string,
  removeProduct: (id: string) => void,
): DataGridColumnProps[] => {
  return [
    {
      key: "typeName",
      header: t("Product type"),
      width: "15%",
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
              <IconCircleMinus className="btn-icon" />
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

  const {
    names,
    data: products,
    change,
    filter,
  } = useFilterData<Product>({
    reload: () =>
      new Promise((resolve) =>
        resolve(Array.from(allProducts.values())),
      ),
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
          <Box h="20vh" className="bdr-box" p={8}>
            TODO: Detail prices
          </Box>
        </Grid.Col>
        <Grid.Col span={4} className="bdr-box">
          <Flex justify="end" align={"center"} mb="1rem">
            <Autocomplete
              w={"20vw"}
              onEnter={filter}
              data={names}
              onChange={change}
            />
          </Flex>
          <ScrollArea h="80vh">
            {products.map((product) => {
              const existed = productIds.includes(product.id);
              const Icon = existed ? IconCircleMinus : IconCirclePlus;
              return (
                <Box
                  style={{
                    cursor: "pointer",
                    borderRadius: "5px",
                  }}
                  bg={existed ? "primary.4" : undefined}
                  className="hover-bg"
                  key={product.id}
                  w="100%"
                  p={10}
                  mb={4}
                  onClick={() => {
                    if (existed) {
                      removeProduct(product.id);
                    } else {
                      addProduct(product.id);
                    }
                  }}
                >
                  <Flex gap={5}>
                    <Icon />
                    <Text>
                      {product.name} ({product.code})
                    </Text>
                  </Flex>
                </Box>
              );
            })}
          </ScrollArea>
        </Grid.Col>
      </Grid>
    </Box>
  );
};

export default EditModal;
