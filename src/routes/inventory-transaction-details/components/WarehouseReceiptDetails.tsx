import useTranslation from "@/hooks/useTranslation";
import useMaterialStore from "@/stores/material.store";
import { formatTime } from "@/utils";
import { Center, Stack, Text } from "@mantine/core";
import { useSyncExternalStore } from "react";
import store from "../_monthly_inventory.store";
import Table from "./Table";

type WarehouseReceiptDetailsProps = {
  monthlyInventoryId: string;
  cateringId: string;
  materialId: string;
};

const WarehouseReceiptDetails = ({
  monthlyInventoryId,
  cateringId,
  materialId,
}: WarehouseReceiptDetailsProps) => {
  const t = useTranslation();
  const { materials } = useMaterialStore();
  const { date } = useSyncExternalStore(
    store.subscribe,
    store.getSnapshot,
  );

  return (
    <Stack gap={10} pb="20">
      <Center>
        <Text fw="bold" fz={20}>{`${t("Material name")}: ${
          materials.get(materialId)?.name
        } - ${formatTime(date, "MM/YYYY")}`}</Text>
      </Center>
      <Table
        monthlyInventoryId={monthlyInventoryId}
        cateringId={cateringId}
        materialId={materialId}
        unit={materials.get(materialId)?.others.unit?.name}
      />
    </Stack>
  );
};

export default WarehouseReceiptDetails;
