import {
  Actions,
  configs as actionConfigs,
} from "@/auto-generated/api-configs";
import TextCenter from "@/components/common/TextCenter";
import useTranslation from "@/hooks/useTranslation";
import callApi from "@/services/api";
import useAuthStore from "@/stores/auth.store";
import {
  Anchor,
  Button,
  Card,
  Checkbox,
  Flex,
  Group,
  PasswordInput,
  Stack,
  TextInput,
} from "@mantine/core";
import { isNotEmpty, useForm } from "@mantine/form";
import { useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { z } from "zod";

const { request, response } = actionConfigs[Actions.LOGIN].schema;
type LoginProps = z.infer<typeof request>;
type LoginResponse = z.infer<typeof response>;

const initialValues: LoginProps = {
  userName: "",
  password: "",
  remember: false,
};

const LoginForm = () => {
  const t = useTranslation();
  const navigate = useNavigate();
  const { setToken } = useAuthStore();

  const form = useForm<LoginProps>({
    initialValues,
    validate: {
      userName: isNotEmpty(t("Please enter email")),
      password: isNotEmpty(t("Please enter password")),
    },
  });

  const login = useCallback(
    async ({ password, userName, remember }: LoginProps) => {
      const res = await callApi<unknown, LoginResponse>({
        params: {
          password: password.trim(),
          userName: userName.trim(),
          remember,
        },
        action: Actions.LOGIN,
      });
      if (res?.token) {
        setToken(res.token, form.values.remember);
        navigate("/dashboard");
      } else {
        form.setErrors({
          password: t("Username or password is incorrect."),
        });
      }
    },
    [form, navigate, setToken, t],
  );
  return (
    <Card withBorder shadow="md" radius={10} mt="1rem">
      <Stack gap="xs" p=".5rem" pt={0}>
        <form onSubmit={form.onSubmit(login)}>
          <TextInput
            withAsterisk
            pb=".8rem"
            label={t("Username")}
            placeholder={t("Enter username")}
            {...form.getInputProps("userName")}
          />
          <PasswordInput
            withAsterisk
            label={t("Password")}
            placeholder={t("Enter password")}
            {...form.getInputProps("password")}
          />
          <Group justify="flex-start" mt="xl">
            <Flex w="100%" fz="0.8rem" justify="space-between">
              <Checkbox
                {...form.getInputProps("remember")}
                label={t("Remember me")}
              />
              <Anchor href="/forgot-password" underline="never">
                <TextCenter
                  // TODO: use common style
                  style={{
                    fontSize: "1rem",
                    fontWeight: "500",
                    color: "var(--input-label-color)",
                  }}
                >
                  {t("Forgot your password")}?
                </TextCenter>
              </Anchor>
            </Flex>
            <Button type="submit" w="100%">
              {t("Sign in")}
            </Button>
          </Group>
        </form>
      </Stack>
    </Card>
  );
};

export default LoginForm;
