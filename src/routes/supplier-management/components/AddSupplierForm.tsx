import {
  configs as actionConfigs,
  Actions,
} from "@/auto-generated/api-configs";
import useTranslation from "@/hooks/useTranslation";
import callApi from "@/services/api";
import { Text } from "@mantine/core";
import { useForm } from "@mantine/form";
import { modals } from "@mantine/modals";
import { useCallback } from "react";
import { z } from "zod";
import { _validate, SupplierRequest } from "../_configs";
import SupplierForm from "./SupplierForm";

const { request } = actionConfigs[Actions.ADD_SUPPLIER].schema;

type Request = z.infer<typeof request>;

type AddSupplierFormProps = {
  reOpen?: (values?: SupplierRequest) => void;
  initialValues?: SupplierRequest;
};

const initialValues = {
  name: "",
  code: "",
  others: {
    active: true,
    taxCode: "",
    email: "",
    phone: "",
    address: "",
  },
};

const AddSupplierForm = ({
  initialValues: _init,
  reOpen,
}: AddSupplierFormProps) => {
  const t = useTranslation();
  const form = useForm<SupplierRequest>({
    validate: _validate(t),
    initialValues: _init ?? initialValues,
  });

  const submit = useCallback(
    (values: SupplierRequest) => {
      modals.openConfirmModal({
        title: t("Add user"),
        children: (
          <Text size="sm">
            {t("Are you sure you want to add new supplier?")}
          </Text>
        ),
        labels: { confirm: "OK", cancel: t("Cancel") },
        onCancel: () => {
          modals.closeAll();
          reOpen && reOpen(values);
        },
        onConfirm: async () => {
          await callApi<Request, { id: string }>({
            action: Actions.ADD_SUPPLIER,
            params: request.parse(values),
            options: {
              toastMessage: "Add supplier successfully",
              reloadOnSuccess: true,
            },
          });
        },
      });
    },
    [reOpen, t],
  );

  return (
    <SupplierForm
      form={form}
      onChangePhone={(phone) =>
        form.setFieldValue("others.phone", phone)
      }
      submit={submit}
      buttonText={t("Add")}
    />
  );
};

export default AddSupplierForm;
