import { CustomerType } from "@/auto-generated/api-configs";
import useTranslation from "@/hooks/useTranslation";
import { addCustomer } from "@/services/domain";
import { Text } from "@mantine/core";
import { useForm } from "@mantine/form";
import { modals } from "@mantine/modals";
import { useCallback } from "react";
import {
  _validate,
  CustomerRequest,
  initialValues,
} from "../_configs";
import CustomerForm from "./CustomerForm";

type AddCustomerFormProps = {
  initValues?: CustomerRequest;
  reOpen: (values: CustomerRequest) => void;
  onSuccess: () => void;
};

const AddCustomerForm = ({
  initValues: _initValues,
  reOpen,
  onSuccess,
}: AddCustomerFormProps) => {
  const t = useTranslation();
  const form = useForm<CustomerRequest>({
    validate: _validate(t),
    initialValues: _initValues ?? initialValues,
  });

  const submit = useCallback(
    (values: CustomerRequest) => {
      modals.openConfirmModal({
        title: t("Add customer"),
        children: (
          <Text size="sm">
            {t("Are you sure you want to add new customer?")}
          </Text>
        ),
        labels: { confirm: "OK", cancel: t("Cancel") },
        onCancel: () => {
          modals.closeAll();
          reOpen(values);
        },
        onConfirm: async () => {
          const res = await addCustomer({
            ...values,
            others: {
              ...values.others,
              type: values.others.type as CustomerType,
            },
          });
          res?.id && onSuccess();
        },
      });
    },
    [onSuccess, reOpen, t],
  );

  return (
    <CustomerForm form={form} submit={submit} buttonText={t("Add")} />
  );
};

export default AddCustomerForm;
