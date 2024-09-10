import AutocompleteForFilterData from "@/components/c-catering/AutocompleteForFilterData";
import CustomButton from "@/components/c-catering/CustomButton";
import ResponsiveFilter from "@/components/c-catering/ResponsiveFilter";
import Select from "@/components/common/Select";
import useTranslation from "@/hooks/useTranslation";
import { Product } from "@/services/domain";
import userProductStore from "@/stores/product.store";
import { OptionProps } from "@/types";
import { unique } from "@/utils";
import { Flex, Switch } from "@mantine/core";
import { useMemo } from "react";
import { FilterType } from "../_configs";

type FilterProps = {
  counter: number;
  condition?: FilterType;
  keyword: string;
  names: string[];
  filtered: boolean;
  reset: () => void;
  reload: () => void;
  updateCondition: (
    key: string,
    _default: unknown,
    value: unknown,
    keyword?: string,
  ) => void;
};

const Filter = ({
  counter,
  condition,
  keyword,
  names,
  filtered,
  reset,
  reload,
  updateCondition,
}: FilterProps) => {
  const { products } = userProductStore();
  const t = useTranslation();

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

  const filterComponent = (
    <>
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
      <Flex
        justify="end"
        align="end"
        gap={10}
        direction={{ base: "column", sm: "row" }}
      >
        <Select
          value={condition?.type || null}
          label={t("Product type")}
          w={{ base: "100%", sm: "20vw" }}
          options={typeOptions}
          onChange={updateCondition.bind(null, "type", "")}
        />
        <AutocompleteForFilterData
          key={counter}
          w={{ base: "100%", sm: "20vw" }}
          data={names}
          value={keyword}
          label={t("Cuisine name")}
          onReload={reload}
        />
        <CustomButton disabled={!filtered} onClick={reset}>
          {t("Clear")}
        </CustomButton>
      </Flex>
    </>
  );

  return (
    <>
      <Flex justify="space-between" align="center" visibleFrom="sm">
        {filterComponent}
      </Flex>
      <ResponsiveFilter>{filterComponent}</ResponsiveFilter>
    </>
  );
};

export default Filter;
