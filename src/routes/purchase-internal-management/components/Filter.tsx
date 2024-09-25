import AutocompleteForFilterData from "@/components/c-catering/AutocompleteForFilterData";
import CustomButton from "@/components/c-catering/CustomButton";
import ResponsiveFilter from "@/components/c-catering/ResponsiveFilter";
import DateRangeInput from "@/components/common/DateRangeInput";
import MultiSelect from "@/components/common/MultiSelect";
import useTranslation from "@/hooks/useTranslation";
import { Department, statusInternalOptions } from "@/services/domain";
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
  receivingCateringIds?: string[];
  deliveryCateringIds?: string[];
  purchaseCoordinationIds: string[];
  clearable?: boolean;
  onClear: () => void;
  onReload: (keyword?: string) => void;
  onChangeStatuses: (value: string[]) => void;
  onChangeReceivingCateringIds: (value: string[]) => void;
  onChangeDeliveryCateringIds: (value: string[]) => void;
  onChangeDateRange: (from?: number, to?: number) => void;
};

const Filter = ({
  keyword,
  from = startOfWeek(Date.now()),
  to = endOfWeek(Date.now()),
  statuses,
  receivingCateringIds,
  deliveryCateringIds,
  purchaseCoordinationIds,
  clearable,
  onClear,
  onReload,
  onChangeStatuses,
  onChangeReceivingCateringIds,
  onChangeDeliveryCateringIds,
  onChangeDateRange,
}: FilterProps) => {
  const t = useTranslation();
  const { caterings } = useCateringStore();
  const cateringOptions: OptionProps[] = useMemo(() => {
    return Array.from(caterings.values()).map((p: Department) => ({
      label: p.name,
      value: p.id,
    }));
  }, [caterings]);

  const [statusOptions] = useMemo(() => {
    return statusInternalOptions(t);
  }, [t]);

  const filterComponent = (
    <Flex gap={10} align="end" direction="column">
      <Flex align="end" gap={10}>
        <DateRangeInput
          label={t("Purchase internal date")}
          from={from}
          to={to}
          onChange={onChangeDateRange}
          w={{ base: "100%", sm: "22vw" }}
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
        gap={10}
        w="-webkit-fill-available"
        justify="end"
        direction={{ base: "column", sm: "row" }}
      >
        <AutocompleteForFilterData
          label={t("Purchase internal io code")}
          w={{ base: "100%", sm: "20vw" }}
          data={purchaseCoordinationIds}
          defaultValue={keyword}
          onReload={onReload}
          disabled={false}
        />
        <MultiSelect
          value={statuses}
          label={t("Status")}
          w={{ base: "100%", sm: "20vw" }}
          options={statusOptions}
          onChange={onChangeStatuses}
        />
        <MultiSelect
          value={receivingCateringIds}
          label={t("Purchase internal receiving catering")}
          w={{ base: "100%", sm: "20vw" }}
          options={cateringOptions}
          onChange={onChangeReceivingCateringIds}
        />
        <MultiSelect
          value={deliveryCateringIds}
          label={t("Purchase internal delivery catering")}
          w={{ base: "100%", sm: "20vw" }}
          options={cateringOptions}
          onChange={onChangeDeliveryCateringIds}
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
