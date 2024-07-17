import PurchaseActions from "@/components/c-catering/PurchaseActions";
import useTranslation from "@/hooks/useTranslation";
import ServiceWrapper from "@/layouts/Admin/ServiceWrapper";
import Steppers from "@/routes/purchase-order-management/detail/components/Steppers";
import { Flex, Stack } from "@mantine/core";
import { useEffect, useSyncExternalStore } from "react";
import { useParams } from "react-router-dom";
import Controls from "./components/Controls";
import Form from "./components/Form";
import Table from "./components/Table";
import store from "./purchase-order.store";

const DeviationAdjustmentDetail = () => {
  const t = useTranslation();
  const { purchaseOrderId } = useParams();
  const { purchaseOrder, disabled } = useSyncExternalStore(
    store.subscribe,
    store.getSnapshot,
  );

  useEffect(() => {
    if (purchaseOrderId) {
      store.initData(purchaseOrderId);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const complete = () => {
    store.save();
  };

  return (
    <ServiceWrapper title={`${t("Details")}`}>
      <Stack>
        <Flex direction="column" gap={10}>
          <PurchaseActions
            returnUrl="/deviation-adjustment-management"
            completeButtonTitle="Checked"
            complete={complete}
            disabledCompleteButton={disabled}
          />
          <Form />
          <Steppers
            status={purchaseOrder?.others.status}
            disabled={disabled}
          />
          <Controls />
          <Table />
        </Flex>
      </Stack>
    </ServiceWrapper>
  );
};

export default DeviationAdjustmentDetail;
