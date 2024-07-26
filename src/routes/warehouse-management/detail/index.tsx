import useOnMounted from "@/hooks/useOnMounted";
import useTranslation from "@/hooks/useTranslation";
import {
  getWarehouseReceiptById,
  WarehouseReceipt,
} from "@/services/domain";
import { Button, Flex, Stack } from "@mantine/core";
import { useCallback, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Form from "./components/Form";
import Table from "./components/Table";

const WarehouseDetailManagement = () => {
  const { warehouseId } = useParams();
  const navigate = useNavigate();
  const t = useTranslation();
  const [warehouse, setWarehouse] = useState<WarehouseReceipt>();

  const load = useCallback(async () => {
    if (!warehouseId) {
      return;
    }
    const warehouses = await getWarehouseReceiptById(warehouseId);
    setWarehouse(warehouses);
  }, [warehouseId]);
  useOnMounted(load);

  const onClickReturn = () => {
    navigate("/warehouse-management");
  };

  return (
    <Stack gap={10}>
      <Flex justify="end" align="end">
        <Button onClick={onClickReturn} variant="outline">
          {t("Return")}
        </Button>
      </Flex>
      <Form warehouse={warehouse} />
      <Table
        warehouseDetails={warehouse?.warehouseReceiptDetails || []}
      />
    </Stack>
  );
};

export default WarehouseDetailManagement;
