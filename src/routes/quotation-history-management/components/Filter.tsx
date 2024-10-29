import AutocompleteForFilterData from "@/components/c-catering/AutocompleteForFilterData";
import CustomButton from "@/components/c-catering/CustomButton";
import ResponsiveFilter from "@/components/c-catering/ResponsiveFilter";
import DateRangeInput from "@/components/common/DateRangeInput";
import Select from "@/components/common/Select";
import useTranslation from "@/hooks/useTranslation";
import { typeAndGroupOptions } from "@/services/domain";
import useMetaDataStore from "@/stores/meta-data.store";
import useSupplierStore from "@/stores/supplier.store";
import { Flex } from "@mantine/core";
import { useMemo } from "react";
import { defaultCondition, FilterType } from "../_configs";

type FilterProps = {
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
  setCondition: (
    value: React.SetStateAction<FilterType | undefined>,
  ) => void;
  onChangeDateRange: (from?: number, to?: number) => void;
};

const Filter = ({
  condition,
  keyword,
  names,
  filtered,
  reset,
  reload,
  updateCondition,
  setCondition,
  onChangeDateRange,
}: FilterProps) => {
  const t = useTranslation();
  const { materialGroupByType } = useMetaDataStore();
  const { suppliers } = useSupplierStore();
  const [typeOptions, groupOptions] = useMemo(() => {
    return typeAndGroupOptions(
      materialGroupByType,
      condition?.type || "",
      t,
    );
  }, [materialGroupByType, t, condition?.type]);

  const supplierOptions = useMemo(() => {
    return [
      ...Array.from(suppliers.values()).map((s) => ({
        label: s.name,
        value: s.id,
      })),
    ];
  }, [suppliers]);

  const filterComponent = (
    <Flex
      gap={10}
      align="end"
      justify="end"
      direction={{ base: "column", sm: "row" }}
    >
      <DateRangeInput
        label={t("Applicable date")}
        from={condition?.from}
        to={condition?.to}
        onChange={onChangeDateRange}
        w={{ base: "100%", sm: "22vw" }}
      />
      <Select
        w={{ base: "100%", sm: "15vw" }}
        label={t("Supplier name")}
        options={supplierOptions}
        value={condition?.supplierId}
        onChange={updateCondition.bind(null, "supplierId", "")}
      />
      <Select
        value={condition?.type}
        label={t("Material type")}
        w={{ base: "100%", sm: "15vw" }}
        options={typeOptions}
        onChange={(value) => {
          setCondition({
            ...defaultCondition,
            ...condition,
            type: value || "",
            group: "",
          });
        }}
      />
      <Select
        value={condition?.group}
        label={t("Material group")}
        w={{ base: "100%", sm: "15vw" }}
        options={groupOptions}
        onChange={updateCondition.bind(null, "group", "")}
      />
      <AutocompleteForFilterData
        label={t("Material name")}
        w={{ base: "100%", sm: "15vw" }}
        data={names}
        value={keyword}
        onReload={reload}
      />
      <CustomButton
        mt={{ base: 10, sm: 0 }}
        disabled={!filtered}
        onClick={reset}
      >
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
