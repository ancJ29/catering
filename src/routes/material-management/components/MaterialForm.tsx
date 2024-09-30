import Select from "@/components/common/Select";
import useTranslation from "@/hooks/useTranslation";
import {
  materialOrderCycleOptions,
  typeAndGroupOptions,
} from "@/services/domain";
import useMetaDataStore, { Unit } from "@/stores/meta-data.store";
import { Autocomplete, Button, TextInput } from "@mantine/core";
import { UseFormReturnType } from "@mantine/form";
import { useMemo } from "react";
import { PushMaterialRequest } from "../_configs";

const w = "100%";

type MaterialFormProps = {
  form: UseFormReturnType<PushMaterialRequest>;
  submit: (values: PushMaterialRequest) => void;
  buttonText: string;
  onChangeType: (value: string | null) => void;
};

const MaterialForm = ({
  form,
  submit,
  buttonText,
  onChangeType,
}: MaterialFormProps) => {
  const t = useTranslation();
  const { units, materialGroupByType } = useMetaDataStore();

  const [typeOptions, groupOptions] = useMemo(() => {
    return typeAndGroupOptions(
      materialGroupByType,
      form.values.others.type || "",
      t,
    );
  }, [form, materialGroupByType, t]);

  const [orderCycleOptions] = useMemo(() => {
    return materialOrderCycleOptions(t);
  }, [t]);

  const _units: string[] = useMemo(() => {
    return Array.from(units.values()).map((p: Unit) => p.name);
  }, [units]);

  return (
    <form
      className="c-catering-form-wrapper"
      onSubmit={form.onSubmit(submit)}
    >
      <TextInput
        w={w}
        withAsterisk
        label={t("Material name")}
        placeholder={t("Material name")}
        {...form.getInputProps("name")}
      />
      <TextInput
        w={w}
        withAsterisk
        label={t("Material code")}
        placeholder={t("Material code")}
        {...form.getInputProps("others.internalCode")}
      />
      <Select
        withAsterisk
        label={t("Material type")}
        value={form.values.others.type}
        onChange={onChangeType}
        w={w}
        placeholder={t("Material type")}
        options={typeOptions}
        error={form.errors["others.type"]}
      />
      <Select
        withAsterisk
        label={t("Material group")}
        w={w}
        placeholder={t("Material group")}
        options={groupOptions}
        {...form.getInputProps("others.group")}
      />
      <Select
        withAsterisk
        label={t("Material order cycle")}
        w={w}
        placeholder={t("Material order cycle")}
        options={orderCycleOptions}
        {...form.getInputProps("others.orderCycle")}
      />
      <Autocomplete
        w={w}
        label={t("Material unit")}
        data={_units}
        placeholder={t("Material unit")}
        {...form.getInputProps("others.unit")}
      />
      <Button type="submit">{buttonText}</Button>
    </form>
  );
};

export default MaterialForm;
