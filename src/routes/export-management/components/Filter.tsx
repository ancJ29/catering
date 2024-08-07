import CustomButton from "@/components/c-catering/CustomButton";
import DateRangeInput from "@/components/common/DateRangeInput";
import Select from "@/components/common/Select";
import useTranslation from "@/hooks/useTranslation";
import {
  circumstanceWarehouseExportOptions,
  typeWarehouseExportOptions,
} from "@/services/domain";
import { Flex } from "@mantine/core";
import { useMemo } from "react";

type FilterProps = {
  from?: number;
  to?: number;
  type?: string;
  circumstance?: string;
  clearable?: boolean;
  onClear: () => void;
  onChangeType: (value: string) => void;
  onChangeCircumstance: (value: string) => void;
  onChangeDateRange: (from?: number, to?: number) => void;
};

const Filter = ({
  from,
  to,
  type,
  circumstance,
  clearable,
  onClear,
  onChangeType,
  onChangeCircumstance,
  onChangeDateRange,
}: FilterProps) => {
  const t = useTranslation();

  const [typeOptions] = useMemo(() => {
    return typeWarehouseExportOptions(t);
  }, [t]);

  const [circumstanceOptions] = useMemo(() => {
    return circumstanceWarehouseExportOptions(t);
  }, [t]);

  return (
    <Flex gap={10} align="end" justify="end">
      <DateRangeInput
        label={t("Time")}
        from={from}
        to={to}
        onChange={onChangeDateRange}
        w={"22vw"}
      />
      <Select
        value={circumstance}
        label={t("Warehouse receipt case")}
        w={"20vw"}
        options={circumstanceOptions}
        onChange={(value) => onChangeCircumstance(value || "")}
      />
      <Select
        value={type}
        label={t("Warehouse receipt type")}
        w={"20vw"}
        options={typeOptions}
        onChange={(value) => onChangeType(value || "")}
      />
      <CustomButton disabled={!clearable} onClick={onClear}>
        {t("Clear")}
      </CustomButton>
    </Flex>
  );
};

export default Filter;
