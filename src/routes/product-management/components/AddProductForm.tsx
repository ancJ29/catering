import {
  ProductCategory,
  ProductType,
} from "@/auto-generated/api-configs";
import useTranslation from "@/hooks/useTranslation";
import { addProduct } from "@/services/domain";
import useProductStore from "@/stores/product.store";
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

type AddProductFormProps = {
  initValues?: ProductRequest;
  reOpen: (values: ProductRequest) => void;
};

const AddProductForm = ({
  initValues: _initValues,
  reOpen,
}: AddProductFormProps) => {
  const t = useTranslation();
  const { reload } = useProductStore();
  const form = useForm<ProductRequest>({
    validate: _validate(t),
    initialValues: _initValues ?? initialValues,
  });

  const onSuccess = useCallback(() => {
    reload(true);
    modals.closeAll();
  }, [reload]);

  const submit = useCallback(
    (values: ProductRequest) => {
      modals.openConfirmModal({
        title: t("Add product"),
        children: (
          <Text size="sm">
            {t("Are you sure you want to add new product?")}
          </Text>
        ),
        labels: { confirm: "OK", cancel: t("Cancel") },
        onCancel: () => {
          modals.closeAll();
          reOpen(values);
        },
        onConfirm: async () => {
          const res = await addProduct({
            ...values,
            others: {
              ...values.others,
              type: values.others.type as ProductType,
              category: values.others.category as ProductCategory,
            },
          });
          res?.id && onSuccess();
        },
      });
    },
    [onSuccess, reOpen, t],
  );

  return (
    <ProductForm form={form} submit={submit} buttonText={t("Add")} />
  );
};

export default AddProductForm;
