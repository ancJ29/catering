import {
  ClientRoles,
  piStatusSchema,
} from "@/auto-generated/api-configs";
import PurchaseActions from "@/components/c-catering/PurchaseActions";
import useOnMounted from "@/hooks/useOnMounted";
import {
  PurchaseInternalDetail as InternalDetail,
  getPurchaseInternalById,
  updatePurchaseInternal,
} from "@/services/domain";
import useAuthStore from "@/stores/auth.store";
import useMaterialStore from "@/stores/material.store";
import {
  convertAmountForward,
  formatTime,
  getDateTime,
} from "@/utils";
import { Flex, Stack } from "@mantine/core";
import { useForm } from "@mantine/form";
import { useCallback, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  PurchaseInternalForm,
  initialPurchaseInternalForm,
} from "./_configs";
import Form from "./components/Form";
import Steppers from "./components/Steppers";
import Table from "./components/Table";

const PurchaseInternalDetail = () => {
  const navigate = useNavigate();
  const { purchaseInternalId } = useParams();
  const { role } = useAuthStore();
  const [disabled, setDisabled] = useState(true);
  const { values, setValues } = useForm<PurchaseInternalForm>({
    initialValues: initialPurchaseInternalForm,
  });
  const [currents, setCurrents] = useState<InternalDetail[]>([]);
  const [updates, setUpdates] = useState<
  Record<string, InternalDetail>
  >({});
  const { materials } = useMaterialStore();

  const load = useCallback(async () => {
    if (!purchaseInternalId) {
      return;
    }
    const purchaseInternal = await getPurchaseInternalById(
      purchaseInternalId,
    );
    if (!purchaseInternal) {
      navigate("/");
    }
    setValues({
      id: purchaseInternal?.id,
      receivingCateringId:
        purchaseInternal?.others.receivingCateringId,
      deliveryCateringId: purchaseInternal?.deliveryCateringId,
      deliveryDate: purchaseInternal?.deliveryDate.getTime(),
      deliveryTime: formatTime(
        purchaseInternal?.deliveryDate,
        "HH:mm",
      ),
      status: purchaseInternal?.others.status,
      prCode: purchaseInternal?.others.prCode,
      purchaseRequestId: purchaseInternal?.purchaseRequestId,
    });
    setCurrents(purchaseInternal?.purchaseInternalDetails || []);
    setUpdates(
      Object.fromEntries(
        purchaseInternal?.purchaseInternalDetails.map((e) => [
          e.materialId,
          e,
        ]) || [],
      ),
    );
    setDisabled(
      !(
        purchaseInternal?.others.status ===
          piStatusSchema.Values.DG &&
        (role === ClientRoles.OWNER ||
          role === ClientRoles.CATERING ||
          role === ClientRoles.SUPPLIER)
      ),
    );
  }, [navigate, purchaseInternalId, role, setValues]);
  useOnMounted(load);

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

  const handleChangeKitchenDeliveryNote = (
    materialId: string,
    kitchenDeliveryNote: string,
  ) => {
    setUpdates({
      ...updates,
      [materialId]: {
        ...updates[materialId],
        others: {
          ...updates[materialId].others,
          kitchenDeliveryNote,
        },
      },
    });
  };

  const complete = async () => {
    await updatePurchaseInternal({
      id: values.id,
      deliveryDate: getDateTime(
        values.deliveryDate,
        values.deliveryTime,
      ),
      purchaseRequestId: values.purchaseRequestId,
      deliveryCateringId: values.deliveryCateringId,
      others: {
        prCode: values.prCode,
        receivingCateringId: values.receivingCateringId,
        status: values.status,
      },
      purchaseInternalDetails: Object.values(updates).map((e) => {
        const amount = convertAmountForward({
          material: materials.get(e.materialId),
          amount: e.amount,
        });
        return {
          ...e,
          amount: amount,
          actualAmount: amount,
          kitchenDeliveryNote: e.others.kitchenDeliveryNote,
          internalNote: e.others.internalNote,
        };
      }),
    });
  };

  return (
    <Stack>
      <Flex direction="column" gap={10}>
        <PurchaseActions
          returnUrl="/purchase-internal-management"
          completeButtonTitle="Complete"
          complete={complete}
          disabledCompleteButton={disabled}
        />
        <Form values={values} />
        <Steppers
          status={values.status}
          onChangeStatus={(value) =>
            setValues({ ...values, status: value })
          }
          disabled={disabled}
        />
        <Table
          purchaseInternalDetails={currents}
          onChangeAmount={handleChangeAmount}
          onChangeInternalNote={handleChangeInternalNote}
          onChangeKitchenDeliveryNote={
            handleChangeKitchenDeliveryNote
          }
          disabled={disabled}
        />
      </Flex>
    </Stack>
  );
};

export default PurchaseInternalDetail;
