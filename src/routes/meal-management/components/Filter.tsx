import DateInput from "@/components/common/DateInput";
import Select from "@/components/common/Select";
import useTranslation from "@/hooks/useTranslation";
import { Department } from "@/services/domain";
import useAuthStore from "@/stores/auth.store";
import useCateringStore from "@/stores/catering.store";
import { OptionProps } from "@/types";
import { Flex } from "@mantine/core";
import { useEffect, useMemo, useSyncExternalStore } from "react";
import store from "../_meal.store";

const Filter = () => {
  const t = useTranslation();
  const { selectedCateringId, date } = useSyncExternalStore(
    store.subscribe,
    store.getSnapshot,
  );
  const { activeCaterings } = useCateringStore();
  const { isCatering, cateringId } = useAuthStore();

  const cateringOptions: OptionProps[] = useMemo(() => {
    return Array.from(activeCaterings.values()).map(
      (p: Department) => ({
        label: p.name,
        value: p.id,
      }),
    );
  }, [activeCaterings]);

  useEffect(() => {
    store.initData(isCatering ? cateringId : null);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Flex justify="end" align="end" gap={10}>
      <Select
        value={selectedCateringId}
        label={t("Meal catering")}
        w={{ base: "40%", sm: "20rem" }}
        options={cateringOptions}
        onChange={store.setSelectedCateringId}
        disabled={isCatering}
      />
      <DateInput
        label={t("Meal date")}
        value={new Date(date)}
        onChangeDate={store.setDate}
        w={{ base: "40%", sm: "20rem" }}
      />
    </Flex>
  );
};

export default Filter;
