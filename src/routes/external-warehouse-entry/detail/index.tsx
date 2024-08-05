import { poCateringStatusSchema } from "@/auto-generated/api-configs";
import WarehouseEntryActions from "@/components/c-catering/WarehouseEntryActions";
import useOnMounted from "@/hooks/useOnMounted";
import useTranslation from "@/hooks/useTranslation";
import { Flex, Stack, Text } from "@mantine/core";
import { modals } from "@mantine/modals";
import { notifications } from "@mantine/notifications";
import { useCallback, useSyncExternalStore } from "react";
import { useParams } from "react-router-dom";
import store from "./_item.store";
import Form from "./components/Form";
import ImageButton from "./components/ImageButtons";
import Table from "./components/Table";

const ExternalWarehouseImportDetail = () => {
  const t = useTranslation();
  const { purchaseOrderId } = useParams();
  const { disabled, purchaseOrder, changed } = useSyncExternalStore(
    store.subscribe,
    store.getSnapshot,
  );

  const load = useCallback(async () => {
    if (!purchaseOrderId) {
      return;
    }
    await store.initData(purchaseOrderId);
  }, [purchaseOrderId]);
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
    const status = purchaseOrder?.others.status;

    switch (status) {
      case poCateringStatusSchema.Values.CN:
        showFailNotification();
        break;
      case poCateringStatusSchema.Values.CNK:
        store.update();
        break;
      case poCateringStatusSchema.Values.PONHT:
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
  }, [purchaseOrder?.others.status, showFailNotification, t]);

  const onReset = async () => {
    await store.initData(purchaseOrderId || "");
  };

  return (
    <Stack gap={10}>
      <Form />
      <ImageButton />
      <Table />
      <WarehouseEntryActions
        returnUrl="/external-warehouse-entry"
        onReset={onReset}
        changed={changed}
        onCompleted={complete}
        disabled={disabled}
      />
    </Stack>
  );
};

export default ExternalWarehouseImportDetail;
