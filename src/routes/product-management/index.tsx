import Autocomplete from "@/components/common/Autocomplete";
import DataGrid from "@/components/common/DataGrid";
import Select from "@/components/common/Select";
import useFilterData from "@/hooks/useFilterData";
import useOnMounted from "@/hooks/useOnMounted";
import useTranslation from "@/hooks/useTranslation";
import { Product } from "@/services/domain";
import userProductStore from "@/stores/product.store";
import { OptionProps } from "@/types";
import { unique } from "@/utils";
import { Button, Flex, Stack, Switch } from "@mantine/core";
import { useCallback, useMemo } from "react";
import {
  FilterType,
  configs,
  defaultCondition,
  filter,
} from "./_configs";

const ProductManagement = () => {
  const t = useTranslation();
  const dataGridConfigs = useMemo(() => configs(t), [t]);
  const { products, reload: reloadProducts } = userProductStore();

  useOnMounted(reloadProducts);

  const typeOptions: OptionProps[] = useMemo(() => {
    return unique(
      Array.from(products.values()).map(
        (p: Product) => p.others.type,
      ),
    ).map((type) => ({
      value: type,
      label: t(`products.type.${type}`),
    }));
  }, [products, t]);

  const dataLoader = useCallback(() => {
    return Array.from(products.values());
  }, [products]);

  const {
    condition,
    counter,
    data,
    keyword,
    names,
    page,
    onKeywordChanged,
    reload,
    reset,
    setPage,
    updateCondition,
  } = useFilterData<Product, FilterType>({
    dataLoader,
    filter,
    defaultCondition,
  });

  return (
    <Stack gap={10}>
      <Flex justify="space-between" align="center">
        <Switch
          mt={20}
          checked={condition?.onSaleOnly ?? false}
          onChange={updateCondition.bind(
            null,
            "onSaleOnly",
            false,
            !(condition?.onSaleOnly ?? false),
            keyword,
          )}
          label={t("On sale ONLY")}
        />
        <Flex justify="end" align={"end"} gap={10}>
          <Select
            value={condition?.type || null}
            label={t("Product type")}
            w={"20vw"}
            options={typeOptions}
            onChange={updateCondition.bind(null, "type", "")}
          />
          <Autocomplete
            key={counter}
            defaultValue={keyword}
            label={t("Cuisine name")}
            w={"20vw"}
            onEnter={reload}
            data={names}
            onChange={onKeywordChanged}
          />
          <Button onClick={reset}>{t("Clear")}</Button>
        </Flex>
      </Flex>

      <DataGrid
        page={page}
        limit={10}
        isPaginated
        hasOrderColumn
        columns={dataGridConfigs}
        data={data}
        onChangePage={setPage}
      />
    </Stack>
  );
};

export default ProductManagement;
