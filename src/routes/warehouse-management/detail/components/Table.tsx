import PurchaseTotal from "@/components/c-catering/PurchaseTotal";
import ScrollTable from "@/components/c-catering/ScrollTable";
import { WarehouseReceiptDetail } from "@/services/domain";
import useMaterialStore from "@/stores/material.store";
import { convertAmountBackward } from "@/utils";
import { Flex } from "@mantine/core";
import Header from "./Header";
import Item from "./Item";

type TableProps = {
  warehouseDetails: WarehouseReceiptDetail[];
};

const Table = ({ warehouseDetails }: TableProps) => {
  const { materials } = useMaterialStore();

  return (
    <Flex mt={10} direction="column">
      <ScrollTable
        header={<Header />}
        h="calc(-8.5rem - 130px + 100vh)"
      >
        {warehouseDetails.map(
          (
            warehouseDetail: WarehouseReceiptDetail,
            index: number,
          ) => (
            <Item
              key={warehouseDetail.id}
              index={index}
              warehouseDetail={warehouseDetail}
            />
          ),
        )}
      </ScrollTable>
      <PurchaseTotal
        totalMaterial={warehouseDetails.length}
        totalPrice={warehouseDetails.reduce((totalAmount, detail) => {
          const amount = convertAmountBackward({
            material: materials.get(detail.materialId),
            amount: detail.amount,
          });
          const price = detail.price;
          return totalAmount + price * amount;
        }, 0)}
      />
    </Flex>
  );
};

export default Table;
