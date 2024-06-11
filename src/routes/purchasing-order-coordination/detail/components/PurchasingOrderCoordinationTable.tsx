import ScrollTable from "@/components/c-catering/ScrollTable";
import useMaterialStore from "@/stores/material.store";
import { Grid } from "@mantine/core";
import { useSyncExternalStore } from "react";
import store from "../_purchase-request-detail.store";
import Header from "./Header";
import Item from "./Item";

const PurchasingOrderCoordinationTable = () => {
  const { materials } = useMaterialStore();
  const { materialIds, currents } = useSyncExternalStore(
    store.subscribe,
    store.getSnapshot,
  );

  return (
    <Grid mt={10}>
      <Grid.Col span={12} pb={0}>
        <div>
          <ScrollTable
            header={
              <Header />
            }
            h="calc(-8.5rem - 200px + 100vh)"
          >
            {materialIds.map((materialId) => (
              <Item
                key={materialId}
                material={materials.get(materialId)}
                coordinationDetail={currents[materialId]}
                isSelected={store.isSelected(materialId)}
                price={store.getPrice(materialId)}
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
                // disabled={disabled}
              />
            ))}
          </ScrollTable>
        </div>
      </Grid.Col>
    </Grid>
  );
};

export default PurchasingOrderCoordinationTable;
