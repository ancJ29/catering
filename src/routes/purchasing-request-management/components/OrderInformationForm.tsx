import DateTimeInput from "@/components/common/DateTimeInput";
import Select from "@/components/common/Select";
import useTranslation from "@/hooks/useTranslation";
import {
  Department,
  typeStatusAndPriorityOptions,
} from "@/services/domain";
import useCateringStore from "@/stores/catering.store";
import { OptionProps } from "@/types";
import { Flex } from "@mantine/core";
import { FormErrors, GetInputProps } from "@mantine/form/lib/types";
import { useMemo } from "react";
import { AddPurchaseRequestForm } from "../add/_config";

type OrderInformationFormProps = {
  values: AddPurchaseRequestForm;
  onChangeValues: (
    key: string,
    value?: string | number | null,
  ) => void;
  getInputProps: GetInputProps<AddPurchaseRequestForm>;
  errors: FormErrors;
  disabled?: boolean;
};

const OrderInformationForm = ({
  values,
  onChangeValues,
  getInputProps,
  errors,
  disabled = false,
}: OrderInformationFormProps) => {
  const t = useTranslation();
  const { activeCaterings } = useCateringStore();

  const [typeOptions, priorityOptions] = useMemo(() => {
    return typeStatusAndPriorityOptions(t);
  }, [t]);

  const _caterings: OptionProps[] = useMemo(() => {
    return Array.from(activeCaterings.values()).map(
      (p: Department) => ({
        label: p.name,
        value: p.id,
      }),
    );
  }, [activeCaterings]);

  return (
    <Flex justify="start" align="start" gap={10}>
      <Select
        value={values.departmentId}
        label={t("Purchase order kitchen")}
        w={"25vw"}
        options={_caterings}
        onChange={(value) => onChangeValues("departmentId", value)}
        required
        error={errors["departmentId"]}
        disabled={disabled}
      />
      <DateTimeInput
        label={t("Purchase order date")}
        date={values.deliveryDate}
        onChangeDate={(value) =>
          onChangeValues("deliveryDate", value)
        }
        minDate={new Date()}
        time={values.deliveryTime}
        onChangeTime={(value) =>
          onChangeValues("deliveryTime", value)
        }
        w={"25vw"}
        required
        disabled={disabled}
      />
      <Select
        label={t("Purchase order type")}
        w={"25vw"}
        options={typeOptions}
        required
        {...getInputProps("type")}
        disabled={disabled}
      />
      <Select
        label={t("Purchase order priority")}
        w={"25vw"}
        options={priorityOptions}
        required
        {...getInputProps("priority")}
        disabled={disabled}
      />
    </Flex>
  );
};

export default OrderInformationForm;
