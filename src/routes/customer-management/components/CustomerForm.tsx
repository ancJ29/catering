import { customerTypeSchema } from "@/auto-generated/api-configs";
import Select from "@/components/common/Select";
import useTranslation from "@/hooks/useTranslation";
import { Department } from "@/services/domain";
import useCateringStore from "@/stores/catering.store";
import { OptionProps } from "@/types";
import { Button, TextInput } from "@mantine/core";
import { UseFormReturnType } from "@mantine/form";
import { useMemo } from "react";
import { CustomerRequest } from "../_configs";

const w = "100%";

type CustomerFormProps = {
  form: UseFormReturnType<CustomerRequest>;
  submit: (values: CustomerRequest) => void;
  buttonText: string;
};

const CustomerForm = ({
  form,
  submit,
  buttonText,
}: CustomerFormProps) => {
  const t = useTranslation();
  const { caterings } = useCateringStore();

  const cateringOptions: OptionProps[] = useMemo(() => {
    return Array.from(caterings.values()).map((c: Department) => ({
      label: c.name,
      value: c.id,
    }));
  }, [caterings]);

  const typeOptions: OptionProps[] = useMemo(() => {
    return customerTypeSchema.options.map((type) => ({
      label: t(type),
      value: type,
    }));
  }, [t]);

  return (
    <form
      className="c-catering-form-wrapper"
      onSubmit={form.onSubmit(submit)}
    >
      <TextInput
        w={w}
        withAsterisk
        label={t("Customer")}
        placeholder={t("Customer")}
        {...form.getInputProps("name")}
      />
      <TextInput
        w={w}
        withAsterisk
        label={t("Customer code")}
        placeholder={t("Customer code")}
        {...form.getInputProps("code")}
      />
      <Select
        withAsterisk
        label={t("Catering name")}
        placeholder={t("Catering name")}
        w={w}
        options={cateringOptions}
        {...form.getInputProps("others.cateringId")}
      />
      <Select
        withAsterisk
        label={t("Customer type")}
        placeholder={t("Customer type")}
        w={w}
        options={typeOptions}
        {...form.getInputProps("others.type")}
      />
      <TextInput
        w={w}
        label={t("Memo")}
        placeholder={t("Memo")}
        {...form.getInputProps("memo")}
      />
      <Button type="submit">{buttonText}</Button>
    </form>
  );
};

export default CustomerForm;
