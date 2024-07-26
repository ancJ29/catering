import {
  ClientRoles,
  POStatus,
  poStatusSchema,
} from "@/auto-generated/api-configs";
import PurchaseActions from "@/components/c-catering/PurchaseActions";
import useTranslation from "@/hooks/useTranslation";
import ServiceWrapper from "@/layouts/Admin/ServiceWrapper";
import {
  PurchaseOrderDetail as _PurchaseOrderDetail,
  getPurchaseOrderById,
  PurchaseOrder,
  updatePurchaseOrder,
  updatePurchaseOrderStatus,
} from "@/services/domain";
import useAuthStore from "@/stores/auth.store";
import useMaterialStore from "@/stores/material.store";
import useSupplierStore from "@/stores/supplier.store";
import { convertAmountForward, formatTime } from "@/utils";
import { Flex, Stack } from "@mantine/core";
import { useForm } from "@mantine/form";
import { useCallback, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  initialPurchaseOrderForm,
  PurchaseOrderForm,
} from "./_configs";
import Form from "./components/Form";
import SendMail from "./components/SendMail";
import Steppers from "./components/Steppers";
import Table from "./components/Table";

const PurchaseOrderDetail = () => {
  const t = useTranslation();
  const { purchaseOrderId } = useParams();
  const { role } = useAuthStore();
  const { materials } = useMaterialStore();
  const { suppliers } = useSupplierStore();
  const [disabled, setDisabled] = useState(true);
  const [disabledButton, setDisabledButton] = useState(true);
  const [currents, setCurrents] = useState<_PurchaseOrderDetail[]>(
    [],
  );
  const [updates, setUpdates] = useState<
    Record<string, _PurchaseOrderDetail>
  >({});
  const form = useForm<PurchaseOrderForm>({
    initialValues: initialPurchaseOrderForm,
  });
  const [po, setPO] = useState<PurchaseOrder>();

  const load = useCallback(async () => {
    if (!purchaseOrderId) {
      return;
    }
    const purchaseOrder = await getPurchaseOrderById(purchaseOrderId);
    setCurrents(purchaseOrder?.purchaseOrderDetails || []);
    setUpdates(
      Object.fromEntries(
        purchaseOrder?.purchaseOrderDetails.map((e) => [
          e.materialId,
          e,
        ]) || [],
      ),
    );
    setPO(purchaseOrder);
    form.setValues({
      departmentId: purchaseOrder?.others.receivingCateringId,
      deliveryDate: purchaseOrder?.deliveryDate.getTime(),
      deliveryTime: formatTime(purchaseOrder?.deliveryDate, "HH:mm"),
      supplierId: purchaseOrder?.supplierId,
      status: purchaseOrder?.others.status,
      code: purchaseOrder?.code || "",
      email:
        suppliers.get(purchaseOrder?.supplierId || "")?.others
          .email || "",
    });
    setDisabled(
      !(
        purchaseOrder?.others.status === poStatusSchema.Values.DG &&
        (role === ClientRoles.OWNER || role === ClientRoles.SUPPLIER)
      ),
    );
    setDisabledButton(role !== ClientRoles.OWNER);
  }, [form, purchaseOrderId, role, suppliers]);

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleChangeAmount = (materialId: string, amount: number) => {
    setUpdates({
      ...updates,
      [materialId]: {
        ...updates[materialId],
        amount,
      },
    });
  };

  const handleChangeInternalNote = (
    materialId: string,
    internalNote: string,
  ) => {
    setUpdates({
      ...updates,
      [materialId]: {
        ...updates[materialId],
        others: {
          ...updates[materialId].others,
          internalNote,
        },
      },
    });
  };

  const handleChangeSupplierNote = (
    materialId: string,
    supplierNote: string,
  ) => {
    setUpdates({
      ...updates,
      [materialId]: {
        ...updates[materialId],
        others: {
          ...updates[materialId].others,
          supplierNote,
        },
      },
    });
  };

  const handleChangeStatus = (status: POStatus) => {
    form.setFieldValue("status", status);
  };

  const complete = async () => {
    if (!po) {
      return;
    }
    await updatePurchaseOrder({
      ...po,
      prCode: po.others.prCode,
      type: po.others.type,
      priority: po.others.priority,
      receivingCateringId: po.others.receivingCateringId,
      status: po.others.status,
      purchaseOrderDetails: Object.values(updates).map((e) => {
        const material = materials.get(e.materialId);
        const amount = convertAmountForward({
          material,
          amount: e.amount,
        });
        return {
          ...e,
          amount,
          actualAmount: e.amount,
          paymentAmount: e.amount,
          price: e.others.price,
          supplierNote: e.others.supplierNote,
          internalNote: e.others.internalNote,
        };
      }),
    });
    await updatePurchaseOrderStatus({
      id: purchaseOrderId || "",
      status:
        form.values.status === poStatusSchema.Values.DG
          ? poStatusSchema.Values.DD
          : form.values.status,
    });
  };

  return (
    <ServiceWrapper title={`${t("Details")} ${form.values.code}`}>
      <Stack>
        <Flex direction="column" gap={10}>
          <PurchaseActions
            returnUrl="/purchase-order-management"
            completeButtonTitle={
              !disabled && !disabledButton
                ? "Approve for supplier"
                : "Complete"
            }
            complete={complete}
            disabledCompleteButton={disabledButton}
          />
          <Form values={form.values} />
          <Steppers
            status={form.values.status}
            onChangeValue={handleChangeStatus}
          />
          <SendMail
            email={form.values.email}
            onChangeEmail={(email) =>
              form.setFieldValue("email", email)
            }
            disabled={disabled}
          />
          <Table
            purchaseOrderDetails={currents}
            disabled={disabled}
            onChangeAmount={handleChangeAmount}
            onChangeInternalNote={handleChangeInternalNote}
            onChangeSupplierNote={handleChangeSupplierNote}
          />
        </Flex>
      </Stack>
    </ServiceWrapper>
  );
};

export default PurchaseOrderDetail;
