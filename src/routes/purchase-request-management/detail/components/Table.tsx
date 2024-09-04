import PurchaseTotal from "@/components/c-catering/PurchaseTotal";
import ScrollTable from "@/components/c-catering/ScrollTable";
import Header from "@/routes/purchase-request-management/components/Header";
import Item from "@/routes/purchase-request-management/components/Item";
import useMaterialStore from "@/stores/material.store";
import { Flex } from "@mantine/core";
import { useSyncExternalStore } from "react";
import store from "../_purchase-request-detail.store";

type TableProps = {
  disabled: boolean;
};

const Table = ({ disabled }: TableProps) => {
  const { materials } = useMaterialStore();
  const { materialIds, currents, isSelectAll } = useSyncExternalStore(
    store.subscribe,
    store.getSnapshot,
  );

  return (
    <Flex mt={10} direction="column">
      <ScrollTable
        header={
          <Header
            isSelectAll={isSelectAll}
            onChangeIsSelectAll={store.setIsSelectAll}
            disabled={disabled}
          />
        }
        h="calc(-8.5rem - 194px + 100vh)"
      >
        {materialIds.map((materialId) => (
          <Item
            key={materialId}
            material={materials.get(materialId)}
            requestDetail={currents[materialId]}
            isSelected={store.isSelected(materialId)}
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
            removeMaterial={() => store.removeMaterial(materialId)}
            disabled={disabled}
          />
        ))}
      </ScrollTable>
      <PurchaseTotal
        totalMaterial={store.getTotalMaterial()}
        totalPrice={store.getTotalPrice()}
      />
    </Flex>
  );
};

export default Table;
