import {
  Actions,
  configs as actionConfigs,
} from "@/auto-generated/api-configs";
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
  Text,
  TextInput,
} from "@mantine/core";
import { isNotEmpty, useForm } from "@mantine/form";
import { useCallback, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { z } from "zod";

const { request, response } = actionConfigs[Actions.LOGIN].schema;
type LoginProps = z.infer<typeof request>;
type LoginResponse = z.infer<typeof response>;

const initialValues: LoginProps = {
  userName: "",
  password: "",
  remember: localStorage.__REMEMBER__ === "true",
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

  useEffect(() => {
    form.setFieldValue(
      "remember",
      localStorage.__REMEMBER__ === "true",
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const login = useCallback(
    async ({ password, userName, remember }: LoginProps) => {
      localStorage.__REMEMBER__ = remember?.toString();
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
            <Flex
              direction={{ base: "column", xs: "row" }}
              w="100%"
              fz="0.8rem"
              justify={{ base: "flex-start", xs: "space-between" }}
              gap={{ base: "10px", xs: "0" }}
            >
              <Checkbox
                label={t("Remember me")}
                checked={form.values.remember}
                {...form.getInputProps("remember")}
              />
              <Anchor href="/forgot-password" underline="never">
                <Text
                  // TODO: use common style
                  style={{
                    fontSize: "1rem",
                    fontWeight: "500",
                    color: "var(--input-label-color)",
                  }}
                >
                  {t("Forgot your password")}?
                </Text>
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
