import useTranslation from "@/hooks/useTranslation";
import {
  addDepartment,
  AddDepartmentRequest,
} from "@/services/domain";
import { Text } from "@mantine/core";
import { useForm } from "@mantine/form";
import { modals } from "@mantine/modals";
import { useCallback } from "react";
import {
  _validate,
  CateringRequest,
  initialValues,
} from "../_configs";
import CateringForm from "./CateringForm";

type AddCateringFormProps = {
  onSuccess: () => void;
};

const AddCateringForm = ({ onSuccess }: AddCateringFormProps) => {
  const t = useTranslation();
  const form = useForm<CateringRequest>({
    validate: _validate(t),
    initialValues: initialValues,
  });

  const submit = useCallback(
    (values: AddDepartmentRequest) => {
      modals.openConfirmModal({
        title: t("Add catering"),
        children: (
          <Text size="sm">
            {t("Are you sure you want to add new catering?")}
          </Text>
        ),
        labels: { confirm: "OK", cancel: t("Cancel") },
        onConfirm: async () => {
          const res = await addDepartment(values);
          res?.id && onSuccess();
        },
      });
    },
    [onSuccess, t],
  );

  return (
    <CateringForm
      form={form}
      onChangePhone={(phone) => form.setFieldValue("phone", phone)}
      submit={submit}
      buttonText={t("Add")}
    />
  );
};

export default AddCateringForm;
