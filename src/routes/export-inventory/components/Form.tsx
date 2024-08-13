import DateInput from "@/components/common/DateInput";
import RadioGroup from "@/components/common/RadioGroup";
import Select from "@/components/common/Select";
import useTranslation from "@/hooks/useTranslation";
import { Flex } from "@mantine/core";
import { useMemo, useSyncExternalStore } from "react";
import { caseByType, casesAndTypes } from "../_configs";
import store from "../_export.store";

const Form = () => {
  const t = useTranslation();
  const { form } = useSyncExternalStore(
    store.subscribe,
    store.getSnapshot,
  );

  const [cases, types] = useMemo(() => {
    return casesAndTypes(caseByType, form.case || "");
  }, [form.case]);

  return (
    <Flex gap={10} align="end" justify="end">
      <RadioGroup
        value={form.case}
        label={t("Warehouse receipt case")}
        data={cases}
        onChange={store.setCase}
        w="22vw"
      />
      <Select
        value={form.type}
        label={t("Warehouse receipt type")}
        data={types}
        onChange={store.setType}
        w="20vw"
      />
      <DateInput
        label={t("Time")}
        value={form.date}
        w="20vw"
        onChangeDate={store.setDate}
      />
    </Flex>
  );
};

export default Form;
