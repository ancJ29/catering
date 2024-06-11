import Select from "@/components/common/Select";
import useTranslation from "@/hooks/useTranslation";
import { Department } from "@/services/domain";
import useCateringStore from "@/stores/catering.store";
import { OptionProps } from "@/types";
import { Button, Flex, Text } from "@mantine/core";
import { useMemo } from "react";

type SupplyProps = {
  onChangeCateringSupplier: (value: string | null) => void;
  onPurchaseOutside: () => void;
  onPurchaseInternal: () => void;
};

const Supply = ({
  onChangeCateringSupplier,
  onPurchaseOutside,
  onPurchaseInternal
}: SupplyProps) => {
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
    <Flex justify="start" align="center" gap={10}>
      <Text>{t("The kitchen delivers the entire order")}</Text>
      <Select
        value={""}
        w={"15vw"}
        options={_caterings}
        onChange={onChangeCateringSupplier}
        required
      />
      <Button onClick={onPurchaseOutside}>
        {t("All outside purchase")}
      </Button>
      <Button onClick={onPurchaseInternal}>
        {t("All internal purchase")}
      </Button>
    </Flex>
  );
};

export default Supply;
