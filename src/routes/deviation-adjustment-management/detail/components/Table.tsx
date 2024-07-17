import ScrollTable from "@/components/c-catering/ScrollTable";
import { Grid } from "@mantine/core";
import { useSyncExternalStore } from "react";
import store from "../purchase-order.store";
import Footer from "./Footer";
import Header from "./Header";
import Item from "./Item";

const Table = () => {
  const { materialIds, currents, disabled } = useSyncExternalStore(
    store.subscribe,
    store.getSnapshot,
  );

  return (
    <Grid mt={10}>
      <Grid.Col span={12} pb={0}>
        <div>
          <ScrollTable
            header={<Header />}
            h="calc(-8.5rem - 270px + 100vh)"
          >
            {materialIds.map((materialId) => (
              <Item
                key={materialId}
                orderDetail={currents[materialId]}
                onChangePaymentAmount={(value) =>
                  store.setPaymentAmount(materialId, value)
                }
                onChangePrice={(value) =>
                  store.setPrice(materialId, value)
                }
                disabled={disabled}
              />
            ))}
          </ScrollTable>
          <Footer
            totalAmount={store.getTotalAmount()}
            taxAmount={store.getTaxAmount()}
          />
        </div>
      </Grid.Col>
    </Grid>
  );
};

export default Table;
