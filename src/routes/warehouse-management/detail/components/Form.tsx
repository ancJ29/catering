import DateInput from "@/components/common/DateInput";
import Select from "@/components/common/Select";
import useTranslation from "@/hooks/useTranslation";
import {
  Department,
  typeWarehouseOptions,
  WarehouseReceipt,
} from "@/services/domain";
import useCateringStore from "@/stores/catering.store";
import { OptionProps } from "@/types";
import { Flex } from "@mantine/core";
import { useMemo } from "react";

type FormProps = {
  warehouse?: WarehouseReceipt;
};

const Form = ({ warehouse }: FormProps) => {
  const t = useTranslation();
  const { activeCaterings } = useCateringStore();

  const cateringOptions: OptionProps[] = useMemo(() => {
    return Array.from(activeCaterings.values()).map(
      (p: Department) => ({
        label: p.name,
        value: p.id,
      }),
    );
  }, [activeCaterings]);

  const [typeOptions] = useMemo(() => {
    return typeWarehouseOptions(t);
  }, [t]);

  return (
    <Flex justify="end" align="end" gap={10}>
      <Select
        value={warehouse?.departmentId}
        label={t("Warehouse receipt created by catering")}
        w="20vw"
        options={cateringOptions}
        onChange={() => null}
        disabled
      />
      <DateInput
        label={t("Warehouse receipt export - import date")}
        value={warehouse?.date}
        onChangeDate={() => null}
        w="20vw"
        disabled
      />
      <Select
        value={warehouse?.others.type}
        label={t("Warehouse receipt type")}
        w="20vw"
        options={typeOptions}
        onChange={() => null}
        disabled
      />
    </Flex>
  );
};

export default Form;
