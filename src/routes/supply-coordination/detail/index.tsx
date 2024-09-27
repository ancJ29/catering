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
import { useNavigate, useParams } from "react-router-dom";
import store from "./_purchase-coordination-detail.store";
import Supply from "./components/Supply";
import Table from "./components/Table";

const SupplyCoordinationDetail = () => {
  const t = useTranslation();
  const navigate = useNavigate();
  const { purchaseRequestId } = useParams();
  const { role } = useAuthStore();
  const { values, setValues, setFieldValue, getInputProps, errors } =
    useForm<PurchaseRequestForm>({
      initialValues: initialPurchaseRequestForm,
    });
  const [disabled, setDisabled] = useState(true);

  const load = useCallback(async () => {
    if (!purchaseRequestId) {
      return;
    }
    await store.initData(purchaseRequestId);
    const purchaseRequest = store.getPurchaseRequest();
    if (!purchaseRequest) {
      navigate("/");
    }
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
        purchaseRequest?.others.status === "DD" &&
        (role === ClientRoles.SUPPLIER || role === ClientRoles.OWNER)
      ),
    );
  }, [navigate, purchaseRequestId, role, setValues]);
  useOnMounted(load);

  const handlePurchaseOutside = () => {
    store.setIsAllPurchaseInternal(false);
  };

  const handlePurchaseInternal = () => {
    store.setIsAllPurchaseInternal(true);
  };

  const showFailNotification = (content?: string) => {
    notifications.show({
      color: "red.5",
      message: content ?? t("Please complete all information"),
    });
  };

  const complete = async () => {
    if (!values.priority) {
      showFailNotification();
      return;
    }
    if (!values.status || values.status !== "DDP") {
      showFailNotification(t("Please update status"));
      return;
    }
    const result = await store.update(values.status, values.priority);
    if (result) {
      notifications.show({
        color: "blue.5",
        message: t("Update purchase request successfully"),
      });
      setTimeout(() => {
        navigate("/supply-coordination", {
          state: { refresh: true },
        });
      }, 500);
    } else {
      showFailNotification();
    }
  };

  return (
    <Stack gap={0}>
      <Flex direction="column" gap={10}>
        <PurchaseActions
          returnUrl="/supply-coordination"
          completeButtonTitle="Complete"
          complete={complete}
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
        <Supply
          currentCateringId={values.departmentId}
          onPurchaseOutside={handlePurchaseOutside}
          onPurchaseInternal={handlePurchaseInternal}
          disabled={disabled}
        />
        <Table
          currentCateringId={values.departmentId}
          disabled={disabled}
        />
      </Flex>
    </Stack>
  );
};

export default SupplyCoordinationDetail;
