import useTranslation from "@/hooks/useTranslation";
import {
  Box,
  Card,
  Grid,
  MantineStyleProp,
  Text,
} from "@mantine/core";
import cls from "classnames";
import React from "react";
import { BrowserView, MobileView } from "react-device-detect";
import Scroll from "../Scroll";
import classes from "./GridTable.module.scss";

type Header = {
  style?: MantineStyleProp;
  label: string;
  gridCol?: number;
};

type Cell = {
  style?: MantineStyleProp;
  label: string;
  gridCol?: number;
  value: React.ReactNode;
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

const GridTable = ({
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
    <>
      <Card
        className={cls(classes.tableWrapper, tableWrapperClassName)}
        p={0}
        radius={8}
        mt={20}
        w="100%"
        shadow="none"
      >
        <BrowserView>
          <Grid className={cls(classes.header, headerClassName)}>
            {headers?.map(({ label, gridCol }, index) => (
              <Grid.Col key={index} span={gridCol || 1}>
                {t(label)}
              </Grid.Col>
            ))}
            {haveAction && <Grid.Col span={1}>&nbsp;</Grid.Col>}
          </Grid>
        </BrowserView>
        <Scroll
          dataLength={dataLength}
          hasMore={hasMore}
          handleScroll={handleScroll}
          rows={rows}
        />
      </Card>
    </>
  );
};

export default GridTable;

export function rowsBuilder<T>({
  records,
  _rowBuilder,
  t,
  actionBuilder,
}: {
  records: T[];
  _rowBuilder: (record: T) => Cell[];
  t: (key: string) => string;
  actionBuilder?: (record: T) => React.ReactNode;
}) {
  return records?.map((record: T, index: number) => (
    <Box className={classes.row} key={index}>
      <MobileView>
        {_rowBuilder(record).map(({ label, style, value }, index) => {
          return (
            <Box key={index} className={classes.cell} style={style}>
              <Text className={classes.label}>{t(label || "")}</Text>
              {value}
            </Box>
          );
        })}
        {actionBuilder && (
          <Box className={classes.cell}>
            <Text className={classes.label}></Text>
            {actionBuilder(record)}
          </Box>
        )}
      </MobileView>
      <BrowserView>
        <Grid key={index}>
          {_rowBuilder(record).map(({ gridCol, value }, index) => {
            return (
              <Grid.Col
                key={index}
                span={gridCol || 1}
                className={classes.cell}
              >
                {value}
              </Grid.Col>
            );
          })}
          {actionBuilder && (
            <Grid.Col span={1}>{actionBuilder(record)}</Grid.Col>
          )}
        </Grid>
      </BrowserView>
    </Box>
  ));
}
