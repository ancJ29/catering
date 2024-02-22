import Autocomplete from "@/components/common/Autocomplete";
import Select from "@/components/common/Select";
import useOnMounted from "@/hooks/useOnMounted";
import useTranslation from "@/hooks/useTranslation";
import { Customer, DailyMenu, getDailyMenu } from "@/services/domain";
import logger from "@/services/logger";
import useCustomerStore from "@/stores/customer.store";
import useProductStore from "@/stores/product.store";
import {
  ONE_DAY,
  ONE_WEEK,
  firstMonday,
  formatTime,
  lastSunday,
  startOfWeek,
} from "@/utils";
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
import { useCallback, useEffect, useMemo, useState } from "react";
import { Target, weekdays } from "./_configs";
import Cell from "./components/Cell";

const MenuManagement = () => {
  const t = useTranslation();
  const { reload: loadAllProducts } = useProductStore();
  const {
    idByName: customerIdByName,
    customers,
    reload: loadAllCustomers,
  } = useCustomerStore();
  const [mode, setMode] = useState<"M" | "W">("W");
  const [markDate, setMarkDate] = useState(Date.now());
  const [[W, M]] = useState([t("Weekly"), t("Monthly")]);
  const [dailyMenu, setDailyMenu] = useState<Map<string, DailyMenu>>(
    new Map(),
  );

  useOnMounted(loadAllProducts);
  useOnMounted(loadAllCustomers);

  const [target, setTarget] = useState<Target>();
  const [shift, setShift] = useState<string>();
  const [selectedCustomer, setSelectedCustomer] =
    useState<Customer>();

  const _selectCustomer = useCallback(
    (name: string) => {
      const id = customerIdByName.get(name);
      const customer = id ? customers.get(id) : undefined;
      if (customer) {
        const target = customer?.others.targets[0];
        setSelectedCustomer(customer);
        setTarget(target);
        setShift(target?.shifts[0]);
      }
    },
    [customerIdByName, customers],
  );

  const targetData = useMemo(() => {
    return selectedCustomer?.others.targets.map((el) => el.name);
  }, [selectedCustomer]);

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

  const _getDailyMenu = useCallback(
    (noCache = false) => {
      if (!selectedCustomer?.id) {
        return;
      }
      getDailyMenu({
        noCache,
        customerId: selectedCustomer?.id,
        from: markDate - 4 * ONE_WEEK,
        to: markDate + 4 * ONE_WEEK,
      }).then((data: DailyMenu[]) => {
        setDailyMenu((dailyMenu) => {
          data.forEach((el) => {
            const { targetName, shift } = el.others;
            const date = el.date.getTime();
            const key = `${el.customerId}.${targetName}.${shift}.${date}`;
            dailyMenu.set(key, el);
          });
          return new Map(dailyMenu);
        });
      });
    },
    [markDate, selectedCustomer],
  );

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
    const quantityByDate = new Map<string, Map<string, number>>();
    const isWeekView = mode === "W";
    const from = isWeekView
      ? startOfWeek(markDate)
      : firstMonday(markDate);
    const to = isWeekView ? from + 6 * ONE_DAY : lastSunday(markDate);

    if (target) {
      for (let date = from; date <= to; date += ONE_DAY) {
        for (const shift of target.shifts) {
          const key = `${selectedCustomer?.id}.${
            target.name
          }.${shift}.${new Date(date).getTime()}`;
          logger.trace("dailyMenu has key", key, dailyMenu.has(key));
          if (dailyMenu.has(key)) {
            const menu = dailyMenu.get(key);
            quantityByDate.set(
              key,
              new Map(Object.entries(menu?.others.quantity || {})),
            );
            continue;
          }
        }
      }
    }

    if (isWeekView) {
      headers = weekdays.map((el, idx) => {
        const timestamp = from + idx * ONE_DAY;
        return {
          label: `${formatTime(timestamp, "DD/MM")} (${t(el)})`,
          timestamp,
        };
      });
      weekView = (
        <Table.Tbody>
          {target?.shifts.map((shift, idx) => (
            <Table.Tr key={idx}>
              <Table.Td>{shift}</Table.Td>
              {headers.map((header, idx) => {
                const key = `${selectedCustomer?.id}.${
                  target.name
                }.${shift}.${header.timestamp || 0}`;
                return (
                  <Cell
                    onReload={_getDailyMenu.bind(null, true)}
                    targetName={target.name}
                    shift={shift}
                    key={idx}
                    customer={selectedCustomer}
                    timestamp={header.timestamp}
                    quantity={quantityByDate.get(key) || new Map()}
                  />
                );
              })}
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
                date: formatTime(timestamp, "DD/MM"),
              };
            },
          );
        },
      );
      monthView = (
        <Table.Tbody>
          {rows.map((cells, idx) => (
            <Table.Tr key={idx}>
              {cells.map((cell, idx) => {
                const key = `${selectedCustomer?.id}.${target?.name}.${shift}.${cell.timestamp}`;
                return (
                  <Cell
                    onReload={_getDailyMenu.bind(null, true)}
                    targetName={target?.name || ""}
                    shift={shift || ""}
                    customer={selectedCustomer}
                    key={idx}
                    date={cell.date}
                    timestamp={cell.timestamp}
                    quantity={quantityByDate.get(key) || new Map()}
                  />
                );
              })}
            </Table.Tr>
          ))}
        </Table.Tbody>
      );
    }
    return { rows, headers, weekView, monthView };
  }, [
    dailyMenu,
    markDate,
    mode,
    selectedCustomer,
    shift,
    target,
    _getDailyMenu,
    t,
  ]);

  const customerData = useMemo(() => {
    return Array.from(customers.values()).map((el) => el.name);
  }, [customers]);

  const controlBar = useMemo(() => {
    return (
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
            <IconChevronLeft className="c-catering-btn-icon" />
          </UnstyledButton>
          <SegmentedControl
            value={mode === "W" ? W : M}
            data={[W, M]}
            onChange={_setMode}
          />
          <UnstyledButton onClick={_shiftMarkDate.bind(null, 1)}>
            <IconChevronRight className="c-catering-btn-icon" />
          </UnstyledButton>
        </Flex>
      </Flex>
    );
  }, [
    M,
    W,
    _selectCustomer,
    _selectTarget,
    _setMode,
    _shiftMarkDate,
    customerData,
    mode,
    shift,
    t,
    target,
    targetData,
  ]);

  useEffect(_getDailyMenu, [_getDailyMenu]);

  return (
    <Stack gap={10}>
      {controlBar}
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

export default MenuManagement;
