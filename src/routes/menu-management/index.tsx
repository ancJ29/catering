/* eslint-disable @typescript-eslint/no-unused-vars */
import Autocomplete from "@/components/common/Autocomplete";
import Select from "@/components/common/Select";
import useOnMounted from "@/hooks/useOnMounted";
import useTranslation from "@/hooks/useTranslation";
import {
  Customer,
  Product,
  getAllCustomers,
  getAllProducts,
} from "@/services/domain";
import { firstMonday, lastSunday, startOfWeek } from "@/utils";
import {
  Flex,
  Group,
  Radio,
  SegmentedControl,
  Stack,
  Table,
  UnstyledButton,
} from "@mantine/core";
import {
  IconChevronLeft,
  IconChevronRight,
} from "@tabler/icons-react";
import dayjs from "dayjs";
import { useCallback, useMemo, useState } from "react";
import { Target, weekdays } from "./_configs";
import Cell from "./components/Cell";

const ONE_DAY = 1000 * 60 * 60 * 24;
const ONE_WEEK = ONE_DAY * 7;

const MenuManagement = () => {
  const t = useTranslation();
  const [mode, setMode] = useState<"M" | "W">("W");
  const [markDate, setMarkDate] = useState(Date.now());
  const [[W, M]] = useState([t("Weekly"), t("Monthly")]);
  const [customers, setCustomers] = useState<Map<string, Customer>>();
  const [products, setProducts] = useState<Map<string, Product>>();
  const [target, setTarget] = useState<Target>();
  const [shift, setShift] = useState<string>();
  const [selectedCustomer, setSelectedCustomer] =
    useState<Customer>();

  const customerData = useMemo(() => {
    return [...(customers?.keys() || [])];
  }, [customers]);

  const { monthView, weekView, headers } = useMemo(() => {
    let weekView = <></>,
      monthView = <></>,
      rows: {
        date: string;
        timestamp: number;
      }[][] = [[]],
      headers: {
        label: string;
        timestamp?: number;
      }[] = weekdays.map((el) => ({ label: t(el) }));

    const menuItemsByDate = new Map<string, Product[]>();
    const _products = [...(products?.values() || [])];
    const isWeekView = mode === "W";
    const from = isWeekView
      ? startOfWeek(markDate)
      : firstMonday(markDate);
    const to = isWeekView ? from + 6 * ONE_DAY : lastSunday(markDate);

    if (target) {
      for (let date = from; date <= to; date += ONE_DAY) {
        target.shifts.forEach((shift) => {
          menuItemsByDate.set(
            `${shift}.${date}`,
            _randomMenu(_products),
          );
        });
      }
    }

    if (isWeekView) {
      headers = weekdays.map((el, idx) => {
        const timestamp = from + idx * ONE_DAY;
        return {
          label: `${dayjs(timestamp).format("DD/MM")} (${t(el)})`,
          timestamp,
        };
      });
      weekView = (
        <Table.Tbody>
          {target?.shifts.map((shift, idx) => (
            <Table.Tr key={idx}>
              <Table.Td>{shift}</Table.Td>
              {headers.map((header, idx) => (
                <Cell
                  key={idx}
                  products={
                    menuItemsByDate.get(
                      `${shift}.${header.timestamp || 0}`,
                    ) || []
                  }
                />
              ))}
            </Table.Tr>
          ))}
        </Table.Tbody>
      );
    } else {
      const weeks = Math.round((to - from) / ONE_WEEK);
      rows = Array.from(
        {
          length: weeks,
        },
        (_, w) => {
          return ["T2", "T3", "T4", "T5", "T6", "T7", "CN"].map(
            (_, idx) => {
              const timestamp = from + w * ONE_WEEK + idx * ONE_DAY;
              return {
                timestamp,
                date: dayjs(timestamp).format("DD/MM"),
              };
            },
          );
        },
      );
      monthView = (
        <Table.Tbody>
          {rows.map((cells, idx) => (
            <Table.Tr key={idx}>
              {cells.map((cell, idx) => (
                <Cell
                  key={idx}
                  date={cell.date}
                  products={
                    menuItemsByDate.get(
                      `${shift}.${cell.timestamp}`,
                    ) || []
                  }
                />
              ))}
            </Table.Tr>
          ))}
        </Table.Tbody>
      );
    }
    return { rows, headers, menuItemsByDate, weekView, monthView };
  }, [products, mode, markDate, target, t, shift]);

  const targetData = useMemo(() => {
    return selectedCustomer?.others.targets.map((el) => el.name);
  }, [selectedCustomer]);

  const _selectCustomer = useCallback(
    (name: string) => {
      if (customers?.has(name)) {
        const customer = customers.get(name);
        const target = customer?.others.targets[0];
        setSelectedCustomer(customer);
        setTarget(target);
        setShift(target?.shifts[0]);
      }
    },
    [customers],
  );

  const _selectTarget = useCallback(
    (name: string | null) => {
      if (!name) {
        return;
      }
      if (targetData?.includes(name)) {
        const target = selectedCustomer?.others.targets.find(
          (el) => el.name === name,
        );
        setTarget(target);
        setShift(target?.shifts[0]);
      }
    },
    [targetData, selectedCustomer],
  );

  const _load = useCallback(() => {
    Promise.all([getAllCustomers(), getAllProducts()]).then(
      ([customers, products]) => {
        setCustomers(new Map(customers.map((el) => [el.name, el])));
        setProducts(new Map(products.map((el) => [el.name, el])));
      },
    );
  }, []);

  const _setMode = useCallback(
    (value: string) => {
      if (value === W) {
        setMode("W");
      } else {
        setMode("M");
      }
    },
    [W],
  );

  const _shiftMarkDate = useCallback(
    (diff = -1) => {
      if (mode === "W") {
        setMarkDate((el) => el + diff * ONE_WEEK);
      } else {
        setMarkDate((el) => {
          const date = new Date(el);
          date.setMonth(date.getMonth() + diff);
          return date.getTime();
        });
      }
    },
    [mode],
  );

  useOnMounted(_load);

  return (
    <Stack gap={10}>
      <Flex gap={10} w="100%" justify="space-between" align="end">
        <Flex gap={10} justify="start" align="start">
          <Autocomplete
            label={t("Customer")}
            data={customerData}
            onChange={_selectCustomer}
          />
          <Select
            value={target?.name}
            label={t("Customer target")}
            data={targetData}
            onChange={_selectTarget}
          />
          {mode === "M" && target?.shifts?.length && (
            <Radio.Group
              label={t("shifts")}
              value={shift}
              onChange={setShift}
            >
              <Group>
                {target?.shifts.map((shift, idx) => {
                  return (
                    <Radio
                      disabled={target.shifts.length === 1}
                      h="2.2rem"
                      pt=".8rem"
                      key={idx}
                      value={shift}
                      label={shift}
                    />
                  );
                })}
              </Group>
            </Radio.Group>
          )}
        </Flex>
        <Flex justify="center" align="center">
          <UnstyledButton onClick={_shiftMarkDate.bind(null, -1)}>
            <IconChevronLeft />
          </UnstyledButton>
          <SegmentedControl
            value={mode === "W" ? W : M}
            data={[W, M]}
            onChange={_setMode}
          />
          <UnstyledButton onClick={_shiftMarkDate.bind(null, 1)}>
            <IconChevronRight />
          </UnstyledButton>
        </Flex>
      </Flex>
      <Table withTableBorder withColumnBorders>
        <Table.Thead>
          <Table.Tr>
            {mode === "W" && <Table.Th w={60}>&nbsp;</Table.Th>}
            {headers.map((el, idx) => {
              return (
                <Table.Th ta="center" key={idx}>
                  {el.label}
                </Table.Th>
              );
            })}
          </Table.Tr>
        </Table.Thead>
        {mode === "W" ? weekView : monthView}
      </Table>
    </Stack>
  );
};

function _randomMenu(products: Product[]) {
  const total = products.length;
  return Array.from(
    {
      length: 6,
    },
    () => {
      return products[Math.floor(Math.random() * total)];
    },
  );
}

export default MenuManagement;
