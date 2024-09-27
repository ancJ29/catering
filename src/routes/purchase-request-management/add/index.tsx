import PurchaseActions from "@/components/c-catering/PurchaseActions";
import PurchaseRequestInformationForm from "@/components/c-catering/PurchaseRequestInformationForm";
import useTranslation from "@/hooks/useTranslation";
import useUrlHash from "@/hooks/useUrlHash";
import useAuthStore from "@/stores/auth.store";
import {
  MaterialExcel,
  PurchaseRequestForm,
  initialPurchaseRequestForm,
} from "@/types";
import { formatTime, isSameDate, processExcelFile } from "@/utils";
import { Stack } from "@mantine/core";
import { isNotEmpty, useForm } from "@mantine/form";
import { notifications } from "@mantine/notifications";
import { useCallback, useEffect, useRef, useState } from "react";
import store from "./_add-purchase-request.store";
import ImportMaterials, {
  ImportMaterialAction,
} from "./components/ImportMaterials";
import Table from "./components/Table";

const AddPurchaseRequest = () => {
  const t = useTranslation();
  const { cateringId, isCatering } = useAuthStore();
  const [opened, setOpened] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [selectedSource, setSelectedSource] = useState<string | null>(
    null,
  );
  const [sourceError, setSourceError] = useState("");
  const {
    values,
    setValues,
    setFieldValue,
    validate,
    getInputProps,
    errors,
  } = useForm<PurchaseRequestForm>({
    initialValues: initialPurchaseRequestForm,
    validate: {
      departmentId: isNotEmpty(t("Please select catering")),
      deliveryDate: isNotEmpty(),
      deliveryTime: isNotEmpty(),
      type: isNotEmpty(t("Please select type")),
      priority: isNotEmpty(t("Please select priority")),
    },
  });

  useEffect(() => {
    store.reset();
    if (isCatering) {
      handleChangeValues("departmentId", cateringId);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleChangeSelectedSource = useCallback(
    (selectedSource: string | null, departmentId?: string) => {
      setSelectedSource(selectedSource);
      setSourceError("");
      setOpened(false);
      const _departmentId =
        departmentId !== undefined
          ? departmentId
          : values.departmentId;
      if (_departmentId !== null) {
        switch (selectedSource) {
          case ImportMaterialAction.LOAD_LOW_STOCK:
            store.loadLowInventories(_departmentId);
            break;
          case ImportMaterialAction.LOAD_PERIODIC: {
            setFieldValue("type", "DK");
            store.loadPeriodicInventories(_departmentId);
            break;
          }
          case ImportMaterialAction.LOAD_DAILY_MENU:
            store.loadDailyMenuInventories(_departmentId);
            break;
          case ImportMaterialAction.ADD_MANUALLY: {
            setOpened(true);
            store.reset(_departmentId);
            break;
          }
          case ImportMaterialAction.IMPORT_FROM_EXCEL:
            if (fileInputRef.current) {
              fileInputRef.current.click();
            }
            break;
        }
      }
    },
    [setFieldValue, values.departmentId],
  );

  const handleChangeValues = useCallback(
    (key: string, value?: string | number | null) => {
      if (key in initialPurchaseRequestForm === false) {
        return;
      }
      setFieldValue(key, value);
      if (key === "departmentId") {
        value && store.initBackgroundData(value.toString());
        if (selectedSource !== null) {
          handleChangeSelectedSource(
            selectedSource,
            value as string | undefined,
          );
        }
      }
      if (key === "deliveryDate" && typeof value === "number") {
        if (isSameDate(new Date(), new Date(value))) {
          setFieldValue(
            "deliveryTime",
            formatTime(new Date(), "HH:mm"),
          );
        }
      }
    },
    [handleChangeSelectedSource, selectedSource, setFieldValue],
  );

  const callback = useCallback(
    (values: PurchaseRequestForm) => {
      setValues(values);
      handleChangeValues("deliveryDate", values.deliveryDate);
      values.departmentId &&
        store.initBackgroundData(values.departmentId);
    },
    [handleChangeValues, setValues],
  );
  useUrlHash(values, callback);

  const mapRowToData = (row: string[]): MaterialExcel => ({
    materialInternalCode: row[0],
    amount: Number(row[1]),
  });

  const handleFileUpload = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file) {
        return;
      }
      processExcelFile<MaterialExcel>(
        file,
        mapRowToData,
        (processedData) => {
          store.loadDataFromExcel(processedData);
        },
      );
    },
    [],
  );

  const complete = async () => {
    if (validate().hasErrors || store.getTotalMaterial() === 0) {
      setSourceError(
        selectedSource === null
          ? t("Please select material source")
          : "",
      );
      notifications.show({
        color: "red.5",
        message: t("Please complete all information"),
      });
      return;
    }
    if (!store.checkAllMaterialsPositive()) {
      notifications.show({
        color: "red.5",
        message: t("Please check all the amounts of materials"),
      });
      return;
    }
    const result = await store.createPurchasingRequest(values);
    setValues(initialPurchaseRequestForm);
    setSelectedSource(null);
    if (result) {
      notifications.show({
        color: "blue.5",
        message: t("Add purchase request successfully"),
      });
    } else {
      notifications.show({
        color: "red.5",
        message: t("Add purchase request failed"),
      });
    }
    setFieldValue("departmentId", values.departmentId);
    store.initBackgroundData(values.departmentId || "");
  };

  return (
    <Stack gap={10}>
      <PurchaseActions
        returnUrl="/purchase-request-management"
        completeButtonTitle="Complete"
        complete={complete}
      />
      <PurchaseRequestInformationForm
        values={values}
        onChangeValues={handleChangeValues}
        getInputProps={getInputProps}
        errors={errors}
      />
      <ImportMaterials
        selectedSource={selectedSource}
        onChangeSelectedSource={(value) =>
          handleChangeSelectedSource(value, undefined)
        }
        opened={opened}
        toggle={() => setOpened(!opened)}
        error={sourceError}
      />
      <input
        type="file"
        accept=".xlsx, .xls"
        ref={fileInputRef}
        onChange={handleFileUpload}
        style={{ display: "none" }}
      />
      <Table
        opened={opened}
        showNeedToOrder={
          selectedSource !== ImportMaterialAction.ADD_MANUALLY
        }
      />
    </Stack>
  );
};

export default AddPurchaseRequest;
