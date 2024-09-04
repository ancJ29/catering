import { ClientRoles } from "@/auto-generated/api-configs";
import MaterialListButton from "@/components/c-catering/MaterialListButton";
import PurchaseActions from "@/components/c-catering/PurchaseActions";
import useOnMounted from "@/hooks/useOnMounted";
import useTranslation from "@/hooks/useTranslation";
import useAuthStore from "@/stores/auth.store";
import { formatTime } from "@/utils";
import { Stack, Text } from "@mantine/core";
import { useForm } from "@mantine/form";
import { useDisclosure } from "@mantine/hooks";
import { modals } from "@mantine/modals";
import { notifications } from "@mantine/notifications";
import { useCallback, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  PurchaseCoordinationForm,
  initialPurchaseCoordinationForm,
} from "./_configs";
import store from "./_purchase-coordination-detail.store";
import Form from "./components/Form";
import Steppers from "./components/Steppers";
import Table from "./components/Table";

const PurchaseCoordinationDetail = () => {
  const t = useTranslation();
  const navigate = useNavigate();
  const { role } = useAuthStore();
  const { purchaseCoordinationId } = useParams();
  const [opened, { toggle }] = useDisclosure(false);
  const [disabled, setDisabled] = useState(true);
  const { values, setValues } = useForm<PurchaseCoordinationForm>({
    initialValues: initialPurchaseCoordinationForm,
  });

  const load = useCallback(async () => {
    if (!purchaseCoordinationId) {
      return;
    }
    await store.initData(purchaseCoordinationId);
    const purchaseCoordination = store.getPurchaseCoordination();
    if(!purchaseCoordination) {
      navigate("/");
    }
    setValues({
      id: purchaseCoordination?.id,
      receivingCateringId:
        purchaseCoordination?.others.receivingCateringId,
      deliveryDate: purchaseCoordination?.deliveryDate.getTime(),
      deliveryTime: formatTime(
        purchaseCoordination?.deliveryDate,
        "HH:mm",
      ),
      status: purchaseCoordination?.others.status,
      type: purchaseCoordination?.others.type,
      priority: purchaseCoordination?.others.priority,
    });
    setDisabled(
      !(
        purchaseCoordination?.others.status === "CXL" &&
        (role === ClientRoles.SUPPLIER || role === ClientRoles.OWNER)
      ),
    );
  }, [navigate, purchaseCoordinationId, role, setValues]);
  useOnMounted(load);

  const complete = useCallback(async () => {
    modals.openConfirmModal({
      title: t("Confirm"),
      children: (
        <Text size="sm">{t("Are you sure to create PO?")}</Text>
      ),
      labels: { confirm: "OK", cancel: t("Cancel") },
      onConfirm: async () => {
        const result = await store.complete();
        if (result) {
          notifications.show({
            color: "blue.5",
            message: t("Add purchase order successfully"),
          });
          setTimeout(() => {
            navigate("/purchase-coordination-management");
            window.location.reload();
          }, 500);
        } else {
          notifications.show({
            color: "red.5",
            message: t("Please complete all information"),
          });
        }
      },
    });
  }, [navigate, t]);

  return (
    <Stack gap={10}>
      <PurchaseActions
        returnUrl="/purchase-coordination-management"
        completeButtonTitle="Create PO"
        complete={complete}
        disabledCompleteButton={disabled}
      />
      <Form values={values} />
      <Steppers status={values.status} disabled={disabled} />
      <MaterialListButton
        opened={opened}
        onClick={toggle}
        style={{ marginLeft: "auto" }}
      />
      <Table opened={opened} disabled={disabled} />
    </Stack>
  );
};

export default PurchaseCoordinationDetail;
