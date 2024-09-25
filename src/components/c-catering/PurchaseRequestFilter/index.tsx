import DateRangeInput from "@/components/common/DateRangeInput";
import MultiSelect from "@/components/common/MultiSelect";
import useTranslation from "@/hooks/useTranslation";
import { Department } from "@/services/domain";
import useAuthStore from "@/stores/auth.store";
import useCateringStore from "@/stores/catering.store";
import { OptionProps } from "@/types";
import { ONE_DAY } from "@/utils";
import { Flex } from "@mantine/core";
import { useMemo } from "react";
import AutocompleteForFilterData from "../AutocompleteForFilterData";
import CustomButton from "../CustomButton";

type PurchaseOrderFilterProps = {
  keyword?: string;
  from?: number;
  to?: number;
  types?: string[];
  priorities?: string[];
  statuses?: string[];
  departmentIds?: string[];
  purchaseOrderIds: string[];
  typeOptions: OptionProps[];
  priorityOptions: OptionProps[];
  statusOptions: OptionProps[];
  clearable?: boolean;
  onClear: () => void;
  onReload: (keyword?: string) => void;
  onChangeTypes: (value: string[]) => void;
  onChangePriorities: (value: string[]) => void;
  onChangeStatuses: (value: string[]) => void;
  onChangeDepartmentIds: (value: string[]) => void;
  onChangeDateRange: (from?: number, to?: number) => void;
  showStatusSelect?: boolean;
};

const PurchaseRequestFilter = ({
  keyword,
  from = Date.now() - ONE_DAY,
  to = Date.now() + ONE_DAY,
  types,
  priorities,
  statuses,
  departmentIds,
  purchaseOrderIds,
  typeOptions,
  priorityOptions,
  statusOptions,
  clearable,
  onClear,
  onReload,
  onChangeTypes,
  onChangePriorities,
  onChangeStatuses,
  onChangeDepartmentIds,
  onChangeDateRange,
  showStatusSelect = true,
}: PurchaseOrderFilterProps) => {
  const t = useTranslation();
  const { caterings } = useCateringStore();
  const { isCatering } = useAuthStore();
  const _caterings: OptionProps[] = useMemo(() => {
    return Array.from(caterings.values()).map((p: Department) => ({
      label: p.name,
      value: p.id,
    }));
  }, [caterings]);

  return (
    <Flex gap={10} align="end" direction="column">
      <Flex align="end" gap={10}>
        <DateRangeInput
          label={t("Purchase request date")}
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
        direction={{ base: "column", sm: "row" }}
        gap={10}
        w="-webkit-fill-available"
        justify="end"
      >
        <AutocompleteForFilterData
          label={t("Purchase request id")}
          w={{ base: "100%", sm: "20vw" }}
          data={purchaseOrderIds}
          defaultValue={keyword}
          onReload={onReload}
          disabled={false}
        />
        <MultiSelect
          value={types}
          label={t("Purchase request type")}
          w={{ base: "100%", sm: "20vw" }}
          options={typeOptions}
          onChange={onChangeTypes}
        />
        <MultiSelect
          value={priorities}
          label={t("Purchase request priority")}
          w={{ base: "100%", sm: "20vw" }}
          options={priorityOptions}
          onChange={onChangePriorities}
        />
        {showStatusSelect && (
          <MultiSelect
            value={statuses}
            label={t("Status")}
            w={{ base: "100%", sm: "20vw" }}
            options={statusOptions}
            onChange={onChangeStatuses}
          />
        )}
        {!isCatering && (
          <MultiSelect
            value={departmentIds}
            label={t("Purchase request kitchen")}
            w={{ base: "100%", sm: "20vw" }}
            options={_caterings}
            onChange={onChangeDepartmentIds}
            disabled={isCatering}
          />
        )}
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
};

export default PurchaseRequestFilter;
