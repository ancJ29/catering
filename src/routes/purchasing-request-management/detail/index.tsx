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
import store from "./_purchase-request-detail.store";
import PurchaseRequestTable from "./components/PurchaseRequestTable";

const PurchasingRequestDetail = () => {
  const t = useTranslation();
  const { role } = useAuthStore();
  const navigate = useNavigate();
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
    if (!values.status) {
      return;
    }
    await store.update(values.status);
    navigate("/purchasing-request-management");
  };

  return (
    <Stack gap={0}>
      <Flex direction="column" gap={10}>
        <PurchaseRequestActions
          returnButtonTitle={t("Return to purchase request list")}
          returnUrl="/purchasing-request-management"
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
        <PurchaseRequestTable disabled={disabled} />
      </Flex>
    </Stack>
  );
};

export default PurchasingRequestDetail;
