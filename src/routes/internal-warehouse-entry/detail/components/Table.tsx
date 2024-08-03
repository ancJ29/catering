import { Table as MantineTable } from "@mantine/core";
import { useSyncExternalStore } from "react";
import { InternalDetail } from "../_configs";
import store from "../_item.store";
import DisplayHeader from "./DisplayHeader";
import Header from "./Header";
import Item from "./Item";

const Table = () => {
  const { currents, disabled } = useSyncExternalStore(
    store.subscribe,
    store.getSnapshot,
  );

  return (
    <>
      <MantineTable withTableBorder withColumnBorders>
        <DisplayHeader />
      </MantineTable>
      <MantineTable mt="-10px" withTableBorder>
        <Header />
        <MantineTable.Tbody>
          {Object.values(currents).map(
            (internalDetail: InternalDetail, index: number) => (
              <Item
                key={internalDetail.id}
                index={index}
                internalDetail={internalDetail}
                disabled={disabled}
                onChangeActualAmount={(value) =>
                  store.setActualAmount(
                    internalDetail.materialId,
                    value,
                  )
                }
                onChangeActualPrice={(value) =>
                  store.setActualPrice(
                    internalDetail.materialId,
                    value,
                  )
                }
                onChangeKitchenDeliveryNote={(value) =>
                  store.setKitchenDeliveryNote(
                    internalDetail.materialId,
                    value,
                  )
                }
              />
            ),
          )}
        </MantineTable.Tbody>
      </MantineTable>
    </>
  );
};

export default Table;
