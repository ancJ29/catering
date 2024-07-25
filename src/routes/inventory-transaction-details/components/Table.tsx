import ScrollTable from "@/components/c-catering/ScrollTable";
import { Grid } from "@mantine/core";
import { Detail } from "../_configs";
import store from "../_monthly_inventory.store";
import Header from "./Header";
import Item from "./Item";

type TableProps = {
  monthlyInventoryId: string;
  cateringId: string;
  materialId: string;
  unit?: string;
};

const Table = ({
  monthlyInventoryId,
  cateringId,
  materialId,
  unit,
}: TableProps) => {
  return (
    <Grid>
      <Grid.Col pb={0}>
        <div>
          <ScrollTable header={<Header />}>
            {store
              .getWarehouse(
                monthlyInventoryId,
                cateringId,
                materialId,
              )
              .map((detail: Detail, i: number) => (
                <Item
                  key={detail.id}
                  index={i}
                  detail={detail}
                  unit={unit}
                />
              ))}
          </ScrollTable>
        </div>
      </Grid.Col>
    </Grid>
  );
};

export default Table;
