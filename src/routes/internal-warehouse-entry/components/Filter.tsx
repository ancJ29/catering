import AutocompleteForFilterData from "@/components/c-catering/AutocompleteForFilterData";
import CustomButton from "@/components/c-catering/CustomButton";
import DateRangeInput from "@/components/common/DateRangeInput";
import MultiSelect from "@/components/common/MultiSelect";
import useTranslation from "@/hooks/useTranslation";
import {
  Department,
  statusInternalCateringOptions,
} from "@/services/domain";
import useCateringStore from "@/stores/catering.store";
import { OptionProps } from "@/types";
import { endOfWeek, startOfWeek } from "@/utils";
import { Flex } from "@mantine/core";
import { useMemo } from "react";

type FilterProps = {
  keyword?: string;
  from?: number;
  to?: number;
  statuses?: string[];
  deliveryCateringIds?: string[];
  purchaseCoordinationIds: string[];
  clearable?: boolean;
  onClear: () => void;
  onReload: (keyword?: string) => void;
  onChangeStatuses: (value: string[]) => void;
  onChangeDeliveryCateringIds: (value: string[]) => void;
  onChangeDateRange: (from?: number, to?: number) => void;
};

const Filter = ({
  keyword,
  from = startOfWeek(Date.now()),
  to = endOfWeek(Date.now()),
  statuses,
  deliveryCateringIds,
  purchaseCoordinationIds,
  clearable,
  onClear,
  onReload,
  onChangeStatuses,
  onChangeDeliveryCateringIds,
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

  const [statusOptions] = useMemo(() => {
    return statusInternalCateringOptions(t);
  }, [t]);

  return (
    <Flex gap={10} justify="end" align="end">
      <AutocompleteForFilterData
        label={t("Purchase internal io code")}
        w={"20vw"}
        data={purchaseCoordinationIds}
        defaultValue={keyword}
        onReload={onReload}
        disabled={false}
      />
      <MultiSelect
        value={statuses}
        label={t("Status")}
        w={"20vw"}
        options={statusOptions}
        onChange={onChangeStatuses}
      />
      <MultiSelect
        value={deliveryCateringIds}
        label={t("Purchase internal delivery catering")}
        w={"20vw"}
        options={_caterings}
        onChange={onChangeDeliveryCateringIds}
      />
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
  );
};

export default Filter;
