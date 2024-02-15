import {
  Actions,
  configs as actionConfigs,
  emailSchema,
} from "@/auto-generated/api-configs";
import useTranslation from "@/hooks/useTranslation";
import callApi from "@/services/api";
import { isVietnamesePhoneNumber } from "@/utils";
import { Button, Text, TextInput } from "@mantine/core";
import { isNotEmpty, useForm } from "@mantine/form";
import { modals } from "@mantine/modals";
import { useCallback } from "react";
import { z } from "zod";

const { request } = actionConfigs[Actions.ADD_SUPPLIER].schema;
type Request = z.infer<typeof request>;

export type Form = Request;
const w = "100%";

export type AddSupplierFormProps = {
  onSuccess: () => void;
};

const initialValues = {
  name: "",
  code: "",
  others: {
    email: "",
    phone: "",
    contact: "",
    address: "",
  },
};

const AddSupplierForm = ({ onSuccess }: AddSupplierFormProps) => {
  const t = useTranslation();
  const form = useForm({
    validate: _validate(t),
    initialValues,
  });

  const submit = useCallback(
    (values: Form) => {
      modals.openConfirmModal({
        title: t("Add user"),
        children: (
          <Text size="sm">
            {t("Are you sure you want to add new supplier?")}
          </Text>
        ),
        labels: { confirm: "OK", cancel: t("Cancel") },
        onConfirm: async () => {
          const res = await callApi<Request, { id: string }>({
            action: Actions.ADD_SUPPLIER,
            params: {
              name: values.name,
              code: values.code,
              others: {
                email: values.others.email?.trim(),
                phone: values.others.phone?.trim(),
                contact: values.others.contact?.trim(),
                address: values.others.address?.trim(),
              },
            },
            options: {
              toastMessage: t("Add supplier successfully"),
            },
          });
          res?.id && onSuccess();
        },
      });
    },
    [onSuccess, t],
  );

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
        withAsterisk
        label={t("Supplier contact")}
        placeholder={t("Supplier contact")}
        {...form.getInputProps("others.contact")}
      />
      <TextInput
        w={w}
        label={t("Supplier email")}
        placeholder={t("Supplier email")}
        {...form.getInputProps("others.email")}
      />
      <TextInput
        w={w}
        label={t("Supplier phone")}
        placeholder={t("Supplier phone")}
        {...form.getInputProps("others.phone")}
      />
      <TextInput
        w={w}
        label={t("Supplier address")}
        placeholder={t("Supplier address")}
        {...form.getInputProps("others.address")}
      />
      <Button type="submit">{t("Add")}</Button>
    </form>
  );
};

export default AddSupplierForm;

function _validate(t: (s: string) => string) {
  return {
    "name": isNotEmpty(t("field is required")),
    "code": isNotEmpty(t("field is required")),
    "others.phone": (value: unknown) => {
      if (value) {
        if (typeof value !== "string") {
          return t("Invalid phone number");
        }
        if (value && !isVietnamesePhoneNumber(value)) {
          return t("Invalid phone number");
        }
      }
    },
    "others.email": (value: unknown) => {
      if (value) {
        try {
          emailSchema.parse(value);
        } catch (error) {
          return t("Invalid email");
        }
      }
    },
  };
}
