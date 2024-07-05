import NumberInput from "@/components/common/NumberInput";
import { XMealDetail } from "@/services/domain";
import useCustomerStore from "@/stores/customer.store";
import { TextAlign } from "@/types";
import { Table } from "@mantine/core";

type ItemProps = {
  mealDetail: XMealDetail;
  onChangePredictedQuantity: (value: number) => void;
  onChangeProductionOrderQuantity: (value: number) => void;
  onChangeEmployeeQuantity: (value: number) => void;
  onChangePaymentQuantity: (value: number) => void;
};

const Item = ({
  mealDetail,
  onChangePredictedQuantity,
  onChangeProductionOrderQuantity,
  onChangeEmployeeQuantity,
  onChangePaymentQuantity,
}: ItemProps) => {
  const { customers } = useCustomerStore();
  const columns = [
    {
      content: customers.get(mealDetail.customerId)?.name || "N/A",
      align: "left",
    },
    {
      content: mealDetail.mealName || "N/A",
      align: "left",
    },
    {
      content: mealDetail.shift || "N/A",
      align: "center",
    },
    {
      content: (
        <NumberInput
          w="10vw"
          isPositive={true}
          defaultValue={mealDetail.predictedQuantity}
          onChange={onChangePredictedQuantity}
          allowDecimal={false}
        />
      ),
      align: "left",
    },
    {
      content: (
        <NumberInput
          w="10vw"
          isPositive={true}
          defaultValue={mealDetail.productionOrderQuantity}
          onChange={onChangeProductionOrderQuantity}
          allowDecimal={false}
        />
      ),
      align: "left",
    },
    {
      content: (
        <NumberInput
          w="10vw"
          isPositive={true}
          defaultValue={mealDetail.employeeQuantity}
          onChange={onChangeEmployeeQuantity}
          allowDecimal={false}
        />
      ),
      align: "left",
    },
    {
      content: (
        <NumberInput
          w="10vw"
          isPositive={true}
          defaultValue={mealDetail.paymentQuantity}
          onChange={onChangePaymentQuantity}
          allowDecimal={false}
        />
      ),
      align: "left",
    },
  ];

  return (
    <Table.Tr>
      {columns.map((col, index) => (
        <Table.Td key={index} ta={col.align as TextAlign}>
          {col.content}
        </Table.Td>
      ))}
    </Table.Tr>
  );
};

export default Item;
