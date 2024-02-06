import LoginForm from "@/components/Login/Form";
import TextCenter from "@/components/common/TextCenter";
import useTranslation from "@/hooks/useTranslation";
import AuthLayout from "@/layouts/Auth";
import useAuthStore from "@/stores/auth.store";
import { Center, Title } from "@mantine/core";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const t = useTranslation();
  const navigate = useNavigate();
  const { user } = useAuthStore();

  useEffect(() => {
    user && navigate("/dashboard");
  }, [navigate, user]);

  return (
    <AuthLayout>
      <Center>
        <Title fz={42} fw={900}>
          {t("__App_Title__")}
        </Title>
      </Center>
      <TextCenter>{t("Sign in to continue")}.</TextCenter>
      <LoginForm />
    </AuthLayout>
  );
};

export default Login;
