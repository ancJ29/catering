import AutocompleteForFilterData from "@/components/c-catering/AutocompleteForFilterData";
import CustomButton from "@/components/c-catering/CustomButton";
import ResponsiveFilter from "@/components/c-catering/ResponsiveFilter";
import DateRangeInput from "@/components/common/DateRangeInput";
import MultiSelect from "@/components/common/MultiSelect";
import useTranslation from "@/hooks/useTranslation";
import { Department } from "@/services/domain";
import useCateringStore from "@/stores/catering.store";
import { OptionProps } from "@/types";
import { endOfWeek, startOfWeek } from "@/utils";
import { Flex } from "@mantine/core";
import { useMemo } from "react";

type FilterProps = {
  keyword?: string;
  from?: number;
  to?: number;
  types?: string[];
  cateringIds?: string[];
  warehouseReceiptCodes: string[];
  typeOptions: OptionProps[];
  clearable?: boolean;
  onClear: () => void;
  onReload: (keyword?: string) => void;
  onChangeTypes: (value: string[]) => void;
  onChangeCateringIds: (value: string[]) => void;
  onChangeDateRange: (from?: number, to?: number) => void;
};

const Filter = ({
  keyword,
  from = startOfWeek(Date.now()),
  to = endOfWeek(Date.now()),
  types,
  cateringIds,
  warehouseReceiptCodes,
  typeOptions,
  clearable,
  onClear,
  onReload,
  onChangeTypes,
  onChangeCateringIds,
  onChangeDateRange,
}: FilterProps) => {
  const t = useTranslation();
  const { caterings } = useCateringStore();
  const _caterings: OptionProps[] = useMemo(() => {
    return Array.from(caterings.values()).map((p: Department) => ({
      label: p.name,
      value: p.id,
    }));
  }, [caterings]);

  const filterComponent = (
    <Flex
      direction={{ base: "column", sm: "row" }}
      gap={10}
      justify="end"
      align="end"
    >
      <AutocompleteForFilterData
        label={t("Warehouse receipt code")}
        w={{ base: "100%", sm: "20vw" }}
        data={warehouseReceiptCodes}
        defaultValue={keyword}
        onReload={onReload}
      />
      <MultiSelect
        value={cateringIds}
        label={t("Warehouse receipt created by catering")}
        w={{ base: "100%", sm: "20vw" }}
        options={_caterings}
        onChange={onChangeCateringIds}
      />
      <MultiSelect
        value={types}
        label={t("Warehouse receipt type")}
        w={{ base: "100%", sm: "20vw" }}
        options={typeOptions}
        onChange={onChangeTypes}
      />
      <DateRangeInput
        label={t("Warehouse receipt export - import date")}
        from={from}
        to={to}
        onChange={onChangeDateRange}
        w={{ base: "100%", sm: "22vw" }}
      />
      <CustomButton disabled={!clearable} onClick={onClear}>
        {t("Clear")}
      </CustomButton>
    </Flex>
  );

  return (
    <>
      <Flex direction="column" visibleFrom="sm">
        {filterComponent}
      </Flex>
      <ResponsiveFilter>{filterComponent}</ResponsiveFilter>
    </>
  );
};

export default Filter;
