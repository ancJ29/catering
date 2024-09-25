import PhoneInput from "@/components/common/PhoneInput";
import useTranslation from "@/hooks/useTranslation";
import {
  addDepartment,
  AddDepartmentRequest,
} from "@/services/domain";
import { Button, Switch, Text, TextInput } from "@mantine/core";
import { useForm } from "@mantine/form";
import { modals } from "@mantine/modals";
import { useCallback } from "react";
import { _validate, initialValues } from "../_configs";

const w = "100%";

type AddCateringFormProps = {
  onSuccess: () => void;
};

const AddCateringForm = ({ onSuccess }: AddCateringFormProps) => {
  const t = useTranslation();
  const form = useForm<AddDepartmentRequest>({
    validate: _validate(t),
    initialValues: initialValues,
  });

  const submit = useCallback(
    (values: AddDepartmentRequest) => {
      modals.openConfirmModal({
        title: t("Add catering"),
        children: (
          <Text size="sm">
            {t("Are you sure you want to add new catering?")}
          </Text>
        ),
        labels: { confirm: "OK", cancel: t("Cancel") },
        onConfirm: async () => {
          const res = await addDepartment(values);
          res?.id && onSuccess();
        },
      });
    },
    [onSuccess, t],
  );

  return (
    <form
      className="c-catering-form-wrapper"
      onSubmit={form.onSubmit(submit)}
    >
      <TextInput
        w={w}
        withAsterisk
        label={t("Name")}
        placeholder={t("Catering name")}
        {...form.getInputProps("name")}
      />
      <TextInput
        w={w}
        label={t("Code")}
        placeholder={t("Code")}
        {...form.getInputProps("code")}
      />
      <PhoneInput
        w={w}
        label={t("Phone")}
        placeholder={t("Phone")}
        onChangeValue={(phone) => form.setFieldValue("phone", phone)}
        {...form.getInputProps("phone")}
      />
      <TextInput
        w={w}
        label={t("Email")}
        placeholder={t("Email")}
        {...form.getInputProps("email")}
      />
      <TextInput
        w={w}
        label={t("Catering short name")}
        placeholder={t("Catering short name")}
        {...form.getInputProps("shortName")}
      />
      <TextInput
        w={w}
        label={t("Catering address")}
        placeholder={t("Catering address")}
        {...form.getInputProps("address")}
      />
      <Switch
        w={w}
        label={t("Central catering")}
        labelPosition="left"
        {...form.getInputProps("others.isCenter")}
      />
      <Button type="submit">{t("Add")}</Button>
    </form>
  );
};

export default AddCateringForm;
