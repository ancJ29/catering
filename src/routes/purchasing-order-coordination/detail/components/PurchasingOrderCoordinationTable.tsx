import ScrollTable from "@/components/c-catering/ScrollTable";
import useMaterialStore from "@/stores/material.store";
import { Grid } from "@mantine/core";
import { useSyncExternalStore } from "react";
import store from "../_purchase-coordination-detail.store";
import Header from "./Header";
import Item from "./Item";

type PurchasingOrderCoordinationTableProps = {
  currentCateringId: string | null;
  disabled: boolean;
};

const PurchasingOrderCoordinationTable = ({
  currentCateringId,
  disabled,
}: PurchasingOrderCoordinationTableProps) => {
  const { materials } = useMaterialStore();
  const { materialIds, currents } = useSyncExternalStore(
    store.subscribe,
    store.getSnapshot,
  );

  return (
    <Grid mt={10}>
      <Grid.Col span={12} pb={0}>
        <div>
          <ScrollTable header={<Header />}>
            {materialIds.map((materialId) => (
              <Item
                key={materialId}
                currentCateringId={currentCateringId}
                material={materials.get(materialId)}
                coordinationDetail={currents[materialId]}
                isSelected={store.isSelected(materialId)}
                price={store.getPrice(materialId)}
                kitchenQuantity={store.getInventory(materialId)}
                onChangeAmount={(value) =>
                  store.setAmount(materialId, value)
                }
                onChangeIsSelected={(value) =>
                  store.setIsSelected(materialId, value)
                }
                onChangSupplierNote={(value) =>
                  store.setSupplierNote(materialId, value)
                }
                onChangeInternalNote={(value) =>
                  store.setInternalNote(materialId, value)
                }
                removeMaterial={() =>
                  store.removeMaterial(materialId)
                }
                onChangeDeliveryCatering={(value) =>
                  store.setDeliveryCatering(materialId, value)
                }
                disabled={disabled}
              />
            ))}
          </ScrollTable>
        </div>
      </Grid.Col>
    </Grid>
  );
};

export default PurchasingOrderCoordinationTable;
