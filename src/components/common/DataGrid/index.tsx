import {
  DataGridActionProps,
  DataGridColumnProps,
  DataGridProps,
  GenericObject,
} from "@/types";
import { Box, Table } from "@mantine/core";
import cls from "classnames";
import { useEffect, useMemo, useState } from "react";
import Action from "../Action";
import Scroll from "../InfiniteScroll";
import classes from "./DataGrid.module.scss";
import Empty from "./Empty";

function DataGrid<T extends GenericObject>({
  hasOrderColumn = false,
  className,
  columns,
  data,
  actionHandlers,
}: DataGridProps<T>) {
  const [rows, setRows] = useState<T[]>(data || []);

  const Content = useMemo(
    () =>
      _contentBuilder(rows, columns, {
        hasOrderColumn,
        actionHandlers,
      }),
    [rows, columns, hasOrderColumn, actionHandlers],
  );

  useEffect(() => {
    setRows(data || []);
  }, [data]);

  return (
    <Table.ScrollContainer minWidth={"100%"} p={0} mt={20} w="100%">
      <div className={cls(classes.container, className)}>
        <div>
          <Scroll dataLength={rows.length} rows={Content} />
        </div>
      </div>
    </Table.ScrollContainer>
  );
}

export default DataGrid;

function _contentBuilder<T extends GenericObject>(
  rows: T[],
  columns: DataGridColumnProps[],
  {
    actionHandlers,
    hasOrderColumn = false,
  }: {
    actionHandlers?: DataGridActionProps<T>;
    hasOrderColumn?: boolean;
  } = {},
) {
  return (
    <div>
      <Headers
        hasOrderColumn={hasOrderColumn}
        columns={columns}
        actionHandlers={actionHandlers}
      />
      {rows.length > 0 ? (
        rows.map((row, index) => (
          <Box key={index} className={classes.dataRow}>
            {hasOrderColumn && (
              <OrderCell key={`no.${index}`} index={index} />
            )}
            {columns.map((column) => (
              <Cell key={column.key} row={row} column={column} />
            ))}

            {actionHandlers && (
              <Box className={classes.actions}>
                <Actions
                  key={index + 1}
                  row={row}
                  actionHandlers={actionHandlers}
                />
              </Box>
            )}
          </Box>
        ))
      ) : (
        <Empty />
      )}
    </div>
  );
}

function Headers<T>({
  columns,
  hasOrderColumn,
  actionHandlers,
}: {
  hasOrderColumn: boolean;
  columns: DataGridColumnProps[];
  actionHandlers?: DataGridActionProps<T>;
}) {
  return (
    <div className={classes.headerRow}>
      {hasOrderColumn && <OrderHeader />}
      {columns.map((column, index) => (
        <Box
          key={index}
          className={classes.headerCell}
          w={column.width}
          style={column.style}
          hidden={column.hidden}
          ta={
            typeof column.textAlign === "object"
              ? column.textAlign.header
              : column.textAlign
          }
        >
          {column.header || ""}
        </Box>
      ))}
      {actionHandlers && (
        <Box className={classes.actions}>&nbsp;</Box>
      )}
    </div>
  );
}

function Actions<T extends GenericObject>({
  row,
  actionHandlers,
}: {
  row: T;
  actionHandlers: DataGridActionProps<T>;
}) {
  return (
    <Action
      onDelete={_buildHandler(
        row,
        actionHandlers?.deletable,
        actionHandlers.onDelete,
      )}
      onEdit={_buildHandler(
        row,
        actionHandlers.editable,
        actionHandlers.onEdit,
      )}
      onClone={_buildHandler(
        row,
        actionHandlers.cloneable,
        actionHandlers.onClone,
      )}
    />
  );
}

export function _buildHandler<T>(
  row: T,
  enable?: (row: T) => boolean,
  handler?: (row?: T) => void,
): (() => void) | undefined {
  if (enable && !enable(row)) {
    return undefined;
  }
  if (!handler) {
    return undefined;
  }
  return () => handler(row);
}

function Cell<T extends GenericObject>({
  column,
  row,
}: {
  row: T;
  column: DataGridColumnProps;
}) {
  return (
    <Box
      key={column.key}
      w={column.width}
      className={classes.dataCell}
      style={column.style}
      hidden={column.hidden}
      ta={
        typeof column.textAlign === "object"
          ? column.textAlign.cell
          : column.textAlign
      }
    >
      {_render(row, column)}
    </Box>
  );
}

function OrderHeader() {
  return (
    <Box ta="center" className={classes.headerCell} w={20}>
      #
    </Box>
  );
}

function OrderCell({ index }: { index: number }) {
  return (
    <Box
      key={`no.${index}`}
      className={classes.dataCell}
      ta="center"
      w={20}
    >
      {index + 1}
    </Box>
  );
}

function _render(row: GenericObject, column: DataGridColumnProps) {
  if (column.renderCell) {
    return column.renderCell(row[column.key], row);
  }
  if (column.key in row) {
    const value = row[column.key];
    if (typeof value === "string") {
      return value;
    }
    return "-";
  }
  return "-";
}
