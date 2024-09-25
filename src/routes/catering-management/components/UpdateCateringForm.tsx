import { emailSchema } from "@/auto-generated/api-configs";
import PhoneInput from "@/components/common/PhoneInput";
import useTranslation from "@/hooks/useTranslation";
import {
  Department,
  updateDepartment,
  UpdateDepartmentRequest,
} from "@/services/domain";
import { isVietnamesePhoneNumber } from "@/utils";
import { Button, Switch, Text, TextInput } from "@mantine/core";
import { isNotEmpty, useForm } from "@mantine/form";
import { modals } from "@mantine/modals";
import { useCallback } from "react";
import { initialValues } from "./AddCateringForm";

const w = "100%";

type UpdateCateringFormProps = {
  catering?: Department;
  onSuccess: () => void;
};

const UpdateCateringForm = ({
  catering,
  onSuccess,
}: UpdateCateringFormProps) => {
  const t = useTranslation();
  const form = useForm<UpdateDepartmentRequest>({
    validate: _validate(t),
    initialValues: {
      ...(catering ?? initialValues),
      id: catering?.id || "",
      email: catering?.email || "",
      shortName: catering?.shortName || "",
      address: catering?.address || "",
    },
  });

  const submit = useCallback(
    (values: UpdateDepartmentRequest) => {
      modals.openConfirmModal({
        title: t("Update catering"),
        children: (
          <Text size="sm">
            {t("Are you sure you want to update catering?")}
          </Text>
        ),
        labels: { confirm: "OK", cancel: t("Cancel") },
        onConfirm: async () => {
          await updateDepartment(values);
          onSuccess();
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
        checked={form.values.others.isCenter}
        {...form.getInputProps("others.isCenter")}
      />
      <Switch
        w={w}
        label={t("Active")}
        labelPosition="left"
        checked={form.values.enabled}
        {...form.getInputProps("enabled")}
      />
      <Button type="submit">{t("Save")}</Button>
    </form>
  );
};

export default UpdateCateringForm;

function _validate(t: (s: string) => string) {
  return {
    name: isNotEmpty(t("Field is required")),
    phone: (value: unknown) => {
      if (value) {
        if (typeof value !== "string") {
          return t("Invalid phone number");
        }
        if (value && !isVietnamesePhoneNumber(value)) {
          return t("Invalid phone number");
        }
      }
    },
    email: (value: unknown) => {
      if (value) {
        try {
          emailSchema.parse(value);
        } catch (error) {
          return t("Invalid email");
        }
      }
    },
  };
}
