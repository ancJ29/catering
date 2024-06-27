import { ClientRoles } from "@/auto-generated/api-configs";
import PurchaseActions from "@/components/c-catering/PurchaseActions";
import PurchaseRequestInformationForm from "@/components/c-catering/PurchaseRequestInformationForm";
import PurchaseRequestSteppers from "@/components/c-catering/PurchaseRequestSteppers";
import useOnMounted from "@/hooks/useOnMounted";
import useTranslation from "@/hooks/useTranslation";
import useAuthStore from "@/stores/auth.store";
import {
  PurchaseRequestForm,
  initialPurchaseRequestForm,
} from "@/types";
import { formatTime } from "@/utils";
import { Flex, Stack } from "@mantine/core";
import { useForm } from "@mantine/form";
import { notifications } from "@mantine/notifications";
import { useCallback, useState } from "react";
import { useParams } from "react-router-dom";
import store from "./_purchase-request-detail.store";
import PurchaseRequestTable from "./components/PurchaseRequestTable";

const PurchaseRequestDetail = () => {
  const t = useTranslation();
  const { role } = useAuthStore();
  const { purchaseRequestId } = useParams();
  const [disabled, setDisabled] = useState(true);
  const { values, setValues, setFieldValue, getInputProps, errors } =
    useForm<PurchaseRequestForm>({
      initialValues: initialPurchaseRequestForm,
    });

  const load = useCallback(async () => {
    if (!purchaseRequestId) {
      return;
    }
    await store.initData(purchaseRequestId);
    const purchaseRequest = store.getPurchaseRequest();
    setValues({
      departmentId: purchaseRequest?.departmentId,
      deliveryDate: purchaseRequest?.deliveryDate.getTime(),
      deliveryTime: formatTime(
        purchaseRequest?.deliveryDate,
        "HH:mm",
      ),
      type: purchaseRequest?.others.type,
      priority: purchaseRequest?.others.priority,
      status: purchaseRequest?.others.status,
    });
    setDisabled(
      !(
        purchaseRequest?.others.status === "DG" &&
        (role === ClientRoles.CATERING || role === ClientRoles.OWNER)
      ),
    );
  }, [purchaseRequestId, role, setValues]);
  useOnMounted(load);

  const complete = async () => {
    if (!values.status || !values.priority) {
      notifications.show({
        color: "red.5",
        message: t("Please complete all information"),
      });
      return;
    }
    await store.update(values.status, values.priority);
    notifications.show({
      color: "blue.5",
      message: t("Update purchase request successfully"),
    });
    load();
  };

  return (
    <Stack>
      <Flex direction="column" gap={10}>
        <PurchaseActions
          returnButtonTitle={t("Return to purchase request list")}
          returnUrl="/purchase-request-management"
          completeButtonTitle={t("Complete")}
          complete={complete}
          disabledCompleteButton={disabled}
        />
        <PurchaseRequestInformationForm
          values={values}
          onChangeValues={() => null}
          getInputProps={getInputProps}
          errors={errors}
          disabled={true}
          disabledPriority={disabled}
        />
        <PurchaseRequestSteppers
          status={values.status}
          onChange={(value) => setFieldValue("status", value)}
        />
        <PurchaseRequestTable disabled={disabled} />
      </Flex>
    </Stack>
  );
};

export default PurchaseRequestDetail;
