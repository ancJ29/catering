import { ScrollArea, ScrollAreaProps, Table } from "@mantine/core";
import React from "react";
import classes from "./ScrollArea.module.scss";

type ScrollTableProps = ScrollAreaProps & {
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
  ...props
}: ScrollTableProps) => {
  return (
    <ScrollArea h={h} {...props}>
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
