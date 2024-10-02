import {
  MaterialGroup,
  MaterialOrderCycle,
  MaterialType,
} from "@/auto-generated/api-configs";
import useTranslation from "@/hooks/useTranslation";
import { Material, pushMaterial } from "@/services/domain";
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

type UpdateMaterialFormProps = {
  material: Material;
  reOpen: (values: Material) => void;
};

const UpdateMaterialForm = ({
  material,
  reOpen,
}: UpdateMaterialFormProps) => {
  const t = useTranslation();
  const { reload } = useMaterialStore();
  const { units } = useMetaDataStore();

  const form = useForm<PushMaterialRequest>({
    validate: _validate(t),
    initialValues: {
      ...(material ?? initialValues),
      id: material.id || "",
      sku: material.sku || "",
      others: {
        ...(material.others ?? initialValues.others),
        unit: material.others?.unit?.name || "",
      },
    },
  });

  const handleChangeType = (value: string | null) => {
    form.setFieldValue("others.type", value);
    form.setFieldValue("others.group", null);
  };

  const onSuccess = useCallback(() => {
    reload(true);
    modals.closeAll();
  }, [reload]);

  const findUnit = useCallback(
    (values: PushMaterialRequest) => {
      return units.find((p) => p.name === values.others.unit);
    },
    [units],
  );

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
        onCancel: () => {
          modals.closeAll();
          const unit = findUnit(values);
          if (!unit) {
            return;
          }
          reOpen({
            ...material,
            ...values,
            others: {
              ...material.others,
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
        },
        onConfirm: async () => {
          const unit = findUnit(values);
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
    [findUnit, material, onSuccess, reOpen, t],
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
