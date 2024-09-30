import {
  configs as actionConfigs,
  Actions,
} from "@/auto-generated/api-configs";
import useTranslation from "@/hooks/useTranslation";
import callApi from "@/services/api";
import { Supplier } from "@/services/domain";
import { Text } from "@mantine/core";
import { useForm } from "@mantine/form";
import { modals } from "@mantine/modals";
import { useCallback } from "react";
import { z } from "zod";
import { _validate, SupplierRequest } from "../_configs";
import SupplierForm from "./SupplierForm";

const { request } = actionConfigs[Actions.UPDATE_SUPPLIER].schema;
type Request = z.infer<typeof request>;

export type UpdateSupplierFormProps = {
  reOpen?: (values: Supplier) => void;
  supplier: Supplier;
};

const UpdateSupplierForm = ({
  supplier,
  reOpen,
}: UpdateSupplierFormProps) => {
  const t = useTranslation();
  const form = useForm<SupplierRequest>({
    validate: _validate(t),
    initialValues: {
      id: supplier.id,
      name: supplier.name || "",
      code: supplier.code || "",
      others: {
        active: supplier.others.active,
        taxCode: supplier.others.taxCode || "",
        address: supplier.others.address || "",
        email: supplier.others.email || "",
        phone: supplier.others.phone || "",
      },
    },
  });

  const submit = useCallback(
    (values: SupplierRequest) => {
      modals.openConfirmModal({
        title: t("Add user"),
        children: (
          <Text size="sm">
            {t("Are you sure you want to update supplier?")}
          </Text>
        ),
        labels: { confirm: "OK", cancel: t("Cancel") },
        onCancel: () => {
          modals.closeAll();
          const updated = request.parse(values);
          reOpen &&
            reOpen({
              ...supplier,
              ...updated,
              others: updated.others,
            });
        },
        onConfirm: async () => {
          const params = request.parse(values);
          params.others = {
            ...supplier.others,
            ...params.others,
          };

          await callApi<Request, { id: string }>({
            action: Actions.UPDATE_SUPPLIER,
            params,
            options: {
              toastMessage: "Update supplier successfully",
              reloadOnSuccess: true,
            },
          });
        },
      });
    },
    [reOpen, supplier, t],
  );

  return (
    <SupplierForm
      form={form}
      onChangePhone={(phone) =>
        form.setFieldValue("others.phone", phone)
      }
      submit={submit}
      buttonText={t("Save")}
    />
  );
};

export default UpdateSupplierForm;
