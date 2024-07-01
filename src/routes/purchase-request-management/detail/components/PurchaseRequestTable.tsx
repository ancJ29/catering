import ScrollTable from "@/components/c-catering/ScrollTable";
import Header from "@/routes/purchase-request-management/components/Header";
import Item from "@/routes/purchase-request-management/components/Item";
import Total from "@/routes/purchase-request-management/components/Total";
import useMaterialStore from "@/stores/material.store";
import { Grid } from "@mantine/core";
import { useSyncExternalStore } from "react";
import store from "../_purchase-request-detail.store";

type PurchaseRequestTableProps = {
  disabled: boolean;
};

const PurchaseRequestTable = ({
  disabled,
}: PurchaseRequestTableProps) => {
  const { materials } = useMaterialStore();
  const { materialIds, currents, isSelectAll } = useSyncExternalStore(
    store.subscribe,
    store.getSnapshot,
  );

  return (
    <Grid mt={10}>
      <Grid.Col span={12} pb={0}>
        <div>
          <ScrollTable
            header={
              <Header
                isSelectAll={isSelectAll}
                onChangeIsSelectAll={store.setIsSelectAll}
                disabled={disabled}
              />
            }
            h="calc(-8.5rem - 200px + 100vh)"
          >
            {materialIds.map((materialId) => (
              <Item
                key={materialId}
                material={materials.get(materialId)}
                requestDetail={currents[materialId]}
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
                disabled={disabled}
              />
            ))}
          </ScrollTable>
          <Total
            totalMaterial={store.getTotalMaterial()}
            totalPrice={store.getTotalPrice()}
          />
        </div>
      </Grid.Col>
    </Grid>
  );
};

export default PurchaseRequestTable;
