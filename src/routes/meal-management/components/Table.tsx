import ScrollTable from "@/components/c-catering/ScrollTable";
import { Grid } from "@mantine/core";
import { useSyncExternalStore } from "react";
import store from "../_meal.store";
import Header from "./Header";
import Item from "./Item";

const Table = () => {
  const { currents } = useSyncExternalStore(
    store.subscribe,
    store.getSnapshot,
  );

  return (
    <Grid mt={10}>
      <Grid.Col span={12} pb={0}>
        <div>
          <ScrollTable header={<Header />}>
            {Object.values(currents).map((meal) => (
              <Item
                key={meal.id}
                meal={meal}
                onChangeEstimatedQuantity={(value) =>
                  store.setEstimatedQuantity(meal.id, value)
                }
                onChangeProductionOrderQuantity={(value) =>
                  store.setProductionOrderQuantity(meal.id, value)
                }
                onChangeEmployeeQuantity={(value) =>
                  store.setEmployeeQuantity(meal.id, value)
                }
                onChangePaymentQuantity={(value) =>
                  store.setPaymentQuantity(meal.id, value)
                }
              />
            ))}
          </ScrollTable>
        </div>
      </Grid.Col>
    </Grid>
  );
};

export default Table;
