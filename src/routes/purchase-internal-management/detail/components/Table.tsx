import ScrollTable from "@/components/c-catering/ScrollTable";
import { PurchaseInternalDetail } from "@/services/domain";
import { Grid } from "@mantine/core";
import Header from "./Header";
import Item from "./Item";

type TableProps = {
  purchaseInternalDetails: PurchaseInternalDetail[];
  onChangeAmount: (materialId: string, amount: number) => void;
  onChangeInternalNote: (
    materialId: string,
    internalNote: string,
  ) => void;
  onChangeKitchenDeliveryNote: (
    materialId: string,
    kitchenDeliveryNote: string,
  ) => void;
  disabled: boolean;
};

const Table = ({
  purchaseInternalDetails,
  onChangeAmount,
  onChangeInternalNote,
  onChangeKitchenDeliveryNote,
  disabled,
}: TableProps) => {
  return (
    <Grid mt={10}>
      <Grid.Col span={12} pb={0}>
        <div>
          <ScrollTable header={<Header />}>
            {purchaseInternalDetails.map((purchaseInternalDetail) => (
              <Item
                key={purchaseInternalDetail.id}
                purchaseInternalDetail={purchaseInternalDetail}
                onChangeAmount={(value) =>
                  onChangeAmount(
                    purchaseInternalDetail.materialId,
                    value,
                  )
                }
                onChangeInternalNote={(value) =>
                  onChangeInternalNote(
                    purchaseInternalDetail.materialId,
                    value,
                  )
                }
                onChangeKitchenDeliveryNote={(value) =>
                  onChangeKitchenDeliveryNote(
                    purchaseInternalDetail.materialId,
                    value,
                  )
                }
                disabled={disabled}
              />
            ))}
          </ScrollTable>
        </div>
      </Grid.Col>
    </Grid>
  );
};

export default Table;
