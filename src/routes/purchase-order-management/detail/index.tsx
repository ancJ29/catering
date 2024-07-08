import { poStatusSchema } from "@/auto-generated/api-configs";
import PurchaseActions from "@/components/c-catering/PurchaseActions";
import useTranslation from "@/hooks/useTranslation";
import {
  PurchaseOrderDetail as _PurchaseOrderDetail,
  getPurchaseOrderById,
  updatePurchaseOrderStatus,
} from "@/services/domain";
import useSupplierStore from "@/stores/supplier.store";
import { formatTime } from "@/utils";
import { Flex, Stack } from "@mantine/core";
import { useForm } from "@mantine/form";
import { useCallback, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  PurchaseOrderForm,
  initialPurchaseOrderForm,
} from "./_config";
import Form from "./components/Form";
import SendMail from "./components/SendMail";
import Steppers from "./components/Steppers";
import Table from "./components/Table";

const PurchaseOrderDetail = () => {
  const t = useTranslation();
  const { purchaseOrderId } = useParams();
  const { suppliers } = useSupplierStore();
  const [disabled, setDisabled] = useState(true);
  const [purchaseOrderDetails, setPurchaseOrderDetails] = useState<
  _PurchaseOrderDetail[]
  >([]);
  const form = useForm<PurchaseOrderForm>({
    initialValues: initialPurchaseOrderForm,
  });

  const load = useCallback(async () => {
    if (!purchaseOrderId) {
      return;
    }
    const purchaseOrder = await getPurchaseOrderById(purchaseOrderId);
    setPurchaseOrderDetails(
      purchaseOrder?.purchaseOrderDetails || [],
    );
    form.setValues({
      departmentId: purchaseOrder?.others.receivingCateringId,
      deliveryDate: purchaseOrder?.deliveryDate.getTime(),
      deliveryTime: formatTime(purchaseOrder?.deliveryDate, "HH:mm"),
      supplierId: purchaseOrder?.supplierId,
      status: purchaseOrder?.others.status,
      email:
        suppliers.get(purchaseOrder?.supplierId || "")?.others
          .email || "",
    });
    setDisabled(
      purchaseOrder?.others.status !== poStatusSchema.Values.DG,
    );
  }, [form, purchaseOrderId, suppliers]);
  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const complete = async () => {
    await updatePurchaseOrderStatus({
      id: purchaseOrderId || "",
      status: poStatusSchema.Values.DD,
    });
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
        <Form values={form.values} />
        <Steppers status={form.values.status} disabled={true} />
        <SendMail
          email={form.values.email}
          onChangeEmail={(email) =>
            form.setFieldValue("email", email)
          }
          disabled={disabled}
        />
        <Table purchaseOrderDetails={purchaseOrderDetails} />
      </Flex>
    </Stack>
  );
};

export default PurchaseOrderDetail;
