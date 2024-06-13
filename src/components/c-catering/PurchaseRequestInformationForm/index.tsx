import DateTimeInput from "@/components/common/DateTimeInput";
import Select from "@/components/common/Select";
import useTranslation from "@/hooks/useTranslation";
import {
  Department,
  typePriorityAndStatusRequestOptions,
} from "@/services/domain";
import useCateringStore from "@/stores/catering.store";
import { OptionProps, PurchaseRequestForm } from "@/types";
import { Flex } from "@mantine/core";
import { FormErrors, GetInputProps } from "@mantine/form/lib/types";
import { useMemo } from "react";

type PurchaseRequestInformationFormProps = {
  values: PurchaseRequestForm;
  onChangeValues: (
    key: string,
    value?: string | number | null,
  ) => void;
  getInputProps: GetInputProps<PurchaseRequestForm>;
  errors: FormErrors;
  disabled?: boolean;
};

const PurchaseRequestInformationForm = ({
  values,
  onChangeValues,
  getInputProps,
  errors,
  disabled = false,
}: PurchaseRequestInformationFormProps) => {
  const t = useTranslation();
  const { activeCaterings } = useCateringStore();

  const [typeOptions, priorityOptions] = useMemo(() => {
    return typePriorityAndStatusRequestOptions(t);
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
        label={t("Purchase request kitchen")}
        w={"25vw"}
        options={_caterings}
        onChange={(value) => onChangeValues("departmentId", value)}
        required
        error={errors["departmentId"]}
        disabled={disabled}
      />
      <DateTimeInput
        label={t("Purchase request date")}
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
        label={t("Purchase request type")}
        w={"25vw"}
        options={typeOptions}
        required
        {...getInputProps("type")}
        disabled={disabled}
      />
      <Select
        label={t("Purchase request priority")}
        w={"25vw"}
        options={priorityOptions}
        required
        {...getInputProps("priority")}
        disabled={disabled}
      />
    </Flex>
  );
};

export default PurchaseRequestInformationForm;
