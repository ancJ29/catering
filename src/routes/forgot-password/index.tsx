import TextCenter from "@/components/common/TextCenter";
import useTranslation from "@/hooks/useTranslation";
import AuthLayout from "@/layouts/Auth";
import { Center, Title } from "@mantine/core";
import ForgotPasswordForm from "./components/ForgotPasswordForm";

const ForgotPassword = () => {
  const t = useTranslation();

  return (
    <AuthLayout>
      <Center>
        <Title fz={42} fw={900}>
          {t("__App_Title__")}
        </Title>
      </Center>
      <TextCenter>{t("Update password")}</TextCenter>
      <ForgotPasswordForm />
    </AuthLayout>
  );
};

export default ForgotPassword;
