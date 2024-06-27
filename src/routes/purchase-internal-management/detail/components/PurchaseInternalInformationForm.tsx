import DateTimeInput from "@/components/common/DateTimeInput";
import Select from "@/components/common/Select";
import useTranslation from "@/hooks/useTranslation";
import { Department } from "@/services/domain";
import useCateringStore from "@/stores/catering.store";
import { OptionProps } from "@/types";
import { Flex } from "@mantine/core";
import { useMemo } from "react";
import { PurchaseInternalForm } from "../_config";

type PurchaseInternalInformationFormProps = {
  values: PurchaseInternalForm;
};

const PurchaseInternalInformationForm = ({
  values,
}: PurchaseInternalInformationFormProps) => {
  const t = useTranslation();
  const { activeCaterings } = useCateringStore();

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
        label={t("Purchase internal receiving catering")}
        w="20vw"
        options={_caterings}
        onChange={() => null}
        disabled={true}
      />
      <DateTimeInput
        label={t("Purchase internal date")}
        date={values.deliveryDate}
        onChangeDate={() => null}
        time={values.deliveryTime}
        onChangeTime={() => null}
        w="25vw"
        disabled={true}
      />
      <Select
        value={values.deliveryCateringId}
        label={t("Purchase internal delivery catering")}
        w="20vw"
        options={_caterings}
        onChange={() => null}
        disabled={true}
      />
    </Flex>
  );
};

export default PurchaseInternalInformationForm;
