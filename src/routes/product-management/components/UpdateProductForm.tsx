import {
  ProductCategory,
  ProductType,
} from "@/auto-generated/api-configs";
import useTranslation from "@/hooks/useTranslation";
import { Product, updateProduct } from "@/services/domain";
import { Text } from "@mantine/core";
import { useForm } from "@mantine/form";
import { modals } from "@mantine/modals";
import { useCallback } from "react";
import {
  _validate,
  initialValues,
  ProductRequest,
} from "../_configs";
import ProductForm from "./ProductForm";

type UpdateProductFormProps = {
  product?: Product;
  onSuccess: () => void;
};

const UpdateProductForm = ({
  product,
  onSuccess,
}: UpdateProductFormProps) => {
  const t = useTranslation();
  const form = useForm<ProductRequest>({
    validate: _validate(t),
    initialValues: {
      ...(product ?? initialValues),
      id: product?.id || "",
      description: product?.description || "",
      others: {
        ...(product?.others ?? initialValues.others),
      },
    },
  });

  const submit = useCallback(
    (values: ProductRequest) => {
      modals.openConfirmModal({
        title: t("Update material"),
        children: (
          <Text size="sm">
            {t("Are you sure you want to update product?")}
          </Text>
        ),
        labels: { confirm: "OK", cancel: t("Cancel") },
        onConfirm: async () => {
          await updateProduct({
            ...values,
            others: {
              ...values.others,
              type: values.others.type as ProductType,
              category: values.others.category as ProductCategory,
            },
          });
          onSuccess();
        },
      });
    },
    [onSuccess, t],
  );

  return (
    <ProductForm form={form} submit={submit} buttonText={t("Save")} />
  );
};

export default UpdateProductForm;
