import DateInput from "@/components/common/DateInput";
import Select from "@/components/common/Select";
import useTranslation from "@/hooks/useTranslation";
import { Department } from "@/services/domain";
import useCateringStore from "@/stores/catering.store";
import { OptionProps } from "@/types";
import { Flex } from "@mantine/core";
import { useMemo, useSyncExternalStore } from "react";
import store from "../_meal.store";

const Form = () => {
  const t = useTranslation();
  const { selectedCateringId, date } = useSyncExternalStore(
    store.subscribe,
    store.getSnapshot,
  );
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
        value={selectedCateringId}
        label={t("Meal catering")}
        w="20vw"
        options={_caterings}
        onChange={store.setSelectedCateringId}
      />
      <DateInput
        label={t("Meal date")}
        value={new Date(date)}
        onChangeDate={store.setDate}
        w="20vw"
      />
    </Flex>
  );
};

export default Form;
