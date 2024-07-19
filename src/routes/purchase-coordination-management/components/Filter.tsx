import CustomButton from "@/components/c-catering/CustomButton";
import DateRangeInput from "@/components/common/DateRangeInput";
import MultiSelect from "@/components/common/MultiSelect";
import useTranslation from "@/hooks/useTranslation";
import { Department } from "@/services/domain";
import useCateringStore from "@/stores/catering.store";
import { OptionProps } from "@/types";
import { endOfWeek, startOfWeek } from "@/utils";
import { Flex, Stack } from "@mantine/core";
import { useMemo } from "react";

type FilterProps = {
  from?: number;
  to?: number;
  types?: string[];
  priorities?: string[];
  statuses?: string[];
  receivingCateringIds?: string[];
  typeOptions: OptionProps[];
  priorityOptions: OptionProps[];
  statusOptions: OptionProps[];
  clearable?: boolean;
  onClear: () => void;
  onChangeTypes: (value: string[]) => void;
  onChangePriorities: (value: string[]) => void;
  onChangeStatuses: (value: string[]) => void;
  onChangeReceivingCateringIds: (value: string[]) => void;
  onChangeDateRange: (from?: number, to?: number) => void;
  showStatusSelect?: boolean;
};

const Filter = ({
  from = startOfWeek(Date.now()),
  to = endOfWeek(Date.now()),
  types,
  priorities,
  statuses,
  receivingCateringIds,
  typeOptions,
  priorityOptions,
  statusOptions,
  clearable,
  onClear,
  onChangeTypes,
  onChangePriorities,
  onChangeStatuses,
  onChangeReceivingCateringIds,
  onChangeDateRange,
  showStatusSelect = true,
}: FilterProps) => {
  const t = useTranslation();
  const { caterings } = useCateringStore();
  const _caterings: OptionProps[] = useMemo(() => {
    return Array.from(caterings.values()).map((p: Department) => ({
      label: p.name,
      value: p.id,
    }));
  }, [caterings]);
  return (
    <Stack gap={10} align="end">
      <Flex align="end" gap={10}>
        <DateRangeInput
          label={t("Purchase internal date")}
          from={from}
          to={to}
          onChange={onChangeDateRange}
          w={"22vw"}
        />
        <CustomButton disabled={!clearable} onClick={onClear}>
          {t("Clear")}
        </CustomButton>
      </Flex>
      <Flex gap={10} w="-webkit-fill-available">
        <MultiSelect
          value={types}
          label={t("Purchase coordination type")}
          w={"20vw"}
          options={typeOptions}
          onChange={onChangeTypes}
        />
        <MultiSelect
          value={priorities}
          label={t("Purchase coordination priority")}
          w={"20vw"}
          options={priorityOptions}
          onChange={onChangePriorities}
        />
        {showStatusSelect && (
          <MultiSelect
            value={statuses}
            label={t("Status")}
            w={"20vw"}
            options={statusOptions}
            onChange={onChangeStatuses}
          />
        )}
        <MultiSelect
          value={receivingCateringIds}
          label={t("Purchase coordination catering")}
          w={"20vw"}
          options={_caterings}
          onChange={onChangeReceivingCateringIds}
        />
      </Flex>
    </Stack>
  );
};

export default Filter;
