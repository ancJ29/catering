import { piStatusSchema } from "@/auto-generated/api-configs";
import PurchaseActions from "@/components/c-catering/PurchaseActions";
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
  const { disabled, purchaseInternal } = useSyncExternalStore(
    store.subscribe,
    store.getSnapshot,
  );

  const load = useCallback(async () => {
    if (!purchaseInternalId) {
      return;
    }
    await store.initData(purchaseInternalId);
  }, [purchaseInternalId]);
  useOnMounted(load);

  const complete = useCallback(async () => {
    if (
      purchaseInternal?.others.status === piStatusSchema.Values.DNK
    ) {
      modals.openConfirmModal({
        size: "lg",
        title: t("Confirm"),
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
      notifications.show({
        color: "red.5",
        message: t("Please update status"),
      });
    }
  }, [purchaseInternal?.others.status, t]);

  return (
    <Stack gap={10}>
      <PurchaseActions
        returnUrl="/internal-warehouse-entry"
        completeButtonTitle="Save"
        complete={complete}
        disabledCompleteButton={disabled}
      />
      <Form />
      <Steppers
        status={purchaseInternal?.others.status}
        onChangeStatus={store.setStatus}
      />
      <ImageButton />
      <Table />
    </Stack>
  );
};

export default InternalWarehouseImportDetail;
