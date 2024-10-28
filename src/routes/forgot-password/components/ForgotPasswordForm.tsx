import {
  Actions,
  configs as actionConfigs,
} from "@/auto-generated/api-configs";
import useTranslation from "@/hooks/useTranslation";
import callApi from "@/services/api";
import {
  Button,
  Card,
  PasswordInput,
  TextInput,
} from "@mantine/core";
import { isNotEmpty, useForm } from "@mantine/form";
import { useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { z } from "zod";

const { request } = actionConfigs[Actions.CHANGE_PASSWORD].schema;
type ChangePasswordProps = z.infer<typeof request>;

type FormProps = {
  userName: string;
  currentPassword: string;
  newPassword: string;
  reNewPassword: string;
};
const initialValues: FormProps = {
  userName: "",
  currentPassword: "",
  newPassword: "",
  reNewPassword: "",
};

const ForgotPasswordForm = () => {
  const t = useTranslation();
  const navigate = useNavigate();
  const form = useForm<FormProps>({
    initialValues,
    validate: {
      userName: isNotEmpty(t("Field is required")),
      currentPassword: isNotEmpty(t("Field is required")),
      newPassword: isNotEmpty(t("Field is required")),
      reNewPassword: (value, values) =>
        value !== values.newPassword
          ? t("The passwords did not match")
          : null,
    },
  });

  const changePassword = useCallback(
    async (values: FormProps) => {
      const res = await callApi<ChangePasswordProps, unknown>({
        action: Actions.CHANGE_PASSWORD,
        params: {
          userName: values.userName.trim().toString(),
          password: values.newPassword.trim().toString(),
          currentPassword: values.currentPassword.trim().toString(),
        },
        options: {
          toastMessage: "Password updated",
        },
      });
      if (res) {
        navigate("/login");
      } else {
        form.setErrors({
          currentPassword: t("Username or password is incorrect."),
        });
      }
    },
    [form, navigate, t],
  );

  return (
    <Card withBorder shadow="md" radius={10} mt="1rem" p="1.5rem">
      <form onSubmit={form.onSubmit(changePassword)}>
        <TextInput
          withAsterisk
          pb=".8rem"
          label={t("Username")}
          placeholder={t("Enter username")}
          {...form.getInputProps("userName")}
        />
        <PasswordInput
          pb=".8rem"
          label={t("Password")}
          placeholder={t("Enter password")}
          withAsterisk
          {...form.getInputProps("currentPassword")}
        />
        <PasswordInput
          pb=".8rem"
          label={t("New password")}
          placeholder={t("Enter new password")}
          withAsterisk
          {...form.getInputProps("newPassword")}
        />
        <PasswordInput
          pb="1rem"
          label={t("Re enter new password")}
          placeholder={t("Re enter new password")}
          withAsterisk
          {...form.getInputProps("reNewPassword")}
        />
        <Button type="submit" w="100%">
          {t("Save")}
        </Button>
      </form>
    </Card>
  );
};

export default ForgotPasswordForm;
