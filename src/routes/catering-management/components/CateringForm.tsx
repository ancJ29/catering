import PhoneInput from "@/components/common/PhoneInput";
import useTranslation from "@/hooks/useTranslation";
import { Button, Switch, TextInput } from "@mantine/core";
import { UseFormReturnType } from "@mantine/form";
import { CateringRequest } from "../_configs";

const w = "100%";

type CateringFormProps = {
  form: UseFormReturnType<CateringRequest>;
  onChangePhone: (phone: string) => void;
  submit: (value: CateringRequest) => void;
  buttonText: string;
};

const CateringForm = ({
  form,
  onChangePhone,
  submit,
  buttonText,
}: CateringFormProps) => {
  const t = useTranslation();
  return (
    <form
      className="c-catering-form-wrapper"
      onSubmit={form.onSubmit(submit)}
    >
      <TextInput
        w={w}
        withAsterisk
        label={t("Name")}
        placeholder={t("Catering name")}
        {...form.getInputProps("name")}
      />
      <TextInput
        w={w}
        label={t("Code")}
        placeholder={t("Code")}
        {...form.getInputProps("code")}
      />
      <PhoneInput
        w={w}
        label={t("Phone")}
        placeholder={t("Phone")}
        // onChangeValue={(phone) => form.setFieldValue("phone", phone)}
        onChangeValue={onChangePhone}
        {...form.getInputProps("phone")}
      />
      <TextInput
        w={w}
        label={t("Email")}
        placeholder={t("Email")}
        {...form.getInputProps("email")}
      />
      <TextInput
        w={w}
        label={t("Catering short name")}
        placeholder={t("Catering short name")}
        {...form.getInputProps("shortName")}
      />
      <TextInput
        w={w}
        label={t("Catering address")}
        placeholder={t("Catering address")}
        {...form.getInputProps("address")}
      />
      <Switch
        w={w}
        label={t("Central catering")}
        labelPosition="left"
        checked={form.values.others.isCenter}
        {...form.getInputProps("others.isCenter")}
      />
      <Switch
        w={w}
        label={t("Active")}
        labelPosition="left"
        checked={form.values.enabled}
        {...form.getInputProps("enabled")}
      />
      <Button type="submit">{buttonText}</Button>
    </form>
  );
};

export default CateringForm;
