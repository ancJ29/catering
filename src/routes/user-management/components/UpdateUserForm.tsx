import {
  configs as actionConfigs,
  Actions,
  emailSchema,
} from "@/auto-generated/api-configs";
import Autocomplete from "@/components/common/Autocomplete";
import PhoneInput from "@/components/common/PhoneInput";
import useTranslation from "@/hooks/useTranslation";
import callApi from "@/services/api";
import useMetaDataStore from "@/stores/meta-data.store";
import {
  convertToInternationalFormat,
  isVietnamesePhoneNumber,
} from "@/utils";
import { Button, Text, TextInput } from "@mantine/core";
import { isNotEmpty, useForm } from "@mantine/form";
import { modals } from "@mantine/modals";
import { useCallback, useState } from "react";
import { z } from "zod";
import { User } from "../_configs";

const { request } = actionConfigs[Actions.UPDATE_USER].schema;
type Request = z.infer<typeof request>;

type Form = User & {
  role: string;
  department: string;
};

const w = "100%";

const EditUserForm = ({
  user,
  onSuccess,
}: {
  user: User;
  onSuccess: () => void;
}) => {
  const t = useTranslation();
  const data = useMetaDataStore();
  const [options] = useState({
    departmentIdByName: data.departmentIdByName,
    departments: Array.from(data.departmentIdByName.keys()),
    roles: Array.from(data.roleIdByName.keys()).map((name) =>
      t(name),
    ),
    roleIdByName: new Map(
      Array.from(data.roleIdByName.entries()).map(([name, id]) => [
        t(name),
        id,
      ]),
    ),
  });
  const form = useForm<Form>({
    validate: _validate(t),
    initialValues: {
      ...user,
      email: user.email || "",
      phone: user.phone || "",
      role: t(user.roles?.[0]?.name) || "",
      department: user.departments?.[0]?.name || "",
    },
  });

  const submit = useCallback(
    (values: Form) => {
      modals.openConfirmModal({
        title: t("Add user"),
        children: (
          <Text size="sm">
            {t("Are you sure you want to update user?")}
          </Text>
        ),
        labels: { confirm: "OK", cancel: t("Cancel") },
        onConfirm: async () => {
          const res = await callApi<Request, { id: string }>({
            action: Actions.UPDATE_USER,
            params: {
              id: user.id,
              userName: values.userName.trim(),
              fullName: values.fullName.trim(),
              email: values.email?.trim() || undefined,
              phone:
                convertToInternationalFormat(
                  values.phone?.trim() || undefined,
                ) || undefined,
            },
            options: {
              toastMessage: t("Update user successfully"),
            },
          });
          res && onSuccess();
        },
      });
    },
    [t, user.id, onSuccess],
  );

  return (
    <form
      className="c-catering-form-wrapper"
      onSubmit={form.onSubmit(submit)}
    >
      <TextInput
        w={w}
        label={t("Full name")}
        placeholder={t("John Doe")}
        {...form.getInputProps("fullName")}
      />
      <TextInput
        w={w}
        label={t("Username")}
        placeholder={t("Username")}
        {...form.getInputProps("userName")}
      />
      <Autocomplete
        w={w}
        withAsterisk
        disabled
        data={options.roles}
        label={t("Role")}
        {...form.getInputProps("role")}
      />
      <Autocomplete
        w={w}
        disabled
        withAsterisk
        data={options.departments}
        label={t("Department")}
        {...form.getInputProps("department")}
      />
      <TextInput
        w={w}
        label={t("Email")}
        placeholder={t("Email")}
        {...form.getInputProps("email")}
      />
      <PhoneInput
        w={w}
        label={t("Phone")}
        placeholder={t("Phone")}
        onChangeValue={(phone) => form.setFieldValue("phone", phone)}
        {...form.getInputProps("phone")}
      />
      <Button type="submit">{t("Save")}</Button>
    </form>
  );
};

export default EditUserForm;

function _validate(t: (s: string) => string) {
  return {
    userName: isNotEmpty(t("field is required")),
    fullName: isNotEmpty(t("field is required")),
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
