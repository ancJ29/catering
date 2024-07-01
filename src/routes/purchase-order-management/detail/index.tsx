import PurchaseActions from "@/components/c-catering/PurchaseActions";
import useTranslation from "@/hooks/useTranslation";
import { PurchaseOrderDetail as _PurchaseOrderDetail, getPurchaseOrderById } from "@/services/domain";
import logger from "@/services/logger";
import { formatTime } from "@/utils";
import { Flex, Stack } from "@mantine/core";
import { useForm } from "@mantine/form";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { PurchaseOrderForm, initialPurchaseOrderForm } from "./_config";
import PurchaseOrderInformationForm from "./components/PurchaseOrderInformationForm";
import PurchaseOrderSteppers from "./components/PurchaseOrderSteppers";

const PurchaseOrderDetail = () => {
  const t = useTranslation();
  const { purchaseOrderId } = useParams();
  const [disabled, setDisabled] = useState(true);
  const [purchaseOrderDetails, setPurchaseOrderDetails] = useState<_PurchaseOrderDetail[]>([]);
  const form = useForm<PurchaseOrderForm>({
    initialValues: initialPurchaseOrderForm,
  });

  const getData = async () => {
    if (!purchaseOrderId) {
      return;
    }
    const purchaseOrder = await getPurchaseOrderById(purchaseOrderId);
    setPurchaseOrderDetails(purchaseOrder?.purchaseOrderDetails || []);
    form.setValues({
      departmentId: purchaseOrder?.others.receivingCateringId,
      deliveryDate: purchaseOrder?.deliveryDate.getTime(),
      deliveryTime: formatTime(
        purchaseOrder?.deliveryDate,
        "HH:mm",
      ),
      supplierId: purchaseOrder?.supplierId,
      status: purchaseOrder?.others.status,
    });
    setDisabled(purchaseOrder?.others.status !== "DG");
  };

  useEffect(() => {
    getData();
  }, []);

  const complete = () => {
    logger.info("complete");
  };

  return (
    <Stack>
      <Flex direction="column" gap={10}>
        <PurchaseActions
          returnButtonTitle={t("Return to purchase order list")}
          returnUrl="/purchase-order-management"
          completeButtonTitle={t("Approve for supplier")}
          complete={complete}
          disabledCompleteButton={disabled}
        />
        <PurchaseOrderInformationForm values={form.values} />
        <PurchaseOrderSteppers
          status={form.values.status}
          disabled={true}
        />
        {/*
        <PurchaseRequestTable disabled={disabled} /> */}
      </Flex>
    </Stack>
  );
};

export default PurchaseOrderDetail;
