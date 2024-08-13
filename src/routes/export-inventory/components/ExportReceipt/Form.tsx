import DateInput from "@/components/common/DateInput";
import Select from "@/components/common/Select";
import useTranslation from "@/hooks/useTranslation";
import {
  Department,
  typeWarehouseExportOptions,
} from "@/services/domain";
import useCateringStore from "@/stores/catering.store";
import { OptionProps } from "@/types";
import { Flex } from "@mantine/core";
import { useMemo, useSyncExternalStore } from "react";
import { typeSchema } from "../../_configs";
import store from "../../_export.store";

const Form = () => {
  const t = useTranslation();
  const { activeCaterings } = useCateringStore();
  const { exportReceipt, form } = useSyncExternalStore(
    store.subscribe,
    store.getSnapshot,
  );

  const [typeOptions] = useMemo(() => {
    return typeWarehouseExportOptions(t);
  }, [t]);

  const caterings: OptionProps[] = useMemo(() => {
    return Array.from(activeCaterings.values()).map(
      (p: Department) => ({
        label: p.name,
        value: p.id,
      }),
    );
  }, [activeCaterings]);

  return (
    <Flex gap={10} justify="end" align="end">
      <DateInput
        label={t("Warehouse receipt date")}
        value={exportReceipt?.date}
        w="20vw"
        disabled
        onChangeDate={() => null}
      />
      {form.type === typeSchema.Values["Export on demand"] && (
        <DateInput
          label={t("Warehouse receipt export date")}
          value={exportReceipt?.receivingDate}
          w="20vw"
          disabled
          onChangeDate={() => null}
        />
      )}
      <Select
        label={t("Warehouse receipt type")}
        value={exportReceipt?.type}
        options={typeOptions}
        onChange={store.setExportReceiptType}
        w="20vw"
      />
      {form.type === typeSchema.Values["Export on demand"] && (
        <Select
          label={t("Warehouse receipt receiving catering")}
          value={exportReceipt?.receivingCateringId}
          options={caterings}
          w="20vw"
          disabled
        />
      )}
    </Flex>
  );
};

export default Form;
