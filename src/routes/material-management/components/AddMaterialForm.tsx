import {
  MaterialGroup,
  MaterialOrderCycle,
  MaterialType,
} from "@/auto-generated/api-configs";
import Autocomplete from "@/components/common/Autocomplete";
import Select from "@/components/common/Select";
import useTranslation from "@/hooks/useTranslation";
import {
  materialOrderCycleOptions,
  pushMaterial,
  typeAndGroupOptions,
} from "@/services/domain";
import useMetaDataStore, { Unit } from "@/stores/meta-data.store";
import { Button, Text, TextInput } from "@mantine/core";
import { useForm } from "@mantine/form";
import { modals } from "@mantine/modals";
import { useCallback, useMemo } from "react";
import {
  _validate,
  initialValues,
  PushMaterialRequest,
} from "../_configs";

const w = "100%";

type AddMaterialFormProps = {
  onSuccess: () => void;
};

const AddMaterialForm = ({ onSuccess }: AddMaterialFormProps) => {
  const t = useTranslation();
  const { units, materialGroupByType } = useMetaDataStore();

  const form = useForm<PushMaterialRequest>({
    validate: _validate(t),
    initialValues: initialValues,
  });

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

  const handleChangeType = (value: string | null) => {
    form.setFieldValue("others.type", value);
    form.setFieldValue("others.group", null);
  };

  const submit = useCallback(
    (values: PushMaterialRequest) => {
      modals.openConfirmModal({
        title: t("Add material"),
        children: (
          <Text size="sm">
            {t("Are you sure you want to add new material?")}
          </Text>
        ),
        labels: { confirm: "OK", cancel: t("Cancel") },
        onConfirm: async () => {
          const unit = units.find(
            (p) => p.name === values.others.unit,
          );
          if (!unit) {
            return;
          }
          const res = await pushMaterial({
            ...values,
            others: {
              ...values.others,
              group: values.others.group as MaterialGroup,
              type: values.others.type as MaterialType,
              orderCycle: values.others
                .orderCycle as MaterialOrderCycle,
              unit: {
                ...unit,
                unitId: unit?.id || "",
              },
            },
          });
          res?.id && onSuccess();
        },
      });
    },
    [onSuccess, t, units],
  );

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
        label={t("Material code")}
        placeholder={t("Material code")}
        {...form.getInputProps("others.internalCode")}
      />
      <Select
        withAsterisk
        label={t("Material type")}
        value={form.values.others.type}
        onChange={handleChangeType}
        w={w}
        options={typeOptions}
        error={form.errors["others.type"]}
      />
      <Select
        withAsterisk
        label={t("Material group")}
        w={w}
        options={groupOptions}
        {...form.getInputProps("others.group")}
      />
      <Select
        withAsterisk
        label={t("Material order cycle")}
        w={w}
        options={orderCycleOptions}
        {...form.getInputProps("others.orderCycle")}
      />
      <Autocomplete
        w={w}
        label={t("Material unit")}
        data={_units}
        {...form.getInputProps("others.unit")}
      />
      <Button type="submit">{t("Add")}</Button>
    </form>
  );
};

export default AddMaterialForm;
