import { poCateringStatusSchema } from "@/auto-generated/api-configs";
import WarehouseEntryActions from "@/components/c-catering/WarehouseEntryActions";
import useOnMounted from "@/hooks/useOnMounted";
import useTranslation from "@/hooks/useTranslation";
import ServiceWrapper from "@/layouts/Admin/ServiceWrapper";
import { Flex, Stack, Text } from "@mantine/core";
import { modals } from "@mantine/modals";
import { notifications } from "@mantine/notifications";
import { useCallback, useSyncExternalStore } from "react";
import { useNavigate, useParams } from "react-router-dom";
import store from "./_item.store";
import Form from "./components/Form";
import ImageButton from "./components/ImageButtons";
import Steppers from "./components/Steppers";
import Table from "./components/Table";

const ExternalWarehouseImportDetail = () => {
  const t = useTranslation();
  const navigate = useNavigate();
  const { purchaseOrderId } = useParams();
  const { disabled, purchaseOrder, changed, isCheckAll } =
    useSyncExternalStore(store.subscribe, store.getSnapshot);

  const load = useCallback(async () => {
    if (!purchaseOrderId) {
      return;
    }
    await store.initData(purchaseOrderId, navigate);
  }, [navigate, purchaseOrderId]);
  useOnMounted(load);

  const showFailNotification = useCallback(() => {
    notifications.show({
      color: "red.5",
      message: t("Please check all the amounts of materials"),
    });
  }, [t]);

  const returnPageList = useCallback(() => {
    navigate("/external-warehouse-entry", {
      state: { refresh: true },
    });
  }, [navigate]);

  const openConfirmModal = useCallback(() => {
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
        returnPageList();
      },
    });
  }, [t, returnPageList]);

  const handleUpdateOrConfirm = useCallback(async () => {
    if (isCheckAll) {
      openConfirmModal();
    } else {
      await store.update();
      returnPageList();
    }
  }, [isCheckAll, openConfirmModal, returnPageList]);

  const complete = useCallback(async () => {
    const status = purchaseOrder?.others.status;

    switch (status) {
      case poCateringStatusSchema.Values.CN:
      case poCateringStatusSchema.Values.CNK:
        await handleUpdateOrConfirm();
        break;
      case poCateringStatusSchema.Values.PONHT:
        isCheckAll ? openConfirmModal() : showFailNotification();
        break;
    }
  }, [
    handleUpdateOrConfirm,
    isCheckAll,
    openConfirmModal,
    purchaseOrder?.others.status,
    showFailNotification,
  ]);

  const onReset = async () => {
    await store.initData(purchaseOrderId || "", navigate);
  };

  return (
    <ServiceWrapper
      routeGroup="external-warehouse-entry"
      title={`${t("Warehouse Import Receipt")} ${
        purchaseOrder?.code
      }`}
      isTranslate={false}
    >
      <Stack gap={10}>
        <Form />
        <Steppers
          status={purchaseOrder?.others.status}
          disabled={disabled}
          onChangeStatus={store.setStatus}
        />
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
    </ServiceWrapper>
  );
};

export default ExternalWarehouseImportDetail;
