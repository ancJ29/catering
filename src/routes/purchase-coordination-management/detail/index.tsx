import { ClientRoles } from "@/auto-generated/api-configs";
import MaterialListButton from "@/components/c-catering/MaterialListButton";
import PurchaseActions from "@/components/c-catering/PurchaseActions";
import useOnMounted from "@/hooks/useOnMounted";
import useTranslation from "@/hooks/useTranslation";
import useAuthStore from "@/stores/auth.store";
import { formatTime } from "@/utils";
import { Flex, Stack, Text } from "@mantine/core";
import { useForm } from "@mantine/form";
import { useDisclosure } from "@mantine/hooks";
import { modals } from "@mantine/modals";
import { notifications } from "@mantine/notifications";
import { useCallback, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  PurchaseCoordinationForm,
  initialPurchaseCoordinationForm,
} from "./_config";
import store from "./_purchase-coordination-detail.store";
import PurchaseCoordinationInformationForm from "./components/PurchaseCoordinationInformationForm";
import PurchaseCoordinationSteppers from "./components/PurchaseCoordinationSteppers";
import PurchaseCoordinationTable from "./components/PurchaseCoordinationTable";

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
  }, [purchaseCoordinationId, role, setValues]);
  useOnMounted(load);

  const complete = () => {
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
  };

  return (
    <Stack>
      <Flex direction="column" gap={10}>
        <PurchaseActions
          returnButtonTitle={t(
            "Return to purchase coordination list",
          )}
          returnUrl="/purchase-coordination-management"
          completeButtonTitle={t("Create PO")}
          complete={complete}
          disabledCompleteButton={disabled}
        />
        <PurchaseCoordinationInformationForm values={values} />
        <PurchaseCoordinationSteppers
          status={values.status}
          disabled={disabled}
        />
        <MaterialListButton
          opened={opened}
          onClick={toggle}
          style={{ marginLeft: "auto" }}
        />
        <PurchaseCoordinationTable
          opened={opened}
          disabled={disabled}
        />
      </Flex>
    </Stack>
  );
};

export default PurchaseCoordinationDetail;