import AutocompleteForFilterData from "@/components/c-catering/AutocompleteForFilterData";
import CustomButton from "@/components/c-catering/CustomButton";
import DateRangeInput from "@/components/common/DateRangeInput";
import MultiSelect from "@/components/common/MultiSelect";
import useTranslation from "@/hooks/useTranslation";
import {
  statusOrderCateringOptions,
  Supplier,
} from "@/services/domain";
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
  supplierIds?: string[];
  purchaseOrderIds: string[];
  clearable?: boolean;
  onClear: () => void;
  onReload: (keyword?: string) => void;
  onChangeStatuses: (value: string[]) => void;
  onChangeSupplierIds: (value: string[]) => void;
  onChangeDateRange: (from?: number, to?: number) => void;
};

const Filter = ({
  keyword,
  from = startOfWeek(Date.now()),
  to = endOfWeek(Date.now()),
  statuses,
  supplierIds,
  purchaseOrderIds,
  clearable,
  onClear,
  onReload,
  onChangeStatuses,
  onChangeSupplierIds,
  onChangeDateRange,
}: FilterProps) => {
  const t = useTranslation();

  const { suppliers } = useSupplierStore();
  const _suppliers: OptionProps[] = useMemo(() => {
    return Array.from(suppliers.values()).map((p: Supplier) => ({
      label: p.name,
      value: p.id,
    }));
  }, [suppliers]);

  const [statusOptions] = useMemo(() => {
    return statusOrderCateringOptions(t);
  }, [t]);

  return (
    <Flex gap={10} justify="end" align="end">
      <AutocompleteForFilterData
        label={t("Purchase order po code")}
        w="20vw"
        data={purchaseOrderIds}
        defaultValue={keyword}
        onReload={onReload}
      />
      <MultiSelect
        value={supplierIds}
        label={t("Purchase order supplier")}
        w="20vw"
        options={_suppliers}
        onChange={onChangeSupplierIds}
      />
      <MultiSelect
        value={statuses}
        label={t("Status")}
        w="22vw"
        options={statusOptions}
        onChange={onChangeStatuses}
      />
      <DateRangeInput
        label={t("Purchase order date")}
        from={from}
        to={to}
        onChange={onChangeDateRange}
        w="22vw"
      />
      <CustomButton disabled={!clearable} onClick={onClear}>
        {t("Clear")}
      </CustomButton>
    </Flex>
  );
};

export default Filter;
