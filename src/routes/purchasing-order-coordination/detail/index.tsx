import { ClientRoles } from "@/auto-generated/api-configs";
import PurchaseRequestActions from "@/components/c-catering/PurchaseRequestActions";
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
import { useCallback, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import store from "./_purchase-coordination-detail.store";
import PurchasingOrderCoordinationTable from "./components/PurchasingOrderCoordinationTable";
import Supply from "./components/Supply";

const PurchasingOrderCoordinationDetail = () => {
  const t = useTranslation();
  const { purchaseRequestId } = useParams();
  const navigate = useNavigate();
  const { role } = useAuthStore();
  const { values, setValues, setFieldValue, getInputProps, errors } =
    useForm<PurchaseRequestForm>({
      initialValues: initialPurchaseRequestForm,
    });
  const [disabled, setDisabled] = useState(true);
  const [cateringId, setCateringId] = useState<string | null>(null);
  const [cateringError, setCateringError] = useState<string>("");

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
        purchaseRequest?.others.status === "DD" &&
        (role === ClientRoles.SUPPLIER || role === ClientRoles.OWNER)
      ),
    );
  }, [purchaseRequestId, role, setValues]);
  useOnMounted(load);

  const handlePurchaseOutside = () => {
    store.setIsAllPurchaseInternal(false, cateringId);
  };

  const handlePurchaseInternal = () => {
    if (cateringId === null) {
      setCateringError(t("Please select catering"));
      return;
    }
    setCateringError("");
    store.setIsAllPurchaseInternal(true, cateringId);
  };

  const complete = async () => {
    await store.update(values.status);
    navigate("/purchasing-order-coordination");
  };

  return (
    <Stack gap={0}>
      <Flex direction="column" gap={10}>
        <PurchaseRequestActions
          returnButtonTitle={t(
            "Return to purchase order coordination",
          )}
          returnUrl="/purchasing-order-coordination"
          complete={complete}
        />
        <PurchaseRequestInformationForm
          values={values}
          onChangeValues={() => null}
          getInputProps={getInputProps}
          errors={errors}
          disabled={true}
        />
        <PurchaseRequestSteppers
          status={values.status}
          onChange={(value) => setFieldValue("status", value)}
        />
        <Supply
          currentCateringId={values.departmentId}
          cateringId={cateringId}
          cateringError={cateringError}
          onChangeCateringSupplier={(value) => setCateringId(value)}
          onPurchaseOutside={handlePurchaseOutside}
          onPurchaseInternal={handlePurchaseInternal}
          disabled={disabled}
        />
        <PurchasingOrderCoordinationTable
          currentCateringId={values.departmentId}
          disabled={disabled}
        />
      </Flex>
    </Stack>
  );
};

export default PurchasingOrderCoordinationDetail;
