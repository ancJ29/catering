import useTranslation from "@/hooks/useTranslation";
import { MantineStyleProp } from "@mantine/core";
import cls from "classnames";
import Scroll from "../Scroll";
import classes from "./FlexTable.module.scss";
import { Table as TableMantine } from "@mantine/core";
import React from "react";
import Wrapper from "./Wrapper";

type Header = {
  style?: MantineStyleProp;
  label: string;
};

type Props = {
  headers: Header[];
  dataLength: number;
  rows: React.ReactNode;
  handleScroll?: () => void;
  hasMore?: boolean;
  headerClassName?: string;
  tableWrapperClassName?: string;
  haveAction?: boolean;
};

const Table = ({
  headers,
  dataLength,
  rows,
  hasMore,
  handleScroll,
  headerClassName,
  tableWrapperClassName,
  haveAction = true,
}: Props) => {
  const t = useTranslation();

  return (
    <Wrapper
      tableWrapperClassName={cls(
        classes.tableWrapper,
        tableWrapperClassName,
      )}
    >
      <TableMantine pos="relative">
        <TableMantine.Thead pos="sticky" top={0}>
          <TableMantine.Tr
            className={cls(classes.header, headerClassName)}
          >
            {headers?.map(({ style, label }, index) => (
              <TableMantine.Th key={index} style={style} px={0}>
                {t(label)}
              </TableMantine.Th>
            ))}
            {haveAction && (
              <TableMantine.Th style={{ flex: 1 }}>
                &nbsp;
              </TableMantine.Th>
            )}
          </TableMantine.Tr>
        </TableMantine.Thead>
        <TableMantine.Tbody>
          <Scroll
            dataLength={dataLength}
            hasMore={hasMore}
            handleScroll={handleScroll}
            rows={rows}
          />
        </TableMantine.Tbody>
      </TableMantine>
    </Wrapper>
  );
};

export default Table;
