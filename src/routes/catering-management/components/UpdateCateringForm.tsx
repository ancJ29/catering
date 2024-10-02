import useTranslation from "@/hooks/useTranslation";
import {
  Department,
  updateDepartment,
  UpdateDepartmentRequest,
} from "@/services/domain";
import useCateringStore from "@/stores/catering.store";
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

type UpdateCateringFormProps = {
  catering: Department;
  reOpen: (values: Department) => void;
};

const UpdateCateringForm = ({
  catering,
  reOpen,
}: UpdateCateringFormProps) => {
  const t = useTranslation();
  const { reload } = useCateringStore();
  const form = useForm<CateringRequest>({
    validate: _validate(t),
    initialValues: {
      ...(catering ?? initialValues),
      id: catering?.id || "",
      email: catering?.email || "",
      shortName: catering?.shortName || "",
      address: catering?.address || "",
      phone: catering?.phone || "",
      others: {
        ...(catering?.others || initialValues.others),
        isCenter: catering?.others?.isCenter || false,
      },
    },
  });

  const onSuccess = useCallback(() => {
    reload(true);
    modals.closeAll();
  }, [reload]);

  const submit = useCallback(
    (values: UpdateDepartmentRequest) => {
      modals.openConfirmModal({
        title: t("Update catering"),
        children: (
          <Text size="sm">
            {t("Are you sure you want to update catering?")}
          </Text>
        ),
        labels: { confirm: "OK", cancel: t("Cancel") },
        onCancel: () => {
          modals.closeAll();
          reOpen({
            ...catering,
            ...values,
          });
        },
        onConfirm: async () => {
          await updateDepartment(values);
          onSuccess();
        },
      });
    },
    [catering, onSuccess, reOpen, t],
  );

  return (
    <CateringForm
      form={form}
      onChangePhone={(phone) => form.setFieldValue("phone", phone)}
      submit={submit}
      buttonText={t("Save")}
    />
  );
};

export default UpdateCateringForm;
