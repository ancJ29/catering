import Select from "@/components/common/Select";
import useTranslation from "@/hooks/useTranslation";
import { typeAndCategoryProductOptions } from "@/services/domain";
import { Button, Switch, TextInput } from "@mantine/core";
import { UseFormReturnType } from "@mantine/form";
import { useMemo } from "react";
import { ProductRequest } from "../_configs";

const w = "100%";

type ProductFormProps = {
  form: UseFormReturnType<ProductRequest>;
  submit: (values: ProductRequest) => void;
  buttonText: string;
};

const ProductForm = ({
  form,
  submit,
  buttonText,
}: ProductFormProps) => {
  const t = useTranslation();
  const [typeOptions, categoryOptions] = useMemo(() => {
    return typeAndCategoryProductOptions(t);
  }, [t]);

  return (
    <form
      className="c-catering-form-wrapper"
      onSubmit={form.onSubmit(submit)}
    >
      <TextInput
        w={w}
        withAsterisk
        label={t("Cuisine name")}
        placeholder={t("Cuisine name")}
        {...form.getInputProps("name")}
      />
      <TextInput
        w={w}
        withAsterisk
        label={t("Cuisine code")}
        placeholder={t("Cuisine code")}
        {...form.getInputProps("others.internalCode")}
      />
      <TextInput
        w={w}
        label={t("Cuisine description")}
        placeholder={t("Cuisine description")}
        {...form.getInputProps("description")}
      />
      <Select
        withAsterisk
        label={t("Cuisine type")}
        placeholder={t("Cuisine type")}
        w={w}
        options={typeOptions}
        {...form.getInputProps("others.type")}
      />
      <Select
        withAsterisk
        label={t("Cuisine category")}
        placeholder={t("Cuisine category")}
        w={w}
        options={categoryOptions}
        {...form.getInputProps("others.category")}
      />
      <Switch
        w={w}
        label={t("On sale")}
        labelPosition="left"
        checked={form.values.enabled}
        {...form.getInputProps("enabled")}
      />
      <Button type="submit">{buttonText}</Button>
    </form>
  );
};

export default ProductForm;
