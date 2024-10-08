import DateTimeInput from "@/components/common/DateTimeInput";
import Select from "@/components/common/Select";
import useTranslation from "@/hooks/useTranslation";
import {
  Department,
  typePriorityAndStatusRequestOptions,
} from "@/services/domain";
import useAuthStore from "@/stores/auth.store";
import useCateringStore from "@/stores/catering.store";
import { OptionProps, PurchaseRequestForm } from "@/types";
import { formatTime, isSameDate } from "@/utils";
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
  disabledPriority?: boolean;
};

const PurchaseRequestInformationForm = ({
  values,
  onChangeValues,
  getInputProps,
  errors,
  disabled = false,
  disabledPriority = false,
}: PurchaseRequestInformationFormProps) => {
  const t = useTranslation();
  const { activeCaterings } = useCateringStore();
  const { isCatering } = useAuthStore();

  const [typeOptions, priorityOptions] = useMemo(() => {
    return typePriorityAndStatusRequestOptions(t);
  }, [t]);

  const cateringOptions: OptionProps[] = useMemo(() => {
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
        options={cateringOptions}
        onChange={(value) => onChangeValues("departmentId", value)}
        required
        error={errors["departmentId"]}
        disabled={isCatering || disabled}
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
        minTime={
          isSameDate(new Date(), new Date(values.deliveryDate))
            ? formatTime(new Date(), "HH:mm")
            : undefined
        }
        maxTime="23:59"
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
        disabled={disabledPriority}
      />
    </Flex>
  );
};

export default PurchaseRequestInformationForm;
