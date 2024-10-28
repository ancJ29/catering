import {
  Actions,
  configs as actionConfigs,
} from "@/auto-generated/api-configs";
import useTranslation from "@/hooks/useTranslation";
import callApi from "@/services/api";
import { randomPassword } from "@/utils";
import {
  Button,
  Flex,
  InputLabel,
  PasswordInput,
  UnstyledButton,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { modals } from "@mantine/modals";
import { notifications } from "@mantine/notifications";
import { IconCopy } from "@tabler/icons-react";
import { useCallback } from "react";
import { z } from "zod";
import { User } from "../_configs";

const { request } = actionConfigs[Actions.RESET_PASSWORD].schema;
export type ResetPasswordProps = z.infer<typeof request>;

const w = "100%";

type PasswordForm = {
  id: string;
  password: string;
};

type UpdatePasswordFormProps = {
  user: User;
};

const UpdatePasswordForm = ({ user }: UpdatePasswordFormProps) => {
  const t = useTranslation();
  const form = useForm<PasswordForm>({
    initialValues: {
      id: user.id,
      password: randomPassword(),
    },
  });

  const copyPassword = useCallback(() => {
    navigator.clipboard.writeText(form.values.password);
    notifications.show({
      message: t("Password copied to clipboard"),
    });
  }, [form.values.password, t]);

  const _randomPassword = useCallback(() => {
    form.setFieldValue("password", randomPassword());
  }, [form]);

  const submit = useCallback(async (values: PasswordForm) => {
    await callApi<ResetPasswordProps, unknown>({
      action: Actions.RESET_PASSWORD,
      params: {
        userId: values.id,
        password: values.password.trim().toString(),
      },
      options: {
        toastMessage: "Password updated",
      },
    });
    modals.closeAll();
  }, []);

  return (
    <form
      className="c-catering-form-wrapper"
      onSubmit={form.onSubmit(submit)}
    >
      <Flex w={w} align="end" justify="between" gap={5}>
        <PasswordInput
          w={w}
          disabled
          visible
          label={t("Password")}
          placeholder={t("Password")}
          {...form.getInputProps("password")}
        />
        <UnstyledButton onClick={copyPassword}>
          <IconCopy strokeWidth="1.5" color="black" />
        </UnstyledButton>
      </Flex>
      <Flex w={w} justify="end">
        <InputLabel c="red.5">
          {t(
            "Please copy and keep password safe before update password",
          )}
        </InputLabel>
      </Flex>
      <Flex align="center" gap={10}>
        <Button color="blue" onClick={_randomPassword}>
          {t("Random password")}
        </Button>
        <Button type="submit">{t("Save")}</Button>
      </Flex>
    </form>
  );
};

export default UpdatePasswordForm;
