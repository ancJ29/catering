import { Table as MantineTable } from "@mantine/core";
import { useSyncExternalStore } from "react";
import { InternalDetail } from "../_configs";
import store from "../_item.store";
import DisplayHeader from "./DisplayHeader";
import Header from "./Header";
import Item from "./Item";

const Table = () => {
  const { currents, disabled, key, isCheckAll } =
    useSyncExternalStore(store.subscribe, store.getSnapshot);

  return (
    <>
      <MantineTable withTableBorder withColumnBorders>
        <DisplayHeader
          isCheckAll={isCheckAll}
          onChangeCheckAll={store.setCheckAll}
        />
      </MantineTable>
      <MantineTable.ScrollContainer
        minWidth={500}
        h="calc(-8.5rem - 280px + 100vh)"
        mt="-10px"
      >
        <MantineTable key={key} withTableBorder>
          <Header />
          <MantineTable.Tbody>
            {Object.values(currents).map(
              (internalDetail: InternalDetail, index: number) => (
                <Item
                  key={internalDetail.id}
                  index={index}
                  internalDetail={internalDetail}
                  disabled={disabled}
                  isChecked={store.isChecked(
                    internalDetail.materialId,
                  )}
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
                  onChangeExpiryDate={(value) =>
                    store.setExpiryDate(
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
                  onChangeChecked={(value) =>
                    store.setIsChecked(
                      internalDetail.materialId,
                      value,
                    )
                  }
                />
              ),
            )}
          </MantineTable.Tbody>
        </MantineTable>
      </MantineTable.ScrollContainer>
    </>
  );
};

export default Table;
