import Select from "@/components/common/Select";
import useTranslation from "@/hooks/useTranslation";
import useCateringStore from "@/stores/catering.store";
import useSupplierStore from "@/stores/supplier.store";
import { capitalizeFirstLetter } from "@/utils";
import { Button } from "@mantine/core";
import { DateInput } from "@mantine/dates";
import { useForm } from "@mantine/form";
import { useCallback, useMemo } from "react";
import {
  initialPOSummaryForm,
  modelTypeSchema,
  POSummaryType,
} from "../_configs";
import Description from "./Description";

const w = "100%";

type POSummaryFormProps = {
  onExportExcelBySupplier: (
    deliveryDate: Date,
    supplierId: string,
  ) => void;
  onExportExcelByCatering: (
    deliveryDate: Date,
    cateringId: string,
  ) => void;
};

const POSummaryForm = ({
  onExportExcelBySupplier,
  onExportExcelByCatering,
}: POSummaryFormProps) => {
  const t = useTranslation();
  const isFollowSupplier = modelTypeSchema.Values["Follow supplier"];
  const { activeCaterings } = useCateringStore();
  const { suppliers } = useSupplierStore();
  const form = useForm<POSummaryType>({
    initialValues: initialPOSummaryForm,
    validate: {},
  });

  const modelOptions = useMemo(() => {
    return modelTypeSchema.options.map((e) => ({
      label: t(e),
      value: e,
    }));
  }, [t]);

  const cateringOptions = useMemo(() => {
    return [
      {
        label: capitalizeFirstLetter(t("all caterings")),
        value: "all",
      },
      ...Array.from(activeCaterings.values()).map((c) => ({
        label: c.name,
        value: c.id,
      })),
    ];
  }, [activeCaterings, t]);

  const supplierOptions = useMemo(() => {
    return [
      {
        label: capitalizeFirstLetter(t("all suppliers")),
        value: "all",
      },
      ...Array.from(suppliers.values()).map((s) => ({
        label: s.name,
        value: s.id,
      })),
    ];
  }, [suppliers, t]);

  const submit = useCallback(
    (values: POSummaryType) => {
      if (
        values.model === modelTypeSchema.Values["Follow supplier"]
      ) {
        if (!values.supplierId) {
          form.setFieldError("supplierId", t("Field is required"));
          return;
        }
        onExportExcelBySupplier(
          values.deliveryDate,
          values.supplierId,
        );
      } else {
        if (!values.cateringId) {
          form.setFieldError("cateringId", t("Field is required"));
          return;
        }
        onExportExcelByCatering(
          values.deliveryDate,
          values.cateringId,
        );
      }
    },
    [form, onExportExcelByCatering, onExportExcelBySupplier, t],
  );

  return (
    <form
      className="c-catering-form-wrapper"
      onSubmit={form.onSubmit(submit)}
    >
      <DateInput
        label={t("Purchase order date")}
        w={w}
        valueFormat="DD/MM/YYYY"
        {...form.getInputProps("deliveryDate")}
      />
      <Select
        w={w}
        label={t("Model")}
        options={modelOptions}
        allowDeselect={false}
        {...form.getInputProps("model")}
      />
      {form.values.model === isFollowSupplier ? (
        <Select
          w={w}
          label={t("Supplier name")}
          options={supplierOptions}
          {...form.getInputProps("supplierId")}
        />
      ) : (
        <Select
          w={w}
          label={t("Catering name")}
          options={cateringOptions}
          {...form.getInputProps("cateringId")}
        />
      )}
      <Button type="submit">{t("Export excel")}</Button>
      <Description />
    </form>
  );
};

export default POSummaryForm;
