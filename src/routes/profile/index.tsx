import {
  Actions,
  configs as actionConfigs,
} from "@/auto-generated/api-configs";
import useTranslation from "@/hooks/useTranslation";
import callApi from "@/services/api";
import logger from "@/services/logger";
import useAuthStore from "@/stores/auth.store";
import {
  Button,
  Flex,
  PasswordInput,
  TextInput,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { useCallback } from "react";
import { z } from "zod";
const { request } = actionConfigs[Actions.CHANGE_PASSWORD].schema;
type ChangePasswordProps = z.infer<typeof request>;

type FormProps = {
  currentPassword: string;
  newPassword: string;
  reNewPassword: string;
};
const initialValues: FormProps = {
  currentPassword: "",
  newPassword: "",
  reNewPassword: "",
};

const Dashboard = () => {
  const t = useTranslation();
  const { user } = useAuthStore();
  const form = useForm<FormProps>({
    initialValues,
    validate: (values: FormProps) => ({
      currentPassword: !values.currentPassword,
      newPassword:
        !values.newPassword ||
        values.newPassword === values.currentPassword,
      reNewPassword: values.newPassword !== values.reNewPassword,
    }),
  });

  const changePassword = useCallback(async () => {
    const res = await callApi<ChangePasswordProps, unknown>({
      action: Actions.CHANGE_PASSWORD,
      params: {
        password: form.values.newPassword.trim().toString(),
        currentPassword: form.values.currentPassword
          .trim()
          .toString(),
      },
      options: {
        toastMessage: t("Password updated"),
      },
    });
    logger.trace("change-password result", res);
    if (res) {
      form.reset();
    } else {
      form.setErrors({ currentPassword: t("Password is incorrect") });
    }
  }, [form, t]);
  return (
    <Flex align="center" justify="center">
      <form onSubmit={form.onSubmit(changePassword)}>
        <TextInput
          disabled
          pb=".8rem"
          w={"30vw"}
          label={t("Username")}
          value={user?.userName}
          placeholder={t("Enter username")}
        />
        <PasswordInput
          pb=".8rem"
          w={"30vw"}
          label={t("Password")}
          placeholder={t("Enter password")}
          {...form.getInputProps("currentPassword")}
        />
        <PasswordInput
          pb=".8rem"
          w={"30vw"}
          label={t("New password")}
          placeholder={t("Enter new password")}
          {...form.getInputProps("newPassword")}
        />
        <PasswordInput
          pb=".8rem"
          w={"30vw"}
          label={t("Re enter new password")}
          placeholder={t("Re enter new password")}
          {...form.getInputProps("reNewPassword")}
        />
        <Button type="submit" disabled={!form.isValid()}>
          {t("Update password")}
        </Button>
      </form>
    </Flex>
  );
};

export default Dashboard;
