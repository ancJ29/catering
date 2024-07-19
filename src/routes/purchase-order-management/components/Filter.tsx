import AutocompleteForFilterData from "@/components/c-catering/AutocompleteForFilterData";
import CustomButton from "@/components/c-catering/CustomButton";
import DateRangeInput from "@/components/common/DateRangeInput";
import MultiSelect from "@/components/common/MultiSelect";
import useTranslation from "@/hooks/useTranslation";
import { Department, Supplier } from "@/services/domain";
import useCateringStore from "@/stores/catering.store";
import useSupplierStore from "@/stores/supplier.store";
import { OptionProps } from "@/types";
import { endOfWeek, startOfWeek } from "@/utils";
import { Flex, Stack } from "@mantine/core";
import { useMemo } from "react";

type PurchaseOrderFilterProps = {
  keyword?: string;
  from?: number;
  to?: number;
  statuses?: string[];
  receivingCateringIds?: string[];
  supplierIds?: string[];
  purchaseOrderIds: string[];
  statusOptions: OptionProps[];
  clearable?: boolean;
  onClear: () => void;
  onReload: (keyword?: string) => void;
  onChangeStatuses: (value: string[]) => void;
  onChangeReceivingCateringIds: (value: string[]) => void;
  onChangeSupplierIds: (value: string[]) => void;
  onChangeDateRange: (from?: number, to?: number) => void;
};

const PurchaseOrderFilter = ({
  keyword,
  from = startOfWeek(Date.now()),
  to = endOfWeek(Date.now()),
  statuses,
  receivingCateringIds,
  supplierIds,
  purchaseOrderIds,
  statusOptions,
  clearable,
  onClear,
  onReload,
  onChangeStatuses,
  onChangeReceivingCateringIds,
  onChangeSupplierIds,
  onChangeDateRange,
}: PurchaseOrderFilterProps) => {
  const t = useTranslation();
  const { caterings } = useCateringStore();
  const _caterings: OptionProps[] = useMemo(() => {
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

  return (
    <Stack gap={10} align="end">
      <Flex align="end" gap={10}>
        <DateRangeInput
          label={t("Purchase order date")}
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
        <AutocompleteForFilterData
          label={t("Purchase order po code")}
          w={"20vw"}
          data={purchaseOrderIds}
          defaultValue={keyword}
          onReload={onReload}
          disabled={false}
        />
        <MultiSelect
          value={supplierIds}
          label={t("Purchase order supplier")}
          w={"20vw"}
          options={_suppliers}
          onChange={onChangeSupplierIds}
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
          label={t("Purchase order catering")}
          w={"20vw"}
          options={_caterings}
          onChange={onChangeReceivingCateringIds}
        />
      </Flex>
    </Stack>
  );
};

export default PurchaseOrderFilter;
