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
import { GetInputProps } from "@mantine/form/lib/types";
import { useMemo } from "react";
import { AddPurchaseRequestForm } from "../_config";

type OrderInformationFormProps = {
  values: AddPurchaseRequestForm;
  onChangeValues: (
    key: string,
    value?: string | number | null,
  ) => void;
  getInputProps: GetInputProps<AddPurchaseRequestForm>;
};

const OrderInformationForm = ({
  values,
  onChangeValues,
  getInputProps,
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
      />
      <Select
        label={t("Purchase order type")}
        w={"25vw"}
        options={typeOptions}
        required
        {...getInputProps("type")}
      />
      <Select
        label={t("Purchase order priority")}
        w={"25vw"}
        options={priorityOptions}
        required
        {...getInputProps("priority")}
      />
    </Flex>
  );
};

export default OrderInformationForm;
