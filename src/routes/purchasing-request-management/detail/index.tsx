import { ClientRoles } from "@/auto-generated/api-configs";
import useOnMounted from "@/hooks/useOnMounted";
import useTranslation from "@/hooks/useTranslation";
import useAuthStore from "@/stores/auth.store";
import { formatTime } from "@/utils";
import { Button, Flex, Stack } from "@mantine/core";
import { useForm } from "@mantine/form";
import { IconCheck } from "@tabler/icons-react";
import { useCallback, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { PurchaseRequestForm, initialValues } from "../add/_config";
import OrderInformationForm from "../components/OrderInformationForm";
import store from "./_purchase-request-detail.store";
import PurchaseRequestTable from "./components/PurchaseRequestTable";
import Steppers from "./components/Steppers";

const PurchasingRequestDetail = () => {
  const t = useTranslation();
  const { role } = useAuthStore();
  const navigate = useNavigate();
  const { purchaseRequestId } = useParams();
  const [disabled, setDisabled] = useState(true);
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
        <Flex justify="end" align="end" gap={10}>
          <Button
            onClick={() => navigate("/purchasing-request-management")}
            variant="outline"
          >
            {t("Return to purchase request list")}
          </Button>
          <Button
            leftSection={<IconCheck size={16} />}
            onClick={complete}
          >
            {t("Complete")}
          </Button>
        </Flex>
        <OrderInformationForm
          values={values}
          onChangeValues={() => null}
          getInputProps={getInputProps}
          errors={errors}
          disabled={true}
        />
        <Steppers
          status={values.status}
          onChange={(value) => setFieldValue("status", value)}
        />
        <PurchaseRequestTable disabled={disabled} />
      </Flex>
    </Stack>
  );
};

export default PurchasingRequestDetail;
