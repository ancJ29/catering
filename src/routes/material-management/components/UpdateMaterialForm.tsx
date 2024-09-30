import {
  MaterialGroup,
  MaterialOrderCycle,
  MaterialType,
} from "@/auto-generated/api-configs";
import useTranslation from "@/hooks/useTranslation";
import { Material, pushMaterial } from "@/services/domain";
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

type UpdateMaterialFormProps = {
  material?: Material;
  onSuccess: () => void;
};

const UpdateMaterialForm = ({
  material,
  onSuccess,
}: UpdateMaterialFormProps) => {
  const t = useTranslation();
  const { units } = useMetaDataStore();

  const form = useForm<PushMaterialRequest>({
    validate: _validate(t),
    initialValues: {
      ...(material ?? initialValues),
      id: material?.id || "",
      sku: material?.sku || "",
      others: {
        ...(material?.others ?? initialValues.others),
        unit: material?.others?.unit?.name || "",
      },
    },
  });

  const handleChangeType = (value: string | null) => {
    form.setFieldValue("others.type", value);
    form.setFieldValue("others.group", null);
  };

  const submit = useCallback(
    (values: PushMaterialRequest) => {
      modals.openConfirmModal({
        title: t("Update material"),
        children: (
          <Text size="sm">
            {t("Are you sure you want to update material?")}
          </Text>
        ),
        labels: { confirm: "OK", cancel: t("Cancel") },
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
    [onSuccess, t, units],
  );

  return (
    <MaterialForm
      form={form}
      submit={submit}
      buttonText={t("Save")}
      onChangeType={handleChangeType}
    />
  );
};

export default UpdateMaterialForm;
