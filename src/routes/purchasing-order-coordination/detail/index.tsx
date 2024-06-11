import PurchaseRequestActions from "@/components/c-catering/PurchaseRequestActions";
import PurchaseRequestInformationForm from "@/components/c-catering/PurchaseRequestInformationForm";
import PurchaseRequestSteppers from "@/components/c-catering/PurchaseRequestSteppers";
import useOnMounted from "@/hooks/useOnMounted";
import useTranslation from "@/hooks/useTranslation";
import logger from "@/services/logger";
import { PurchaseRequestForm, initialValues } from "@/types";
import { formatTime } from "@/utils";
import { Flex, Stack } from "@mantine/core";
import { useForm } from "@mantine/form";
import { useCallback } from "react";
import { useParams } from "react-router-dom";
import store from "./_purchase-request-detail.store";
import PurchasingOrderCoordinationTable from "./components/PurchasingOrderCoordinationTable";
import Supply from "./components/Supply";

const PurchasingOrderCoordinationDetail = () => {
  const t = useTranslation();
  const { purchaseRequestId } = useParams();
  const { values, setValues, setFieldValue, getInputProps, errors } =
  useForm<PurchaseRequestForm>({
    initialValues: initialValues,
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
  }, [purchaseRequestId, setValues]);
  useOnMounted(load);

  const complete = () => {
    logger.info("complete");
  };

  return (
    <Stack gap={0}>
      <Flex direction="column" gap={10}>
        <PurchaseRequestActions
          returnButtonTitle={t("Return to purchase order coordination")}
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
        <Supply
          onChangeCateringSupplier={() => null}
          onPurchaseOutside={() => null}
          onPurchaseInternal={() => null}
        />
        <PurchasingOrderCoordinationTable />
      </Flex>
    </Stack>
  );
};

export default PurchasingOrderCoordinationDetail;
