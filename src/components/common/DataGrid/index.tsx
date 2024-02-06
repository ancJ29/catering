import ButtonIcon from "@/components/common/ButtonIcon";
import Select from "@/components/common/Select";
import useTranslation from "@/hooks/useTranslation";
import {
  DataGridActionProps,
  DataGridColumnProps,
  DataGridProps,
  GenericObject,
} from "@/types";
import { Box, Flex, Table, Text } from "@mantine/core";
import {
  IconChevronDown,
  IconChevronLeft,
  IconChevronRight,
  IconChevronUp,
  IconChevronsLeft,
  IconChevronsRight,
  IconSelector,
} from "@tabler/icons-react";
import cls from "classnames";
import { useCallback, useEffect, useMemo, useState } from "react";
import Action from "../Action";
import Scroll from "../InfiniteScroll";
import classes from "./DataGrid.module.scss";
import Empty from "./Empty";

const limitOptions = [10, 20, 50, 100].map((el) => ({
  value: el,
  label: el.toString(),
}));

function DataGrid<T extends GenericObject>({
  limit: _limit = 0,
  page: _page = 1,
  onChangePage,
  isPaginated = false,
  hasOrderColumn = false,
  hasActionColumn = false,
  className,
  columns,
  data,
  actionHandlers,
  onSort,
}: DataGridProps<T>) {
  const [configs, setConfig] = useState(columns);
  const [rows, setRows] = useState<T[]>(data || []);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(_limit || 10);
  const lastPage = useMemo(
    () => (isPaginated ? Math.ceil(rows.length / limit) : 0),
    [limit, rows.length, isPaginated],
  );

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

  const Content = useMemo(() => {
    let data = rows;
    let from = 0;
    if (isPaginated) {
      from = limit * (page - 1);
      data = rows.slice(from, from + limit);
    }
    return _contentBuilder(data, configs, {
      orderFrom: from,
      hasOrderColumn,
      actionHandlers,
      hasActionColumn,
      onSort: sortHandler,
    });
  }, [
    rows,
    isPaginated,
    limit,
    configs,
    hasOrderColumn,
    actionHandlers,
    hasActionColumn,
    sortHandler,
    page,
  ]);

  useEffect(() => {
    setRows(data || []);
  }, [data]);

  useEffect(() => {
    if (_limit !== limit) {
      setLimit(limit);
    }
  }, [_limit, limit]);
  useEffect(() => {
    if (_page !== page) {
      setPage(_page);
    }
  }, [page, _page]);

  return (
    <Table.ScrollContainer minWidth={"100%"} p={0} mt={20} w="100%">
      {isPaginated && (
        <Pagination
          limit={limit}
          setLimit={setLimit}
          page={page}
          lastPage={lastPage}
          setPage={(page) => {
            onChangePage && onChangePage(page);
            setPage(page);
          }}
        />
      )}
      <div className={cls(classes.container, className)}>
        <div>
          <Scroll dataLength={rows.length} rows={Content} />
        </div>
      </div>
    </Table.ScrollContainer>
  );
}

export function Pagination({
  page,
  limit,
  lastPage,
  setPage,
  setLimit,
}: {
  limit: number;
  lastPage: number;
  page: number;
  setLimit: (limit: number) => void;
  setPage: (page: number) => void;
}) {
  const t = useTranslation();
  return (
    <Flex justify="end" align="center" mb={12} mx={4} gap={4}>
      <Text mr={4}>
        {t("Page")}: {page} / {lastPage}
      </Text>
      <ButtonIcon disabled={page < 3} onClick={() => setPage(1)}>
        <IconChevronsLeft strokeWidth="1.5" color="black" />
      </ButtonIcon>
      <ButtonIcon
        disabled={page < 2}
        onClick={() => setPage(Math.max(page - 1, 0))}
      >
        <IconChevronLeft strokeWidth="1.5" color="black" />
      </ButtonIcon>
      <Page
        page={page - 2}
        lastPage={lastPage}
        onClick={() => setPage(page - 2)}
      />
      <Page
        page={page - 1}
        lastPage={lastPage}
        onClick={() => setPage(page - 1)}
      />
      <Page disabled page={page} lastPage={lastPage} />
      <Page
        page={page + 1}
        lastPage={lastPage}
        onClick={() => setPage(page + 1)}
      />
      <Page
        page={page + 2}
        lastPage={lastPage}
        onClick={() => setPage(page + 2)}
      />
      <ButtonIcon
        disabled={lastPage <= page}
        onClick={() => setPage(Math.min(page + 1, lastPage))}
      >
        <IconChevronRight strokeWidth="1.5" color="black" />
      </ButtonIcon>
      <ButtonIcon
        disabled={lastPage <= page - 1}
        onClick={() => setPage(lastPage)}
      >
        <IconChevronsRight strokeWidth="1.5" color="black" />
      </ButtonIcon>
      <Select
        w={100}
        value={limit.toString()}
        options={limitOptions}
        onChange={(value: string | null) => {
          if (!value || isNaN(parseInt(value))) {
            return;
          }
          setLimit(parseInt(value));
        }}
      />
    </Flex>
  );
}

function Page({
  page,
  disabled,
  lastPage,
  onClick,
}: {
  disabled?: boolean;
  page: number;
  lastPage: number;
  onClick?: () => void;
}) {
  if (page > lastPage || page < 1) {
    return <></>;
  }
  return (
    <ButtonIcon disabled={disabled} onClick={onClick}>
      <Text c="black">{page}</Text>
    </ButtonIcon>
  );
}

export default DataGrid;

function _contentBuilder<T extends GenericObject>(
  rows: T[],
  columns: DataGridColumnProps[],
  {
    orderFrom = 0,
    actionHandlers,
    hasActionColumn = false,
    hasOrderColumn = false,
    onSort,
  }: {
    orderFrom?: number;
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
              <OrderCell
                key={`no.${index}`}
                index={orderFrom + index}
              />
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
            // bg="red.1"
            style={column.headerStyle || column.style}
            hidden={column.hidden}
            ta={
              typeof column.textAlign === "object"
                ? column.textAlign.header
                : column.textAlign
            }
          >
            {column.sortable ? (
              <Flex
                justify="space-between"
                align="center"
                pr={10}
                w="100%"
              >
                {column.header || ""}
                {column.sortable && (
                  <ButtonIcon
                    onClick={() => onSort(column)}
                    style={{ width: column.width }}
                  >
                    <Icon width={15} height={15} />
                  </ButtonIcon>
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
