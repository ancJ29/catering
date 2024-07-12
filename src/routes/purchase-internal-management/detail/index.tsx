import PurchaseActions from "@/components/c-catering/PurchaseActions";
import useOnMounted from "@/hooks/useOnMounted";
import {
  PurchaseInternalDetail as InternalDetail,
  getPurchaseInternalById,
} from "@/services/domain";
import { formatTime } from "@/utils";
import { Flex, Stack } from "@mantine/core";
import { useForm } from "@mantine/form";
import { useCallback, useState } from "react";
import { useParams } from "react-router-dom";
import {
  PurchaseInternalForm,
  initialPurchaseInternalForm,
} from "./_config";
import Form from "./components/Form";
import Steppers from "./components/Steppers";
import Table from "./components/Table";

const PurchaseInternalDetail = () => {
  const { purchaseInternalId } = useParams();
  const { values, setValues } = useForm<PurchaseInternalForm>({
    initialValues: initialPurchaseInternalForm,
  });
  const [purchaseInternalDetails, setPurchaseInternalDetails] =
    useState<InternalDetail[]>([]);

  const load = useCallback(async () => {
    if (!purchaseInternalId) {
      return;
    }
    const purchaseInternal = await getPurchaseInternalById(
      purchaseInternalId,
    );
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
    });
    setPurchaseInternalDetails(
      purchaseInternal?.purchaseInternalDetails || [],
    );
  }, [purchaseInternalId, setValues]);
  useOnMounted(load);

  return (
    <Stack>
      <Flex direction="column" gap={10}>
        <PurchaseActions
          returnUrl="/purchase-internal-management"
          completeButtonTitle="Complete"
          complete={() => null}
          disabledCompleteButton={true}
        />
        <Form values={values} />
        <Steppers status={values.status} />
        <Table purchaseInternalDetails={purchaseInternalDetails} />
      </Flex>
    </Stack>
  );
};

export default PurchaseInternalDetail;
