import useTranslation from "@/hooks/useTranslation";
import { Button, Flex, TextInput } from "@mantine/core";
import { UseFormReturnType } from "@mantine/form";
import { PurchaseOrderForm } from "../_configs";

type SendMailProps = {
  form: UseFormReturnType<PurchaseOrderForm>;
  disabled?: boolean;
  onButtonClick: () => void;
};

const SendMail = ({
  form,
  disabled = false,
  onButtonClick,
}: SendMailProps) => {
  const t = useTranslation();

  return (
    <Flex gap={10}>
      <TextInput
        w="25vw"
        placeholder={t("Save and email to supplier")}
        disabled={disabled}
        {...form.getInputProps("email")}
      />
      <Button onClick={onButtonClick} disabled={disabled}>
        {t("Send")}
      </Button>
    </Flex>
  );
};

export default SendMail;
