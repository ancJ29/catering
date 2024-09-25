import AutocompleteForFilterData from "@/components/c-catering/AutocompleteForFilterData";
import CustomButton from "@/components/c-catering/CustomButton";
import ResponsiveFilter from "@/components/c-catering/ResponsiveFilter";
import DateRangeInput from "@/components/common/DateRangeInput";
import MultiSelect from "@/components/common/MultiSelect";
import useTranslation from "@/hooks/useTranslation";
import {
  Department,
  statusOrderOptions,
  Supplier,
} from "@/services/domain";
import useCateringStore from "@/stores/catering.store";
import useSupplierStore from "@/stores/supplier.store";
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
  supplierIds?: string[];
  purchaseOrderIds: string[];
  clearable?: boolean;
  onClear: () => void;
  onReload: (keyword?: string) => void;
  onChangeStatuses: (value: string[]) => void;
  onChangeReceivingCateringIds: (value: string[]) => void;
  onChangeSupplierIds: (value: string[]) => void;
  onChangeDateRange: (from?: number, to?: number) => void;
};

const Filter = ({
  keyword,
  from = startOfWeek(Date.now()),
  to = endOfWeek(Date.now()),
  statuses,
  receivingCateringIds,
  supplierIds,
  purchaseOrderIds,
  clearable,
  onClear,
  onReload,
  onChangeStatuses,
  onChangeReceivingCateringIds,
  onChangeSupplierIds,
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

  const { suppliers } = useSupplierStore();
  const _suppliers: OptionProps[] = useMemo(() => {
    return Array.from(suppliers.values()).map((p: Supplier) => ({
      label: p.name,
      value: p.id,
    }));
  }, [suppliers]);

  const [statusOptions] = useMemo(() => {
    return statusOrderOptions(t);
  }, [t]);

  const filterComponent = (
    <Flex direction="column" gap={10} align="end">
      <Flex align="end" gap={10}>
        <DateRangeInput
          label={t("Purchase order date")}
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
          label={t("Purchase order po code")}
          w={{ base: "100%", sm: "20vw" }}
          data={purchaseOrderIds}
          defaultValue={keyword}
          onReload={onReload}
        />
        <MultiSelect
          value={supplierIds}
          label={t("Purchase order supplier")}
          w={{ base: "100%", sm: "20vw" }}
          options={_suppliers}
          onChange={onChangeSupplierIds}
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
          label={t("Purchase order catering")}
          w={{ base: "100%", sm: "20vw" }}
          options={cateringOptions}
          onChange={onChangeReceivingCateringIds}
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
