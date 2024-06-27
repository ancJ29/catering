import ScrollTable from "@/components/c-catering/ScrollTable";
import { PurchaseInternalDetail } from "@/services/domain";
import { Grid } from "@mantine/core";
import Header from "./Header";
import Item from "./Item";

type PurchaseInternalTableProps = {
  purchaseInternalDetails: PurchaseInternalDetail[];
};

const PurchaseInternalTable = ({
  purchaseInternalDetails,
}: PurchaseInternalTableProps) => {
  return (
    <Grid mt={10}>
      <Grid.Col span={12} pb={0}>
        <div>
          <ScrollTable header={<Header />}>
            {purchaseInternalDetails.map((purchaseInternalDetail) => (
              <Item
                key={purchaseInternalDetail.id}
                purchaseInternalDetail={purchaseInternalDetail}
              />
            ))}
          </ScrollTable>
        </div>
      </Grid.Col>
    </Grid>
  );
};

export default PurchaseInternalTable;
