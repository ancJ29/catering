import DateTimeInput from "@/components/common/DateTimeInput";
import Select from "@/components/common/Select";
import useTranslation from "@/hooks/useTranslation";
import {
  Department,
  typePriorityAndStatusRequestOptions,
} from "@/services/domain";
import useCateringStore from "@/stores/catering.store";
import { OptionProps } from "@/types";
import { Flex } from "@mantine/core";
import { useMemo } from "react";
import { PurchaseCoordinationForm } from "../_config";

type PurchaseCoordinationInformationFormProps = {
  values: PurchaseCoordinationForm;
};

const PurchaseCoordinationInformationForm = ({
  values,
}: PurchaseCoordinationInformationFormProps) => {
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
    <Flex justify="end" align="end" gap={10}>
      <Select
        value={values.receivingCateringId}
        label={t("Purchase coordination catering")}
        w="25vw"
        options={_caterings}
        onChange={() => null}
        disabled={true}
      />
      <DateTimeInput
        label={t("Purchase request date")}
        date={values.deliveryDate}
        onChangeDate={() => null}
        time={values.deliveryTime}
        onChangeTime={() => null}
        w="25vw"
        disabled={true}
      />
      <Select
        value={values.type}
        label={t("Purchase request type")}
        w="25vw"
        options={typeOptions}
        disabled={true}
      />
      <Select
        value={values.priority}
        label={t("Purchase request priority")}
        w="25vw"
        options={priorityOptions}
        disabled={true}
      />
    </Flex>
  );
};

export default PurchaseCoordinationInformationForm;
