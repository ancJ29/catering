import CustomButton from "@/components/c-catering/CustomButton";
import DateRangeInput from "@/components/common/DateRangeInput";
import Select from "@/components/common/Select";
import useTranslation from "@/hooks/useTranslation";
import { typeWarehouseExportOptions } from "@/services/domain";
import { Flex } from "@mantine/core";
import { useMemo } from "react";
import { caseSchema } from "../_configs";

type FilterProps = {
  from?: number;
  to?: number;
  type?: string;
  case?: string;
  clearable?: boolean;
  onClear: () => void;
  onChangeType: (value: string) => void;
  onChangeCase: (value: string) => void;
  onChangeDateRange: (from?: number, to?: number) => void;
};

const Filter = ({
  from,
  to,
  type,
  case: _case,
  clearable,
  onClear,
  onChangeType,
  onChangeCase,
  onChangeDateRange,
}: FilterProps) => {
  const t = useTranslation();

  const [typeOptions] = useMemo(() => {
    return typeWarehouseExportOptions(t);
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
        value={_case}
        label={t("Warehouse receipt case")}
        w={"20vw"}
        data={caseSchema.options}
        onChange={(value) => onChangeCase(value || "")}
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
