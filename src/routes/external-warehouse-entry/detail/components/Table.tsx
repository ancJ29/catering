import { Table as MantineTable } from "@mantine/core";
import { useSyncExternalStore } from "react";
import { OrderDetail } from "../_configs";
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
            (orderDetail: OrderDetail, index: number) => (
              <Item
                key={orderDetail.id}
                index={index}
                orderDetail={orderDetail}
                disabled={disabled}
                onChangeActualAmount={(value) =>
                  store.setActualAmount(orderDetail.materialId, value)
                }
                onChangeActualPrice={(value) =>
                  store.setActualPrice(orderDetail.materialId, value)
                }
                onChangeSupplierNote={(value) =>
                  store.setSupplierNote(orderDetail.materialId, value)
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
