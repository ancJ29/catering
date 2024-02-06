import {
  DataGridActionProps,
  DataGridColumnProps,
  DataGridProps,
  GenericObject,
} from "@/types";
import { Box, Flex, Table } from "@mantine/core";
import {
  IconChevronDown,
  IconChevronUp,
  IconSelector,
} from "@tabler/icons-react";
import cls from "classnames";
import { useCallback, useEffect, useMemo, useState } from "react";
import Action from "../Action";
import Scroll from "../InfiniteScroll";
import classes from "./DataGrid.module.scss";
import Empty from "./Empty";

function DataGrid<T extends GenericObject>({
  hasOrderColumn = false,
  hasActionColumn = false,
  className,
  columns,
  data,
  actionHandlers,
  onSort,
}: DataGridProps<T>) {
  const [rows, setRows] = useState<T[]>(data || []);

  const [configs, setConfig] = useState(columns);

  const sort = useCallback(() => {
    const column = configs.find((el) => el.sorting);
    if (!column) {
      return;
    }
    setRows(
      rows.sort((a, b) => {
        let _a = "",
          _b = "";
        if (column.key in a) {
          _a = a[column.key]?.toString() || "";
        }
        if (column.key in b) {
          _b = b[column.key]?.toString() || "";
        }
        return column.sorting === "asc"
          ? _a.localeCompare(_b)
          : _b.localeCompare(_a);
      }),
    );
  }, [configs, rows]);

  const sortHandler = useCallback(
    (column: DataGridColumnProps) => {
      if (column.sortable) {
        if (onSort) {
          onSort(column);
        } else {
          setConfig(
            configs.map((el) => {
              if (el.key !== column.key) {
                el.sorting = undefined;
              } else {
                if (el.sorting === "asc") {
                  el.sorting = "desc";
                } else {
                  el.sorting = "asc";
                }
              }
              return el;
            }),
          );
          sort();
        }
      }
    },
    [configs, onSort, sort],
  );

  const Content = useMemo(
    () =>
      _contentBuilder(rows, configs, {
        hasOrderColumn,
        actionHandlers,
        hasActionColumn,
        onSort: sortHandler,
      }),
    [
      rows,
      configs,
      hasOrderColumn,
      actionHandlers,
      hasActionColumn,
      sortHandler,
    ],
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
    hasActionColumn = false,
    hasOrderColumn = false,
    onSort,
  }: {
    hasOrderColumn?: boolean;
    hasActionColumn?: boolean;
    onSort?: (column: DataGridColumnProps) => void;
    actionHandlers?: DataGridActionProps<T>;
  } = {},
) {
  return (
    <div>
      <Headers
        onSort={onSort}
        hasOrderColumn={hasOrderColumn}
        columns={columns}
        actionHandlers={actionHandlers}
        hasActionColumn={hasActionColumn}
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

            {hasActionColumn && actionHandlers && (
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

function sortIcon(sorting: false | "asc" | "desc") {
  if (sorting === "asc") {
    return IconChevronUp;
  }
  if (sorting === "desc") {
    return IconChevronDown;
  }
  return IconSelector;
}

function Headers<T>({
  columns,
  hasActionColumn,
  hasOrderColumn,
  actionHandlers,
  onSort = _blank,
}: {
  hasActionColumn: boolean;
  hasOrderColumn: boolean;
  columns: DataGridColumnProps[];
  actionHandlers?: DataGridActionProps<T>;
  onSort?: (column: DataGridColumnProps) => void;
}) {
  return (
    <div className={classes.headerRow}>
      {hasOrderColumn && <OrderHeader />}
      {columns.map((column, index) => {
        const Icon = column.sortable
          ? sortIcon(column.sorting || false)
          : "div";
        return (
          <Box
            key={index}
            className={classes.headerCell}
            w={column.width}
            style={column.headerStyle || column.style}
            hidden={column.hidden}
            ta={
              typeof column.textAlign === "object"
                ? column.textAlign.header
                : column.textAlign
            }
          >
            {column.sortable ? (
              <Flex justify="space-between" align="center" w="100%">
                {column.header || ""}
                {column.sortable && (
                  <Box
                    onClick={() => onSort(column)}
                    className={classes.sortable}
                    style={{ width: column.width }}
                  >
                    <Icon width={15} height={15} />
                  </Box>
                )}
              </Flex>
            ) : (
              column.header || ""
            )}
          </Box>
        );
      })}
      {hasActionColumn && actionHandlers && (
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
      style={column.cellStyle || column.style}
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

function _blank() {
  // ignore
}
