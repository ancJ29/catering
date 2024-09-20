import {
  ClientRoles,
  emailSchema,
} from "@/auto-generated/api-configs";
import PhoneInput from "@/components/common/PhoneInput";
import useTranslation from "@/hooks/useTranslation";
import {
  addDepartment,
  AddDepartmentRequest,
} from "@/services/domain";
import { isVietnamesePhoneNumber } from "@/utils";
import { Button, Switch, Text, TextInput } from "@mantine/core";
import { isNotEmpty, useForm } from "@mantine/form";
import { modals } from "@mantine/modals";
import { useCallback } from "react";

export const initialValues: AddDepartmentRequest = {
  name: "",
  code: "",
  enabled: true,
  level: 1,
  phone: "",
  email: "",
  shortName: "",
  address: "",
  others: {
    role: ClientRoles.CATERING,
    isCenter: false,
    totalSupplier: 0,
  },
};

const w = "100%";

type AddCateringFormProps = {
  onSuccess: () => void;
};

const AddCateringForm = ({ onSuccess }: AddCateringFormProps) => {
  const t = useTranslation();
  const form = useForm<AddDepartmentRequest>({
    validate: _validate(t),
    initialValues,
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
