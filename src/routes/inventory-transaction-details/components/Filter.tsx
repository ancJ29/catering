import AutocompleteForFilterData from "@/components/c-catering/AutocompleteForFilterData";
import CustomButton from "@/components/c-catering/CustomButton";
import Select from "@/components/common/Select";
import useTranslation from "@/hooks/useTranslation";
import { Department, typeAndGroupOptions } from "@/services/domain";
import useCateringStore from "@/stores/catering.store";
import useMetaDataStore from "@/stores/meta-data.store";
import { OptionProps } from "@/types";
import { Flex, Stack } from "@mantine/core";
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
  const _caterings: OptionProps[] = useMemo(() => {
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

  return (
    <Stack gap={10} align="end">
      <Flex align="end" gap={10}>
        <MonthYearPicker date={date} onChangeDate={onChangeDate} />
        <CustomButton disabled={!clearable} onClick={onClear}>
          {t("Clear")}
        </CustomButton>
      </Flex>
      <Flex gap={10} w="-webkit-fill-available" justify="end">
        <AutocompleteForFilterData
          label={t("Material name")}
          w={"20vw"}
          data={materialNames}
          defaultValue={keyword}
          onReload={onReload}
        />
        <Select
          value={cateringId}
          label={t("Catering name")}
          w={"20vw"}
          options={_caterings}
          onChange={onChangeCateringId}
        />
        <Select
          value={type}
          label={t("Material type")}
          w={"20vw"}
          options={typeOptions}
          onChange={(value) => onChangeType(value || "")}
        />
        <Select
          value={group}
          label={t("Material group")}
          w={"20vw"}
          options={groupOptions}
          onChange={(value) => onChangeGroup(value || "")}
        />
      </Flex>
    </Stack>
  );
};

export default Filter;
