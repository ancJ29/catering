import { piStatusSchema } from "@/auto-generated/api-configs";
import WarehouseEntryActions from "@/components/c-catering/WarehouseEntryActions";
import useOnMounted from "@/hooks/useOnMounted";
import useTranslation from "@/hooks/useTranslation";
import Steppers from "@/routes/purchase-internal-management/detail/components/Steppers";
import { Flex, Stack, Text } from "@mantine/core";
import { modals } from "@mantine/modals";
import { notifications } from "@mantine/notifications";
import { useCallback, useSyncExternalStore } from "react";
import { useParams } from "react-router-dom";
import store from "./_item.store";
import Form from "./components/Form";
import ImageButton from "./components/ImageButton";
import Table from "./components/Table";

const InternalWarehouseImportDetail = () => {
  const t = useTranslation();
  const { purchaseInternalId } = useParams();
  const { disabled, purchaseInternal, changed } =
    useSyncExternalStore(store.subscribe, store.getSnapshot);

  const load = useCallback(async () => {
    if (!purchaseInternalId) {
      return;
    }
    await store.initData(purchaseInternalId);
  }, [purchaseInternalId]);
  useOnMounted(load);

  const showFailNotification = useCallback(
    (status?: string) => {
      notifications.show({
        color: "red.5",
        message: status ?? t("Please update status"),
      });
    },
    [t],
  );

  const complete = useCallback(async () => {
    const isCheckAll = store.isCheckAll();
    const status = purchaseInternal?.others.status;

    switch (status) {
      case piStatusSchema.Values.DD:
        showFailNotification();
        break;
      case piStatusSchema.Values.DG:
        showFailNotification();
        break;
      case piStatusSchema.Values.SSGH:
        showFailNotification();
        break;
      case piStatusSchema.Values.NK1P:
        store.update();
        break;
      case piStatusSchema.Values.DNK:
        if (isCheckAll) {
          modals.openConfirmModal({
            size: "md",
            title: <Text fw="bold">{t("Confirm")}</Text>,
            children: (
              <Flex direction="column">
                <Text size="sm">
                  {t(
                    "The inventory quantity will be changed when the status is updated",
                  )}
                </Text>
                <Text size="sm">
                  {t(
                    "Are you sure you have checked the actual material quantity?",
                  )}
                </Text>
              </Flex>
            ),
            labels: { confirm: "OK", cancel: t("Cancel") },
            onConfirm: async () => {
              await store.save();
            },
          });
        } else {
          showFailNotification(
            t("Please check all the amounts of materials"),
          );
        }
        break;
    }
  }, [purchaseInternal?.others.status, showFailNotification, t]);

  const onReset = async () => {
    await store.initData(purchaseInternalId || "");
  };

  return (
    <Stack gap={10}>
      <Form />
      <Steppers
        status={purchaseInternal?.others.status}
        onChangeStatus={store.setStatus}
      />
      <ImageButton />
      <Table />
      <WarehouseEntryActions
        returnUrl="/internal-warehouse-entry"
        onReset={onReset}
        changed={changed}
        onCompleted={complete}
        disabled={disabled}
      />
    </Stack>
  );
};

export default InternalWarehouseImportDetail;
