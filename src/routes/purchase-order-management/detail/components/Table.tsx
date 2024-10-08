import PurchaseTotal from "@/components/c-catering/PurchaseTotal";
import ScrollTable from "@/components/c-catering/ScrollTable";
import { PurchaseOrderDetail } from "@/services/domain";
import { Flex } from "@mantine/core";
import { useEffect, useState } from "react";
import Header from "./Header";
import Item from "./Item";

type TableProps = {
  isEmailError: boolean;
  purchaseOrderDetails: PurchaseOrderDetail[];
  disabled: boolean;
  onChangeAmount: (materialId: string, amount: number) => void;
  onChangeSupplierNote: (materialId: string, note: string) => void;
  onChangeInternalNote: (materialId: string, note: string) => void;
};

const Table = ({
  isEmailError,
  purchaseOrderDetails,
  disabled,
  onChangeAmount,
  onChangeInternalNote,
  onChangeSupplierNote,
}: TableProps) => {
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
    <Flex direction="column" mt={10}>
      <ScrollTable
        header={<Header />}
        h={`calc(-8.5rem - 240px - ${
          isEmailError ? 20 : 0
        }px + 100vh)`}
      >
        {purchaseOrderDetails.map((purchaseOrderDetail) => (
          <Item
            key={purchaseOrderDetail.id}
            purchaseOrderDetail={purchaseOrderDetail}
            disabled={disabled}
            onChangeAmount={(value) =>
              onChangeAmount(purchaseOrderDetail.materialId, value)
            }
            onChangeInternalNote={(value) =>
              onChangeInternalNote(
                purchaseOrderDetail.materialId,
                value,
              )
            }
            onChangeSupplierNote={(value) =>
              onChangeSupplierNote(
                purchaseOrderDetail.materialId,
                value,
              )
            }
          />
        ))}
      </ScrollTable>
      <PurchaseTotal
        totalMaterial={purchaseOrderDetails.length}
        totalPrice={total}
      />
    </Flex>
  );
};

export default Table;
