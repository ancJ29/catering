import useTranslation from "@/hooks/useTranslation";
import useUrlHash from "@/hooks/useUrlHash";
import { Button, Flex, Stack } from "@mantine/core";
import { isNotEmpty, useForm } from "@mantine/form";
import { notifications } from "@mantine/notifications";
import { IconCheck } from "@tabler/icons-react";
import { useCallback, useState } from "react";
import { AddPurchaseRequestForm, initialValues } from "./_config";
import store from "./_inventory.store";
import ImportMaterials, {
  ImportMaterialAction,
} from "./components/ImportMaterials";
import OrderInformationForm from "./components/OrderInformationForm";
import PurchaseRequestTable from "./components/PurchaseRequestTable";

const AddPurchasingRequest = () => {
  const t = useTranslation();
  const [opened, setOpened] = useState(false);
  const [selectedSource, setSelectedSource] = useState<string | null>(
    null,
  );
  const { values, setValues, setFieldValue, validate } =
    useForm<AddPurchaseRequestForm>({
      initialValues: initialValues,
      validate: {
        departmentId: isNotEmpty(),
        deliveryDate: isNotEmpty(),
        deliveryTime: isNotEmpty(),
        type: isNotEmpty(),
        priority: isNotEmpty(),
      },
    });

  const callback = useCallback(
    (values: AddPurchaseRequestForm) => {
      setValues(values);
    },
    [setValues],
  );
  useUrlHash(values, callback);

  const handleChangeSelectedSource = useCallback(
    (value: string | null, departmentId?: string) => {
      setSelectedSource(value);
      setOpened(false);
      const _departmentId = departmentId !== undefined ? departmentId : values.departmentId;
      if(_departmentId !== null) {
        switch (value) {
          case ImportMaterialAction.LOAD_LOW_STOCK:
            store.loadLowInventories(_departmentId);
            break;
          case ImportMaterialAction.LOAD_DAILY_MENU: {
            store.loadDailyMenuInventories(_departmentId);
            break;
          }
          case ImportMaterialAction.LOAD_PERIODIC:
            store.loadPeriodicInventories(_departmentId);
            break;
          case ImportMaterialAction.ADD_MATERIAL: {
            setOpened(true);
            store.reset(_departmentId);
            break;
          }
        }
      }
    },
    [values.departmentId],
  );

  const handleChangeValues = useCallback(
    (key: string, value?: string | number | null) => {
      if (key in initialValues === false) {
        return;
      }
      setFieldValue(key, value);
      if (key === "departmentId" && selectedSource !== null) {
        handleChangeSelectedSource(
          selectedSource,
          value as string | undefined,
        );
      }
    },
    [handleChangeSelectedSource, selectedSource, setFieldValue],
  );

  const complete = async () => {
    if (validate().hasErrors) {
      notifications.show({
        color: "red.5",
        message: t("Please complete all information"),
      });
      return;
    }
    await store.createPurchasingRequest(values);
    setValues(initialValues);
    setSelectedSource(null);
  };

  return (
    <Stack gap={0}>
      <Flex direction="column" gap={10}>
        <Flex justify="end" align="end" gap={10}>
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
        />
        <ImportMaterials
          selectedSource={selectedSource}
          onChangeSelectedSource={handleChangeSelectedSource}
        />
        <PurchaseRequestTable opened={opened} />
      </Flex>
    </Stack>
  );
};

export default AddPurchasingRequest;
