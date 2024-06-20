import AutocompleteForFilterData from "@/components/c-catering/AutocompleteForFilterData";
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

type PurchaseInternalFilterProps = {
  keyword?: string;
  from?: number;
  to?: number;
  statuses?: string[];
  receivingCateringIds?: string[];
  deliveryCateringIds?: string[];
  purchaseCoordinationIds: string[];
  statusOptions: OptionProps[];
  clearable?: boolean;
  onClear: () => void;
  onReload: (keyword?: string) => void;
  onChangeStatuses: (value: string[]) => void;
  onChangeReceivingCateringIds: (value: string[]) => void;
  onChangeDeliveryCateringIds: (value: string[]) => void;
  onChangeDateRange: (from?: number, to?: number) => void;
};

const PurchaseInternalFilter = ({
  keyword,
  from = startOfWeek(Date.now()),
  to = endOfWeek(Date.now()),
  statuses,
  receivingCateringIds,
  deliveryCateringIds,
  purchaseCoordinationIds,
  statusOptions,
  clearable,
  onClear,
  onReload,
  onChangeStatuses,
  onChangeReceivingCateringIds,
  onChangeDeliveryCateringIds,
  onChangeDateRange,
}: PurchaseInternalFilterProps) => {
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
      <Flex gap={10}>
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
          value={receivingCateringIds}
          label={t("Purchase internal receiving catering")}
          w={"20vw"}
          options={_caterings}
          onChange={onChangeReceivingCateringIds}
        />
        <MultiSelect
          value={deliveryCateringIds}
          label={t("Purchase internal delivery catering")}
          w={"20vw"}
          options={_caterings}
          onChange={onChangeDeliveryCateringIds}
        />
      </Flex>
    </Stack>
  );
};

export default PurchaseInternalFilter;
