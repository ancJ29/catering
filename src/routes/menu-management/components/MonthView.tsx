import { dailyMenuKey } from "@/services/domain";
import useDailyMenuStore from "@/stores/daily-menu.store";
import { Table } from "@mantine/core";
import Cell from "./Cell";

type MonthViewProps = {
  customer?: { id: string };
  rows: {
    date: string;
    timestamp: number;
  }[][];
  shift: string;
  targetName: string;
  onClick: (shift: string, timestamp: number) => void;
};

const MonthView = ({
  rows,
  shift,
  targetName,
  customer,
  onClick,
}: MonthViewProps) => {
  const { dailyMenu } = useDailyMenuStore();
  return customer ? (
    <Table.Tbody>
      {rows.map((cells, idx) => (
        <Table.Tr key={idx}>
          {cells.map((cell, idx) => {
            const key = dailyMenuKey(
              customer.id,
              targetName,
              shift,
              cell.timestamp,
            );
            const m = dailyMenu.get(key);
            return (
              <Cell
                key={idx}
                date={cell.date}
                status={m?.others.status}
                quantity={
                  new Map(Object.entries(m?.others.quantity || {}))
                }
                onClick={() => onClick(shift, cell.timestamp || 0)}
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

export default MonthView;
