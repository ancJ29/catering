import PurchaseActions from "@/components/c-catering/PurchaseActions";
import useOnMounted from "@/hooks/useOnMounted";
import useTranslation from "@/hooks/useTranslation";
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
import PurchaseInternalInformationForm from "./components/PurchaseInternalInformationForm";
import PurchaseInternalSteppers from "./components/PurchaseInternalSteppers";
import PurchaseInternalTable from "./components/PurchaseInternalTable";

const PurchaseInternalDetail = () => {
  const t = useTranslation();
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
          returnButtonTitle={t("Return to purchase internal list")}
          returnUrl="/purchase-internal-management"
          completeButtonTitle={t("Complete")}
          complete={() => null}
          disabledCompleteButton={true}
        />
        <PurchaseInternalInformationForm values={values} />
        <PurchaseInternalSteppers status={values.status} />
        <PurchaseInternalTable
          purchaseInternalDetails={purchaseInternalDetails}
        />
      </Flex>
    </Stack>
  );
};

export default PurchaseInternalDetail;
