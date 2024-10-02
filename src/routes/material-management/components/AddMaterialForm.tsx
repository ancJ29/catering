import {
  MaterialGroup,
  MaterialOrderCycle,
  MaterialType,
} from "@/auto-generated/api-configs";
import useTranslation from "@/hooks/useTranslation";
import { pushMaterial } from "@/services/domain";
import useMaterialStore from "@/stores/material.store";
import useMetaDataStore from "@/stores/meta-data.store";
import { Text } from "@mantine/core";
import { useForm } from "@mantine/form";
import { modals } from "@mantine/modals";
import { useCallback } from "react";
import {
  _validate,
  initialValues,
  PushMaterialRequest,
} from "../_configs";
import MaterialForm from "./MaterialForm";

type AddMaterialFormProps = {
  initValues?: PushMaterialRequest;
  reOpen: (values: PushMaterialRequest) => void;
};

const AddMaterialForm = ({
  initValues: _initValues,
  reOpen,
}: AddMaterialFormProps) => {
  const t = useTranslation();
  const { reload } = useMaterialStore();
  const { units } = useMetaDataStore();

  const form = useForm<PushMaterialRequest>({
    validate: _validate(t),
    initialValues: _initValues ?? initialValues,
  });

  const handleChangeType = (value: string | null) => {
    form.setFieldValue("others.type", value);
    form.setFieldValue("others.group", null);
  };

  const onSuccess = useCallback(() => {
    reload(true);
    modals.closeAll();
  }, [reload]);

  const submit = useCallback(
    (values: PushMaterialRequest) => {
      modals.openConfirmModal({
        title: t("Add material"),
        children: (
          <Text size="sm">
            {t("Are you sure you want to add new material?")}
          </Text>
        ),
        labels: { confirm: "OK", cancel: t("Cancel") },
        onCancel: () => {
          modals.closeAll();
          reOpen(values);
        },
        onConfirm: async () => {
          const unit = units.find(
            (p) => p.name === values.others.unit,
          );
          if (!unit) {
            return;
          }
          const res = await pushMaterial({
            ...values,
            others: {
              ...values.others,
              group: values.others.group as MaterialGroup,
              type: values.others.type as MaterialType,
              orderCycle: values.others
                .orderCycle as MaterialOrderCycle,
              unit: {
                ...unit,
                unitId: unit?.id || "",
              },
            },
          });
          res?.id && onSuccess();
        },
      });
    },
    [onSuccess, reOpen, t, units],
  );

  return (
    <MaterialForm
      form={form}
      submit={submit}
      buttonText={t("Add")}
      onChangeType={handleChangeType}
    />
  );
};

export default AddMaterialForm;
