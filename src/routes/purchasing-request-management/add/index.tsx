import useTranslation from "@/hooks/useTranslation";
import useUrlHash from "@/hooks/useUrlHash";
import { Button, Flex, Stack } from "@mantine/core";
import { isNotEmpty, useForm } from "@mantine/form";
import { notifications } from "@mantine/notifications";
import { IconCheck } from "@tabler/icons-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import * as XLSX from "xlsx";
import { AddPurchaseRequestForm, initialValues } from "./_config";
import store from "./_inventory.store";
import ImportMaterials, {
  ImportMaterialAction,
} from "./components/ImportMaterials";
import OrderInformationForm from "./components/OrderInformationForm";
import PurchaseRequestTable from "./components/PurchaseRequestTable";

const AddPurchasingRequest = () => {
  const t = useTranslation();
  const navigate = useNavigate();
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
  } = useForm<AddPurchaseRequestForm>({
    initialValues: initialValues,
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
  }, []);

  const callback = useCallback(
    (values: AddPurchaseRequestForm) => {
      setValues(values);
      values.departmentId &&
        store.initBackgroundData(values.departmentId);
    },
    [setValues],
  );
  useUrlHash(values, callback);

  const handleChangeSelectedSource = useCallback(
    (selectedSource: string | null, departmentId?: string) => {
      setSelectedSource(selectedSource);
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

  const handleFileUpload = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file) {
        return;
      }
      const reader = new FileReader();
      reader.onload = (event) => {
        const binaryStr = event.target?.result as string;
        const workbook = XLSX.read(binaryStr, { type: "binary" });
        const firstSheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[firstSheetName];

        const jsonData = XLSX.utils.sheet_to_json<string[]>(
          worksheet,
          { header: 1 },
        );
        const processedData = (jsonData as string[][])
          .map((row) => ({
            materialInternalCode: row[0],
            amount: Number(row[1]),
          }))
          .filter(
            (row) => row.materialInternalCode && !isNaN(row.amount),
          );
        store.loadDataFromExcel(processedData);
      };
      reader.readAsArrayBuffer(file);
    },
    [],
  );

  const handleChangeValues = useCallback(
    (key: string, value?: string | number | null) => {
      if (key in initialValues === false) {
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
    },
    [handleChangeSelectedSource, selectedSource, setFieldValue],
  );

  const complete = async () => {
    if (validate().hasErrors || store.getTotalMaterial() === 0) {
      selectedSource === null &&
        setSourceError(t("Please select material source"));
      notifications.show({
        color: "red.5",
        message: t("Please complete all information"),
      });
      return;
    }
    await store.createPurchasingRequest(values);
    setValues(initialValues);
    setSelectedSource(null);
    notifications.show({
      color: "green.5",
      message: t("Add purchase request successfully"),
    });
  };

  return (
    <Stack gap={0}>
      <Flex direction="column" gap={10}>
        <Flex justify="end" align="end" gap={10}>
          <Button
            onClick={() => navigate("/purchasing-request-management")}
            variant="outline"
          >
            {t("Return to purchase request list")}
          </Button>
          <Button
            leftSection={<IconCheck size={16} />}
            onClick={complete}
          >
            {t("Complete")}
          </Button>
        </Flex>
        <OrderInformationForm
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
        <PurchaseRequestTable opened={opened} />
      </Flex>
    </Stack>
  );
};

export default AddPurchasingRequest;