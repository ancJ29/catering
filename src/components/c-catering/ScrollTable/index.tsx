import { ScrollArea, Table } from "@mantine/core";
import React from "react";
import classes from "./ScrollArea.module.scss";

type ScrollTableProps = {
  h?: string;
  withColumnBorders?: boolean;
  header: React.ReactNode;
  children?: React.ReactNode;
};
const ScrollTable = ({
  h,
  header,
  withColumnBorders,
  children,
}: ScrollTableProps) => {
  return (
    <ScrollArea h={h}>
      <Table
        className={classes.table}
        withColumnBorders={withColumnBorders}
      >
        <Table.Thead className={classes.header}>
          <Table.Tr bg="white">{header}</Table.Tr>
        </Table.Thead>
        <Table.Tbody>{children}</Table.Tbody>
      </Table>
    </ScrollArea>
  );
};

export default ScrollTable;
