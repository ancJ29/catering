import { dailyMenuKey, readableDailyMenu } from "@/services/domain";
import useAuthStore from "@/stores/auth.store";
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
  const { role, cateringId } = useAuthStore();
  const { dailyMenu } = useDailyMenuStore();
  return customer ? (
    <>
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
            const quantity = new Map(
              Object.entries(m?.others.quantity || {}),
            );
            const disabled = !readableDailyMenu(
              role,
              cell.timestamp,
              m,
              cateringId,
            );
            return (
              <Cell
                key={idx}
                date={cell.date}
                status={m?.others.status}
                disabled={disabled}
                quantity={quantity}
                onClick={() => onClick(shift, cell.timestamp || 0)}
              />
            );
          })}
        </Table.Tr>
      ))}
    </>
  ) : (
    <></>
  );
};

export default MonthView;
