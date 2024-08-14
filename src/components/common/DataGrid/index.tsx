import EmptyBox from "@/components/common/EmptyBox";
import Select from "@/components/common/Select";
import useTranslation from "@/hooks/useTranslation";
import {
  DataGridActionProps,
  DataGridColumnProps,
  DataGridProps,
  GenericObject,
} from "@/types";
import {
  Box,
  Flex,
  Pagination,
  Table,
  Text,
  UnstyledButton,
} from "@mantine/core";
import {
  IconChevronDown,
  IconChevronUp,
  IconSelector,
} from "@tabler/icons-react";
import cls from "classnames";
import clsx from "clsx";
import { useCallback, useEffect, useMemo, useState } from "react";
import Action from "../Action";
import Scroll from "../InfiniteScroll";
import LastUpdated from "../LastUpdated";
import classes from "./DataGrid.module.scss";

const limitOptions = [5, 10, 20, 50, 100].map((el) => ({
  value: el,
  label: el.toString(),
}));

type GenericObjectWithModificationInformation = GenericObject & {
  updatedAt?: Date | null;
  lastModifiedBy?: string | null;
};

function DataGrid<
  T extends GenericObjectWithModificationInformation,
>({
  limit: _limit = 0,
  page: _page = 1,
  hasUpdateColumn = true,
  isPaginated = false,
  hasOrderColumn = false,
  hasActionColumn = false,
  className,
  columns,
  data,
  noResultText,
  actionHandlers,
  onSort,
  onChangePage,
  onRowClick,
  selectedRow,
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
        if (column.sortValue) {
          _a = column.sortValue(a);
          _b = column.sortValue(b);
        } else {
          if (column.key in a) {
            _a = a[column.key]?.toString() || "";
          }
          if (column.key in b) {
            _b = b[column.key]?.toString() || "";
          }
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
    return _contentBuilder(
      data,
      configs.filter((el) => !el.hidden),
      {
        noResultText,
        orderFrom: from,
        hasOrderColumn,
        actionHandlers,
        hasActionColumn,
        hasUpdateColumn,
        onSort: sortHandler,
        onRowClick,
        selectedRow,
      },
    );
  }, [
    onRowClick,
    configs,
    actionHandlers,
    noResultText,
    hasActionColumn,
    hasOrderColumn,
    hasUpdateColumn,
    isPaginated,
    limit,
    page,
    rows,
    sortHandler,
    selectedRow,
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
      {Boolean(rows.length) && isPaginated && (
        <Flex justify="end" align="center" mb={10} mx={5} gap={5}>
          <PaginationBar
            page={page}
            key={limit}
            limit={limit}
            setLimit={(limit) => {
              setLimit(limit);
              setPage(1);
            }}
            lastPage={lastPage}
            setPage={(page) => {
              onChangePage?.(page);
              setPage(page);
            }}
          />
        </Flex>
      )}
      <div className={cls(classes.container, className)}>
        <div>
          <Scroll dataLength={rows.length} rows={Content} />
        </div>
      </div>
    </Table.ScrollContainer>
  );
}

function PaginationBar({
  limit,
  page,
  lastPage,
  setPage,
  setLimit,
}: {
  page: number;
  limit: number;
  lastPage: number;
  setLimit: (limit: number) => void;
  setPage: (page: number) => void;
}) {
  const t = useTranslation();
  return (
    <Flex
      justify="space-between"
      w="100%"
      align="center"
      mb={10}
      mx={5}
      gap={5}
    >
      <Flex align="center" gap={5}>
        <Text c="primary" fw={"600"} mr={5}>
          {t("Item per page")}:
        </Text>
        <Select
          w={70}
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
      {lastPage > 1 && (
        <Pagination
          value={page}
          total={lastPage}
          onChange={setPage}
        />
      )}
    </Flex>
  );
}

export default DataGrid;

function _contentBuilder<
  T extends GenericObjectWithModificationInformation,
>(
  rows: T[],
  columns: DataGridColumnProps[],
  {
    orderFrom = 0,
    noResultText,
    actionHandlers,
    hasUpdateColumn = true,
    hasActionColumn = false,
    hasOrderColumn = false,
    onSort,
    onRowClick,
    selectedRow,
  }: {
    orderFrom?: number;
    noResultText?: string;
    hasUpdateColumn?: boolean;
    hasOrderColumn?: boolean;
    hasActionColumn?: boolean;
    onSort?: (column: DataGridColumnProps) => void;
    onRowClick?: (row: T) => void;
    actionHandlers?: DataGridActionProps<T>;
    selectedRow?: T;
  } = {},
) {
  // const t = useTranslation();
  return (
    <div>
      <Headers
        onSort={onSort}
        hasOrderColumn={hasOrderColumn}
        columns={columns}
        actionHandlers={actionHandlers}
        hasActionColumn={hasActionColumn}
        hasUpdateColumn={hasUpdateColumn}
      />
      {rows.length > 0 ? (
        rows.map((row, idx) => (
          <Box
            key={idx}
            className={classes.dataRow}
            onClick={onRowClick?.bind(null, row)}
            bg={selectedRow === row ? "primary.2" : undefined}
          >
            <OrderCell
              hasOrderColumn={hasOrderColumn}
              key={`no.${idx}`}
              index={orderFrom + idx}
            />
            {columns.map((column) => (
              <Cell key={column.key} row={row} column={column} />
            ))}
            {hasUpdateColumn ? (
              <LastUpdated
                hasActionColumn={hasActionColumn}
                lastModifiedBy={row.lastModifiedBy ?? ""}
                updatedAt={row.updatedAt ?? undefined}
              />
            ) : (
              <></>
            )}
            <Actions
              key={idx + 1}
              row={row}
              hasActionColumn={hasActionColumn}
              actionHandlers={actionHandlers}
            />
          </Box>
        ))
      ) : (
        <EmptyBox noResultText={noResultText} />
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
  hasUpdateColumn,
  hasActionColumn,
  hasOrderColumn,
  actionHandlers,
  onSort = _blank,
}: {
  hasUpdateColumn: boolean;
  hasActionColumn: boolean;
  hasOrderColumn: boolean;
  columns: DataGridColumnProps[];
  actionHandlers?: DataGridActionProps<T>;
  onSort?: (column: DataGridColumnProps) => void;
}) {
  return (
    <div className={classes.header}>
      {hasOrderColumn && <OrderHeader />}
      {columns.map((column, idx) => {
        const Icon = column.sortable
          ? sortIcon(column.sorting || false)
          : "div";
        return (
          <Box
            key={idx}
            className={clsx(
              classes.cell,
              column.headerClassName || column.className,
            )}
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
              <Flex
                gap={20}
                justify="start"
                align="center"
                pr={10}
                w="100%"
              >
                {column.header || ""}
                {column.sortable && (
                  <UnstyledButton onClick={() => onSort(column)}>
                    <Icon width={15} height={15} />
                  </UnstyledButton>
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
      {hasUpdateColumn && (
        <Box className={classes.updated}>&nbsp;</Box>
      )}
    </div>
  );
}

function Actions<T extends GenericObject>({
  row,
  hasActionColumn,
  actionHandlers = {},
}: {
  row: T;
  hasActionColumn?: boolean;
  actionHandlers?: DataGridActionProps<T>;
}) {
  return hasActionColumn ? (
    <Box className={classes.actions}>
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
    </Box>
  ) : (
    <></>
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
      className={clsx(
        classes.dataCell,
        column.cellClassName || column.className,
      )}
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
    <Box ta="left" className={classes.cell} w={50}>
      #
    </Box>
  );
}

function OrderCell({
  hasOrderColumn,
  index,
}: {
  hasOrderColumn?: boolean;
  index: number;
}) {
  return hasOrderColumn ? (
    <Box
      key={`no.${index}`}
      className={classes.cell}
      ta="left"
      pl={10}
      w={50}
    >
      {index + 1}
    </Box>
  ) : (
    <></>
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
