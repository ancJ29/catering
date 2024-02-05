import useTranslation from "@/hooks/useTranslation";
import { Text } from "@mantine/core";

const ErrorMessage = ({ message }: { message?: string }) => {
  const t = useTranslation();
  return <>{message && <Text c="red">{t(message)}</Text>}</>;
};
export default ErrorMessage;
