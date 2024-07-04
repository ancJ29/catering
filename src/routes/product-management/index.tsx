import AutocompleteForFilterData from "@/components/c-catering/AutocompleteForFilterData";
import CustomButton from "@/components/c-catering/CustomButton";
import DataGrid from "@/components/common/DataGrid";
import Select from "@/components/common/Select";
import useFilterData from "@/hooks/useFilterData";
import useTranslation from "@/hooks/useTranslation";
import { Product } from "@/services/domain";
import userProductStore from "@/stores/product.store";
import { OptionProps } from "@/types";
import { unique } from "@/utils";
import { Flex, Stack, Switch } from "@mantine/core";
import { useCallback, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import {
  FilterType,
  configs,
  defaultCondition,
  filter,
} from "./_configs";

const ProductManagement = () => {
  const t = useTranslation();
  const navigate = useNavigate();
  const dataGridConfigs = useMemo(
    () => configs(t, navigate),
    [t, navigate],
  );
  const { products } = userProductStore();

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
    filtered,
    keyword,
    names,
    page,
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
        <Flex justify="end" align="end" gap={10}>
          <Select
            value={condition?.type || null}
            label={t("Product type")}
            w={"20vw"}
            options={typeOptions}
            onChange={updateCondition.bind(null, "type", "")}
          />
          <AutocompleteForFilterData
            key={counter}
            w={"20vw"}
            data={names}
            defaultValue={keyword}
            label={t("Cuisine name")}
            onReload={reload}
          />
          <CustomButton disabled={!filtered} onClick={reset}>
            {t("Clear")}
          </CustomButton>
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
