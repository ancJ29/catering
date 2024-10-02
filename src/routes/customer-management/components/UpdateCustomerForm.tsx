import { CustomerType } from "@/auto-generated/api-configs";
import useTranslation from "@/hooks/useTranslation";
import { Customer, updateCustomer } from "@/services/domain";
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

type UpdateCustomerFormProps = {
  customer: Customer;
  reOpen: (values: Customer) => void;
  onSuccess: () => void;
};

const UpdateCustomerForm = ({
  customer,
  reOpen,
  onSuccess,
}: UpdateCustomerFormProps) => {
  const t = useTranslation();

  const form = useForm<CustomerRequest>({
    validate: _validate(t),
    initialValues: {
      ...(customer ?? initialValues),
      memo: customer.memo || "",
    },
  });

  const submit = useCallback(
    (values: CustomerRequest) => {
      modals.openConfirmModal({
        title: t("Update material"),
        children: (
          <Text size="sm">
            {t("Are you sure you want to update customer?")}
          </Text>
        ),
        labels: { confirm: "OK", cancel: t("Cancel") },
        onCancel: () => {
          modals.closeAll();
          reOpen({
            ...customer,
            ...values,
            others: {
              ...customer.others,
              ...values.others,
              type: values.others.type as CustomerType,
            },
          });
        },
        onConfirm: async () => {
          await updateCustomer({
            ...values,
            id: values?.id || "",
            others: {
              ...values.others,
              type: values.others.type as CustomerType,
            },
          });
          onSuccess();
        },
      });
    },
    [customer, onSuccess, reOpen, t],
  );

  return (
    <CustomerForm
      form={form}
      submit={submit}
      buttonText={t("Save")}
    />
  );
};

export default UpdateCustomerForm;
