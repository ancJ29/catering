import useTranslation from "@/hooks/useTranslation";
import { Button, Flex, TextInput } from "@mantine/core";
import { ChangeEvent, useCallback } from "react";

type SendMailProps = {
  email: string;
  onChangeEmail: (email: string) => void;
  disabled?: boolean;
};

const SendMail = ({
  email,
  onChangeEmail,
  disabled = false,
}: SendMailProps) => {
  const t = useTranslation();
  const handleChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      onChangeEmail(e?.target.value);
    },
    [onChangeEmail],
  );

  return (
    <Flex gap={10}>
      <TextInput
        value={email}
        onChange={handleChange}
        w="25vw"
        placeholder={t("Save and email to supplier")}
        disabled={disabled}
      />
      <Button disabled={disabled}>{t("Send")}</Button>
    </Flex>
  );
};

export default SendMail;
