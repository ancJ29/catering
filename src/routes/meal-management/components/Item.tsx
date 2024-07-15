import NumberInput from "@/components/common/NumberInput";
import { DailyMenu } from "@/services/domain";
import useCustomerStore from "@/stores/customer.store";
import { TextAlign } from "@/types";
import { numberWithDelimiter } from "@/utils";
import { Table } from "@mantine/core";

type ItemProps = {
  dailyMenu: DailyMenu;
  onChangeEstimatedQuantity: (value: number) => void;
  onChangeProductionOrderQuantity: (value: number) => void;
  onChangeEmployeeQuantity: (value: number) => void;
  onChangePaymentQuantity: (value: number) => void;
};

const Item = ({
  dailyMenu,
  onChangeEstimatedQuantity,
  onChangeProductionOrderQuantity,
  onChangeEmployeeQuantity,
  onChangePaymentQuantity,
}: ItemProps) => {
  const { customers } = useCustomerStore();
  const columns = [
    {
      content: customers.get(dailyMenu.customerId)?.name || "N/A",
      align: "left",
    },
    {
      content: dailyMenu.others.targetName || "N/A",
      align: "left",
    },
    {
      content: dailyMenu.others.shift || "N/A",
      align: "center",
    },
    {
      content: numberWithDelimiter(dailyMenu.others.price || 0),
      align: "right",
    },
    {
      content: (
        <NumberInput
          w="10vw"
          isPositive={true}
          defaultValue={dailyMenu.others.estimatedQuantity}
          onChange={onChangeEstimatedQuantity}
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
          defaultValue={dailyMenu.others.productionOrderQuantity}
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
          defaultValue={dailyMenu.others.employeeQuantity}
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
          defaultValue={dailyMenu.others.total}
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
