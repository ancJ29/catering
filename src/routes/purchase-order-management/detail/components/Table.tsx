import PurchaseTotal from "@/components/c-catering/PurchaseTotal";
import ScrollTable from "@/components/c-catering/ScrollTable";
import { PurchaseOrderDetail } from "@/services/domain";
import { Grid } from "@mantine/core";
import { useEffect, useState } from "react";
import Header from "./Header";
import Item from "./Item";

type TableProps = {
  purchaseOrderDetails: PurchaseOrderDetail[];
};

const Table = ({ purchaseOrderDetails }: TableProps) => {
  const [total, setTotal] = useState(0);

  useEffect(() => {
    const total = purchaseOrderDetails.reduce(
      (sum, purchaseOrderDetail) => {
        const price = purchaseOrderDetail.others.price || 0;
        const amount = purchaseOrderDetail.amount;
        return sum + price * amount;
      },
      0,
    );
    setTotal(total);
  }, [purchaseOrderDetails]);

  return (
    <Grid mt={10}>
      <Grid.Col span={12} pb={0}>
        <div>
          <ScrollTable
            header={<Header />}
            h="calc(-8.5rem - 240px + 100vh)"
          >
            {purchaseOrderDetails.map((purchaseOrderDetail) => (
              <Item
                key={purchaseOrderDetail.id}
                purchaseOrderDetail={purchaseOrderDetail}
              />
            ))}
          </ScrollTable>
          <PurchaseTotal
            totalMaterial={purchaseOrderDetails.length}
            totalPrice={total}
          />
        </div>
      </Grid.Col>
    </Grid>
  );
};

export default Table;
