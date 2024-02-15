import {
  Actions,
  configs as actionConfigs,
  emailSchema,
} from "@/auto-generated/api-configs";
import PhoneInput from "@/components/common/PhoneInput";
import useTranslation from "@/hooks/useTranslation";
import callApi from "@/services/api";
import { GenericObject } from "@/types";
import { isVietnamesePhoneNumber } from "@/utils";
import { Button, Text, TextInput } from "@mantine/core";
import { isNotEmpty, useForm } from "@mantine/form";
import { modals } from "@mantine/modals";
import { useCallback } from "react";
import { z } from "zod";

const { request } = actionConfigs[Actions.ADD_SUPPLIER].schema;

type Request = z.infer<typeof request>;

type AddSupplierFormProps = {
  reOpen?: (values?: GenericObject) => void;
  initialValues?: GenericObject;
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

const AddSupplierForm = ({
  initialValues: _init,
  reOpen,
}: AddSupplierFormProps) => {
  const t = useTranslation();
  const form = useForm<GenericObject>({
    validate: _validate(t),
    initialValues: _init ?? initialValues,
  });

  const submit = useCallback(
    (values: GenericObject) => {
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
              toastMessage: t("Add supplier successfully"),
              reloadOnSuccess: true,
            },
          });
        },
      });
    },
    [reOpen, t],
  );

  return (
    <form
      className="c-catering-form-wrapper"
      onSubmit={form.onSubmit(submit)}
    >
      <TextInput
        w="100%"
        withAsterisk
        label={t("Supplier name")}
        placeholder={t("Supplier name")}
        {...form.getInputProps("name")}
      />
      <TextInput
        w="100%"
        withAsterisk
        label={t("Supplier code")}
        placeholder={t("Supplier code")}
        {...form.getInputProps("code")}
      />
      <TextInput
        w="100%"
        withAsterisk
        label={t("Supplier contact")}
        placeholder={t("Supplier contact")}
        {...form.getInputProps("others.contact")}
      />
      <TextInput
        w="100%"
        label={t("Supplier email")}
        placeholder={t("Supplier email")}
        {...form.getInputProps("others.email")}
      />
      <PhoneInput
        w="100%"
        label={t("Supplier phone")}
        placeholder={t("Supplier phone")}
        onChangeValue={(phone) => form.setFieldValue("phone", phone)}
        {...form.getInputProps("others.phone")}
      />
      <TextInput
        w="100%"
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
