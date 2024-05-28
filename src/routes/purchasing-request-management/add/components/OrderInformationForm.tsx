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
import { useMemo } from "react";
import { AddPurchaseRequestForm } from "../_config";

type OrderInformationFormProps = {
  values: AddPurchaseRequestForm;
  onChangeValues: (
    key: string,
    value?: string | number | null,
  ) => void;
};

const OrderInformationForm = ({
  values,
  onChangeValues,
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
    <Flex justify="end" align="end" gap={10}>
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
        value={values.type}
        label={t("Purchase order type")}
        w={"25vw"}
        options={typeOptions}
        onChange={(value) => onChangeValues("type", value)}
        required
      />
      <Select
        value={values.priority}
        label={t("Purchase order priority")}
        w={"25vw"}
        options={priorityOptions}
        onChange={(value) => onChangeValues("priority", value)}
        required
      />
    </Flex>
  );
};

export default OrderInformationForm;
