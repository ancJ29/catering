import { dailyMenuKey } from "@/services/domain";
import useAuthStore from "@/stores/auth.store";
import useDailyMenuStore from "@/stores/daily-menu.store";
import { startOfDay } from "@/utils";
import { Table } from "@mantine/core";
import { useMemo } from "react";
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
  const { isCatering } = useAuthStore();
  const { dailyMenu } = useDailyMenuStore();
  const today = useMemo(() => startOfDay(Date.now()), []);
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
            const quantity = new Map(
              Object.entries(m?.others.quantity || {}),
            );
            const isEmpty = quantity.size === 0;
            const isPastDate = (cell.timestamp || 0) < today;
            const disabled = (isPastDate || isCatering) && isEmpty;
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
    </Table.Tbody>
  ) : (
    <></>
  );
};

export default MonthView;
