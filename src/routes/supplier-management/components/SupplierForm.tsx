import PhoneInput from "@/components/common/PhoneInput";
import Switch from "@/components/common/Switch";
import useTranslation from "@/hooks/useTranslation";
import { Button, TextInput } from "@mantine/core";
import { UseFormReturnType } from "@mantine/form";
import { SupplierRequest } from "../_configs";

const w = "100%";

type SupplierFormProps = {
  form: UseFormReturnType<SupplierRequest>;
  onChangePhone: (phone: string) => void;
  submit: (value: SupplierRequest) => void;
  buttonText: string;
};

const SupplierForm = ({
  form,
  onChangePhone,
  submit,
  buttonText,
}: SupplierFormProps) => {
  const t = useTranslation();

  return (
    <form
      className="c-catering-form-wrapper"
      onSubmit={form.onSubmit(submit)}
    >
      <TextInput
        w={w}
        withAsterisk
        label={t("Supplier name")}
        placeholder={t("Supplier name")}
        {...form.getInputProps("name")}
      />
      <TextInput
        w={w}
        withAsterisk
        label={t("Supplier code")}
        placeholder={t("Supplier code")}
        {...form.getInputProps("code")}
      />
      <TextInput
        w={w}
        label={t("Supplier tax code")}
        placeholder={t("Supplier tax code")}
        {...form.getInputProps("others.taxCode")}
      />
      <TextInput
        w={w}
        label={t("Supplier address")}
        placeholder={t("Supplier address")}
        {...form.getInputProps("others.address")}
      />
      <TextInput
        w={w}
        label={t("Supplier email")}
        placeholder={t("Supplier email")}
        {...form.getInputProps("others.email")}
      />
      <PhoneInput
        w={w}
        label={t("Supplier phone")}
        placeholder={t("Supplier phone")}
        onChangeValue={onChangePhone}
        {...form.getInputProps("others.phone")}
      />
      <Switch
        checked={form.values.others.active}
        w={w}
        label={t("Active")}
        labelPosition="left"
        onChangeValue={(active) =>
          form.setFieldValue("others.active", active)
        }
        {...form.getInputProps("others.active")}
      />
      <Button type="submit">{buttonText}</Button>
    </form>
  );
};

export default SupplierForm;
