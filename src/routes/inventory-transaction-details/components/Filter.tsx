import AutocompleteForFilterData from "@/components/c-catering/AutocompleteForFilterData";
import CustomButton from "@/components/c-catering/CustomButton";
import ResponsiveFilter from "@/components/c-catering/ResponsiveFilter";
import Select from "@/components/common/Select";
import useTranslation from "@/hooks/useTranslation";
import { Department, typeAndGroupOptions } from "@/services/domain";
import useCateringStore from "@/stores/catering.store";
import useMetaDataStore from "@/stores/meta-data.store";
import { OptionProps } from "@/types";
import { Flex } from "@mantine/core";
import { useMemo } from "react";
import MonthYearPicker from "./MonthYearPicker";

type FilterProps = {
  keyword?: string;
  cateringId?: string;
  type?: string;
  group?: string;
  date: number;
  materialNames: string[];
  clearable?: boolean;
  onClear: () => void;
  onReload: (keyword?: string) => void;
  onChangeCateringId: (value: string | null) => void;
  onChangeType: (value: string | null) => void;
  onChangeGroup: (value: string | null) => void;
  onChangeDate: (date: number) => void;
};

const Filter = ({
  keyword,
  cateringId,
  type,
  group,
  date,
  materialNames,
  clearable,
  onClear,
  onReload,
  onChangeCateringId,
  onChangeType,
  onChangeGroup,
  onChangeDate,
}: FilterProps) => {
  const t = useTranslation();
  const { activeCaterings } = useCateringStore();
  const cateringOptions: OptionProps[] = useMemo(() => {
    return Array.from(activeCaterings.values()).map(
      (p: Department) => ({
        label: p.name,
        value: p.id,
      }),
    );
  }, [activeCaterings]);
  const { materialGroupByType } = useMetaDataStore();
  const [typeOptions, groupOptions] = useMemo(() => {
    return typeAndGroupOptions(materialGroupByType, type || "", t);
  }, [materialGroupByType, t, type]);

  const filterComponent = (
    <Flex direction="column" gap={10} align="end">
      <Flex align="end" gap={10}>
        <MonthYearPicker
          w={{ base: "100%", sm: "22vw" }}
          date={date}
          onChangeDate={onChangeDate}
        />
        <CustomButton
          disabled={!clearable}
          onClick={onClear}
          visibleFrom="sm"
        >
          {t("Clear")}
        </CustomButton>
      </Flex>
      <Flex
        direction={{ base: "column", sm: "row" }}
        gap={10}
        w="-webkit-fill-available"
        justify="end"
      >
        <AutocompleteForFilterData
          label={t("Material name")}
          w={{ base: "100%", sm: "20vw" }}
          data={materialNames}
          defaultValue={keyword}
          onReload={onReload}
        />
        <Select
          value={cateringId}
          label={t("Catering name")}
          w={{ base: "100%", sm: "20vw" }}
          options={cateringOptions}
          onChange={onChangeCateringId}
        />
        <Select
          value={type}
          label={t("Material type")}
          w={{ base: "100%", sm: "20vw" }}
          options={typeOptions}
          onChange={(value) => onChangeType(value || "")}
        />
        <Select
          value={group}
          label={t("Material group")}
          w={{ base: "100%", sm: "20vw" }}
          options={groupOptions}
          onChange={(value) => onChangeGroup(value || "")}
        />
      </Flex>
      <CustomButton
        disabled={!clearable}
        onClick={onClear}
        hiddenFrom="sm"
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
