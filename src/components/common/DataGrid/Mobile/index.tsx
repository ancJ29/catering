import EmptyBox from "@/components/common/EmptyBox";
import Select from "@/components/common/Select";
import useTranslation from "@/hooks/useTranslation";
import {
  DataGridColumnProps,
  DataGridProps,
  GenericObject,
} from "@/types";
import { formatTime } from "@/utils";
import { Card, Flex, Pagination, Text } from "@mantine/core";
import React, {
  ReactNode,
  useEffect,
  useMemo,
  useState,
} from "react";
import {
  GenericObjectWithModificationInformation,
  limitOptions,
} from "../_configs";
import Collapse from "../Collapse";
import classes from "./Mobile.module.scss";

function Mobile<T extends GenericObjectWithModificationInformation>({
  limit: _limit = 0,
  page: _page = 1,
  hasUpdateColumn = true,
  isPaginated = false,
  columns,
  data,
  noResultText,
  onChangePage,
  onRowClick,
  header,
}: DataGridProps<T>) {
  const [rows, setRows] = useState<T[]>(data || []);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(_limit || 10);
  const lastPage = useMemo(
    () => (isPaginated ? Math.ceil(rows.length / limit) : 0),
    [limit, rows.length, isPaginated],
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
      columns.filter((el) => !el.hidden),
      {
        noResultText,
        hasUpdateColumn,
        onRowClick,
        header,
      },
    );
  }, [
    onRowClick,
    columns,
    noResultText,
    hasUpdateColumn,
    isPaginated,
    limit,
    page,
    rows,
    header,
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
    <Flex direction="column" hiddenFrom="sm" gap={10}>
      {Boolean(rows.length) && isPaginated && (
        <Flex justify="end" align="center">
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
      {Content}
    </Flex>
  );
}

export default Mobile;

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
  return (
    <Flex justify="space-between" w="100%" align="center" gap={5}>
      <Flex align="center" gap={5}>
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
          withControls={false}
          siblings={1}
        />
      )}
    </Flex>
  );
}

function _contentBuilder<
  T extends GenericObjectWithModificationInformation,
>(
  rows: T[],
  columns: DataGridColumnProps[],
  {
    noResultText,
    hasUpdateColumn = true,
    onRowClick,
    header,
  }: {
    noResultText?: string;
    hasUpdateColumn?: boolean;
    onRowClick?: (row: T) => void;
    header?: string | ReactNode;
  } = {},
) {
  const visibleColumns = columns.filter((el) => el.defaultVisible);
  const collapsedColumns = columns.filter((el) => !el.defaultVisible);

  if (!rows.length) {
    return <EmptyBox noResultText={noResultText} />;
  }

  return (
    <Flex gap={10} direction="column" mb={10}>
      {rows.map((row, idx) => (
        <Card
          key={idx}
          shadow="lg"
          withBorder
          onClick={onRowClick?.bind(null, row)}
          px={0}
          py={5}
          radius={8}
        >
          {header && <Header value={header} />}
          <Flex direction="column">
            {visibleColumns.map((column, idx) => (
              <CardRow key={idx} column={column} row={row} />
            ))}
            <Collapse>
              {collapsedColumns.map((column, idx) => (
                <CardRow key={idx} column={column} row={row} />
              ))}
              {hasUpdateColumn && (
                <LastUpdated
                  lastModifiedBy={row.lastModifiedBy ?? ""}
                  updatedAt={row.updatedAt ?? undefined}
                />
              )}
            </Collapse>
          </Flex>
        </Card>
      ))}
    </Flex>
  );
}

const Header = ({ value }: { value?: string | ReactNode }) => {
  if (React.isValidElement(value)) {
    return value;
  }

  return (
    <Text fw="bold" fz="24" px={16} py={8} className={classes.header}>
      {value}
    </Text>
  );
};

function CardRow<T extends GenericObject>({
  column,
  row,
}: {
  column: DataGridColumnProps;
  row: T;
}) {
  return (
    <Flex
      key={column.key}
      w="100%"
      justify="space-between"
      align="center"
      gap={5}
      py={8}
      px={16}
      className={classes.item}
    >
      <Text fw="bold" miw="25%" maw="30%">
        {column.headerMobile ?? column.header}
      </Text>
      <Flex ta="end" style={column.style}>
        {_render(row, column)}
      </Flex>
    </Flex>
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

const LastUpdated = ({
  lastModifiedBy,
  updatedAt,
}: {
  hasActionColumn?: boolean;
  lastModifiedBy: string;
  updatedAt?: Date;
}) => {
  const t = useTranslation();

  const item = (title: string, content: string) => {
    return (
      <Flex
        w="100%"
        justify="space-between"
        align="center"
        py={8}
        px={16}
        className={classes.item}
      >
        <Text fw="bold" miw="25%" maw="30%">
          {title}
        </Text>
        <Flex ta="end">{content}</Flex>
      </Flex>
    );
  };

  return (
    <>
      {item(t("Last modifier"), (lastModifiedBy as string) || "-")}
      {item(t("Last updated"), formatTime(updatedAt))}
    </>
  );
};
