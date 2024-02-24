import { dailyMenuKey } from "@/services/domain";
import useDailyMenuStore from "@/stores/daily-menu.store";
import { Table } from "@mantine/core";
import Cell from "./Cell";

type WeekViewProps = {
  shifts: string[];
  customer?: { id: string };
  headers: { timestamp?: number }[];
  targetName: string;
  onClick: (shift: string, timestamp: number) => void;
};

const WeekView = ({
  shifts,
  headers,
  customer,
  targetName,
  onClick,
}: WeekViewProps) => {
  const { dailyMenu } = useDailyMenuStore();
  return customer ? (
    <Table.Tbody>
      {shifts.map((shift, idx) => (
        <Table.Tr key={idx}>
          <Table.Td>{shift}</Table.Td>
          {headers.map((header, idx) => {
            const key = dailyMenuKey(
              customer.id,
              targetName,
              shift,
              header.timestamp || 0,
            );
            const m = dailyMenu.get(key);
            const quantity = new Map(
              Object.entries(m?.others.quantity || {}),
            );
            return (
              <Cell
                key={idx}
                status={m?.others.status}
                quantity={quantity}
                onClick={() => onClick(shift, header?.timestamp || 0)}
              />
            );
          })}
        </Table.Tr>
      ))}
    </Table.Tbody>
  ) : (
    <></>
  );
};

export default WeekView;
