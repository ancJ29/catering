import Select from "@/components/common/Select";
import useTranslation from "@/hooks/useTranslation";
import { Department } from "@/services/domain";
import useCateringStore from "@/stores/catering.store";
import { OptionProps } from "@/types";
import { Button, Flex, Text } from "@mantine/core";
import { IconCheck } from "@tabler/icons-react";
import { useMemo, useSyncExternalStore } from "react";
import store from "../_purchase-coordination-detail.store";

type SupplyProps = {
  currentCateringId: string | null;
  cateringId: string | null;
  onChangeCateringId: (value: string | null) => void;
  onPurchaseOutside: () => void;
  onPurchaseInternal: () => void;
  disabled: boolean;
};

const Supply = ({
  currentCateringId,
  cateringId,
  onChangeCateringId,
  onPurchaseOutside,
  onPurchaseInternal,
  disabled,
}: SupplyProps) => {
  const t = useTranslation();
  const { isAllPurchaseInternal } = useSyncExternalStore(
    store.subscribe,
    store.getSnapshot,
  );
  const { activeCaterings } = useCateringStore();
  const _caterings: OptionProps[] = useMemo(() => {
    return Array.from(activeCaterings.values())
      .map((p: Department) => ({
        label: p.name,
        value: p.id,
      }))
      .filter((e) => e.value !== currentCateringId);
  }, [activeCaterings, currentCateringId]);

  return (
    <Flex justify="start" align="start" gap={10}>
      <Text mt={4}>{t("The kitchen delivers the entire order")}</Text>
      <Select
        value={cateringId}
        w="15vw"
        options={_caterings}
        onChange={onChangeCateringId}
        required
        // disabled={disabled}
        disabled={!isAllPurchaseInternal ?? disabled}
        allowDeselect={false}
      />
      <Button
        leftSection={
          isAllPurchaseInternal === false ? (
            <IconCheck size={16} />
          ) : null
        }
        variant={
          isAllPurchaseInternal === false ? "filled" : "outline"
        }
        onClick={onPurchaseOutside}
        disabled={disabled}
      >
        {t("All outside purchase")}
      </Button>
      <Button
        leftSection={
          isAllPurchaseInternal === true ? (
            <IconCheck size={16} />
          ) : null
        }
        variant={
          isAllPurchaseInternal === true ? "filled" : "outline"
        }
        onClick={onPurchaseInternal}
        disabled={disabled}
      >
        {t("All internal purchase")}
      </Button>
    </Flex>
  );
};

export default Supply;
