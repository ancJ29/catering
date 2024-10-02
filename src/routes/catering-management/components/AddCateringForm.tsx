import useTranslation from "@/hooks/useTranslation";
import { addDepartment } from "@/services/domain";
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

type AddCateringFormProps = {
  initValue?: CateringRequest;
  reOpen: (values: CateringRequest) => void;
};

const AddCateringForm = ({
  initValue: _initValue,
  reOpen,
}: AddCateringFormProps) => {
  const t = useTranslation();
  const { reload } = useCateringStore();
  const form = useForm<CateringRequest>({
    validate: _validate(t),
    initialValues: _initValue ?? initialValues,
  });

  const onSuccess = useCallback(() => {
    reload(true);
    modals.closeAll();
  }, [reload]);

  const submit = useCallback(
    (values: CateringRequest) => {
      modals.openConfirmModal({
        title: t("Add catering"),
        children: (
          <Text size="sm">
            {t("Are you sure you want to add new catering?")}
          </Text>
        ),
        labels: { confirm: "OK", cancel: t("Cancel") },
        onCancel: () => {
          modals.closeAll();
          reOpen(values);
        },
        onConfirm: async () => {
          const res = await addDepartment(values);
          res?.id && onSuccess();
        },
      });
    },
    [onSuccess, reOpen, t],
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
