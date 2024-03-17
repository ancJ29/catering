import {
  Actions,
  configs as actionConfigs,
  emailSchema,
} from "@/auto-generated/api-configs";
import PhoneInput from "@/components/common/PhoneInput";
import useTranslation from "@/hooks/useTranslation";
import callApi from "@/services/api";
import { Supplier } from "@/services/domain";
import { GenericObject } from "@/types";
import { isVietnamesePhoneNumber } from "@/utils";
import { Button, Text, TextInput } from "@mantine/core";
import { isNotEmpty, useForm } from "@mantine/form";
import { modals } from "@mantine/modals";
import { useCallback } from "react";
import { z } from "zod";

const { request } = actionConfigs[Actions.UPDATE_SUPPLIER].schema;
type Request = z.infer<typeof request>;

const w = "100%";

export type AddSupplierFormProps = {
  reOpen?: (values: Supplier) => void;
  supplier: Supplier;
};

const AddSupplierForm = ({
  supplier,
  reOpen,
}: AddSupplierFormProps) => {
  const t = useTranslation();
  const form = useForm<GenericObject>({
    validate: _validate(t),
    initialValues: {
      id: supplier.id,
      name: supplier.name || "",
      code: supplier.code || "",
      others: {
        email: supplier.others.email || "",
        phone: supplier.others.phone || "",
        contact: supplier.others.contact || "",
        address: supplier.others.address || "",
      },
    },
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
      <PhoneInput
        w={w}
        label={t("Supplier phone")}
        placeholder={t("Supplier phone")}
        onChangeValue={(phone) =>
          form.setFieldValue("others.phone", phone)
        }
        {...form.getInputProps("others.phone")}
      />
      <TextInput
        w={w}
        label={t("Supplier address")}
        placeholder={t("Supplier address")}
        {...form.getInputProps("others.address")}
      />
      <Button type="submit">{t("Save")}</Button>
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
