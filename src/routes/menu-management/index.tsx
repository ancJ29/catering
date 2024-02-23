import { Actions } from "@/auto-generated/api-configs";
import Autocomplete from "@/components/common/Autocomplete";
import Select from "@/components/common/Select";
import useOnMounted from "@/hooks/useOnMounted";
import useTranslation from "@/hooks/useTranslation";
import callApi from "@/services/api";
import {
  Customer,
  DailyMenuStatus,
  dailyMenuKey,
  getDailyMenu,
} from "@/services/domain";
import useCateringStore from "@/stores/catering.store";
import useCustomerStore from "@/stores/customer.store";
import useDailyMenuStore from "@/stores/daily-menu.store";
import useProductStore from "@/stores/product.store";
import {
  ONE_DAY,
  ONE_WEEK,
  firstMonday,
  formatTime,
  lastSunday,
  startOfDay,
  startOfWeek,
  stopMouseEvent,
} from "@/utils";
import { Button, Flex, Stack, Table, Text } from "@mantine/core";
import { modals } from "@mantine/modals";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Target, weekdays } from "./_configs";
import BlankTableBody from "./components/BlankTableBody";
import Cell from "./components/Cell";
import DateControll from "./components/DateControll";
import ModalTitle from "./components/ModalTitle";
import RadioGroup from "./components/RadioGroup";
import EditModal from "./modal";

const MenuManagement = () => {
  const t = useTranslation();
  const navigate = useNavigate();
  const { hash } = useLocation();
  const { reload: loadAllProducts } = useProductStore();
  const { dailyMenu, push: pushDailyMenu } = useDailyMenuStore();
  const {
    idByName: customerIdByName,
    customers,
    reload: loadAllCustomers,
  } = useCustomerStore();
  const {
    caterings,
    cateringIdByName,
    reload: loadAllCaterings,
  } = useCateringStore();
  const [mode, setMode] = useState<"M" | "W">("W");
  const [markDate, setMarkDate] = useState(startOfDay(Date.now()));
  const [target, setTarget] = useState<Target>();
  const [shift, setShift] = useState<string>();
  const [cateringId, setCateringId] = useState<string>();
  const [selectedCustomer, setSelectedCustomer] =
    useState<Customer>();

  useOnMounted(loadAllProducts);
  useOnMounted(loadAllCustomers);
  useOnMounted(loadAllCaterings);

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
      }).then(pushDailyMenu);
    },
    [markDate, pushDailyMenu, selectedCustomer?.id],
  );

  const controlBar = useMemo(() => {
    const cateringData = Array.from(caterings.values()).map(
      (c) => c.name,
    );

    const customerData = Array.from(customers.values())
      .filter((c) => {
        return cateringId ? c.others.cateringId === cateringId : true;
      })
      .map((el) => el.name);

    const targetData: string[] =
      selectedCustomer?.others.targets.map((el) => el.name) || [];

    let cateringDefaultValue = "";
    if (selectedCustomer) {
      const cateringId = selectedCustomer.others.cateringId;
      const catering = caterings.get(cateringId);
      cateringDefaultValue = catering?.name || "";
    }

    const autoCompleteDefaultValue =
      customerData?.length === 1
        ? customerData[0]
        : selectedCustomer?.name || "";

    const _clearAll = () => {
      setCateringId(undefined);
      setSelectedCustomer(undefined);
      setTarget(undefined);
      setShift(undefined);
    };

    const _selectCustomer = (
      name: string,
      clearOnNotFound = false,
    ) => {
      const id = customerIdByName.get(name);
      const customer = id ? customers.get(id) : undefined;
      if (customer) {
        const target = customer?.others.targets[0];
        setSelectedCustomer(customer);
        setTarget(target);
        setShift(target?.shifts[0]);
      } else if (!name || clearOnNotFound) {
        setSelectedCustomer(undefined);
        setTarget(undefined);
        setShift(undefined);
      }
    };

    const _shiftMarkDate = (diff = -1) => {
      if (mode === "W") {
        setMarkDate((el) => el + diff * ONE_WEEK);
      } else {
        setMarkDate((el) => {
          const date = new Date(el);
          date.setMonth(date.getMonth() + diff);
          return date.getTime();
        });
      }
    };

    const _selectTarget = (name: string | null) => {
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
    };

    const _selectCatering = (value: string | null) => {
      if (!value || !cateringIdByName.has(value)) {
        !value && setCateringId(undefined);
        return;
      }
      const cateringId = cateringIdByName.get(value);
      const catering = caterings.get(cateringId || "");
      if (!catering) {
        return;
      }
      setCateringId(cateringId);
      const list = Array.from(customers.values()).filter((c) => {
        return c.others.cateringId === cateringId;
      });
      if (list.length === 1) {
        _selectCustomer(list[0].name);
      }
    };

    return (
      <Flex gap={10} w="100%" justify="space-between" align="end">
        <Flex gap={10} justify="start" align="end">
          <Autocomplete
            key={`1.${cateringDefaultValue}`}
            label={t("Catering name")}
            data={cateringData}
            disabled={cateringData.length < 2}
            defaultValue={cateringDefaultValue || undefined}
            onChange={_selectCatering}
            onEnter={_selectCatering}
          />
          <Autocomplete
            key={`2.${autoCompleteDefaultValue}`}
            label={t("Customer")}
            data={customerData}
            disabled={customerData.length < 2}
            defaultValue={autoCompleteDefaultValue}
            onChange={_selectCustomer}
            onEnter={(value) => _selectCustomer(value, true)}
          />
          <Select
            value={target?.name}
            label={t("Customer target")}
            data={targetData}
            onChange={_selectTarget}
          />
          {mode === "M" && target?.shifts?.length && (
            <RadioGroup
              shifts={target.shifts}
              shift={shift || ""}
              setShift={setShift}
            />
          )}
          <Button onClick={_clearAll}>{t("Clear")}</Button>
        </Flex>
        <DateControll
          mode={mode}
          onShift={_shiftMarkDate}
          onChangeMode={setMode}
        />
      </Flex>
    );
  }, [
    customers,
    selectedCustomer,
    caterings,
    target,
    mode,
    shift,
    cateringId,
    customerIdByName,
    cateringIdByName,
    t,
  ]);

  const { monthView, weekView, headers } = useMemo(() => {
    const openModal = (timestamp: number, shift: string) => {
      const customerId = selectedCustomer?.id || "";
      const targetName = target?.name || "";
      if (!customerId || !targetName || !selectedCustomer) {
        return;
      }
      const key = dailyMenuKey(
        selectedCustomer?.id || "",
        target?.name || "",
        shift,
        timestamp,
      );
      const date = formatTime(timestamp, "YYYY-MM-DD");
      const cateringId = selectedCustomer.others.cateringId;
      const catering = caterings.get(cateringId || "");
      const cateringName = catering?.name || "";
      const title = `${date}: ${selectedCustomer.name} > ${targetName} > ${shift} (${cateringName})`;
      const save = (
        productIds: string[],
        quantity: Map<string, number>,
      ) => {
        if (!timestamp || !selectedCustomer) {
          modals.closeAll();
          return;
        }
        modals.openConfirmModal({
          title: `${t("Update menu")}`,
          children: (
            <Text size="sm">
              {t("Are you sure you want to save menu?")}
            </Text>
          ),
          labels: { confirm: "OK", cancel: t("Cancel") },
          onConfirm: async () => {
            await callApi<unknown, unknown>({
              action: Actions.PUSH_DAILY_MENU,
              params: {
                date: new Date(timestamp),
                targetName: target?.name || "",
                shift,
                status: "CONFIRMED",
                customerId: selectedCustomer.id || "",
                quantity: Object.fromEntries(
                  productIds
                    .map(
                      (productId) =>
                        [productId, quantity.get(productId) || 0] as [
                          string,
                          number,
                        ],
                    )
                    .filter(([, count]) => count > 0),
                ),
              },
            });
            await _getDailyMenu(true);
            modals.closeAll();
          },
        });
      };
      const m = dailyMenu.get(key);
      modals.open({
        title: <ModalTitle title={title} />,
        fullScreen: true,
        onClick: stopMouseEvent,
        onClose: modals.closeAll,
        children: (
          <EditModal
            status={m?.others.status || _status()}
            quantity={
              new Map(Object.entries(m?.others.quantity || {}))
            }
            onSave={save}
          />
        ),
      });
    };
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
    const isWeekView = mode === "W";
    const from = isWeekView
      ? startOfWeek(markDate)
      : firstMonday(markDate);
    const to = isWeekView ? from + 6 * ONE_DAY : lastSunday(markDate);

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
                const key = dailyMenuKey(
                  selectedCustomer?.id || "",
                  target.name,
                  shift,
                  header.timestamp || 0,
                );
                const m = dailyMenu.get(key);
                const quantity = new Map(
                  Object.entries(m?.others.quantity || {}),
                );
                return (
                  <Cell
                    key={idx}
                    status={m?.others.status || _status()}
                    quantity={quantity}
                    onClick={openModal.bind(
                      null,
                      header.timestamp || 0,
                      shift,
                    )}
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
                const key = dailyMenuKey(
                  selectedCustomer?.id || "",
                  target?.name || "",
                  shift || "",
                  cell.timestamp,
                );
                const m = dailyMenu.get(key);
                return (
                  <Cell
                    key={idx}
                    date={cell.date}
                    status={m?.others.status || _status()}
                    quantity={
                      new Map(
                        Object.entries(m?.others.quantity || {}),
                      )
                    }
                    onClick={openModal.bind(
                      null,
                      cell.timestamp,
                      shift || "",
                    )}
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
    caterings,
    dailyMenu,
    markDate,
    mode,
    selectedCustomer,
    shift,
    target,
    t,
    _getDailyMenu,
  ]);

  useEffect(_getDailyMenu, [_getDailyMenu]);

  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    if (loaded || !customers.size) {
      return;
    }
    setLoaded(true);
    const data = hash
      ? _parseHash(hash, customerIdByName, customers)
      : undefined;
    if (data) {
      setMode(data.mode);
      setMarkDate(data.markDate);
      setSelectedCustomer(data.customer);
      setTarget(data.target);
      setShift(data.shift);
    }
  }, [customerIdByName, customers, hash, loaded]);

  useEffect(() => {
    if (loaded) {
      navigate(
        _hash(
          mode,
          markDate,
          selectedCustomer?.name,
          target?.name,
          shift,
        ),
      );
    }
  }, [
    hash,
    loaded,
    shift,
    markDate,
    mode,
    navigate,
    selectedCustomer,
    target,
  ]);

  return (
    <Stack gap={10}>
      {controlBar}
      <Table withTableBorder withColumnBorders>
        <Table.Thead>
          <Table.Tr>
            {mode === "W" && <Table.Th w={60}>&nbsp;</Table.Th>}
            {headers.map((el, idx) => {
              return (
                <Table.Th ta="center" key={idx} w="14.2857%">
                  {el.label}
                </Table.Th>
              );
            })}
          </Table.Tr>
        </Table.Thead>
        {selectedCustomer?.id ? (
          mode === "W" ? (
            weekView
          ) : (
            monthView
          )
        ) : (
          <BlankTableBody mode={mode} />
        )}
      </Table>
    </Stack>
  );
};

export default MenuManagement;

function _parseHash(
  hash: string,
  customerIdByName: Map<string, string>,
  customers: Map<string, Customer>,
) {
  const [mode, markDate, customerName, targetName, shift] = window
    .atob(hash.slice(1))
    .split(".")
    .map(decodeURIComponent);

  if (!customerName || isNaN(parseInt(markDate || "x"))) {
    return;
  }
  if (mode != "M" && mode != "W") {
    return;
  }
  const customerId = customerIdByName.get(customerName);
  const customer = customers.get(customerId || "");
  if (!customer) {
    return;
  }
  const target = customer.others.targets.find(
    (el) => el.name === targetName,
  );
  if (!target) {
    return;
  }
  if (!shift && !target.shifts.includes(shift)) {
    return;
  }
  return {
    mode: mode as "M" | "W",
    markDate: parseInt(markDate) * ONE_DAY,
    customer,
    target,
    shift,
  };
}

function _hash(
  mode: string,
  markDate: number,
  customerName?: string,
  targetName?: string,
  shift?: string,
) {
  if (!customerName) {
    return "";
  }
  const hash = window.btoa(
    [
      mode,
      Math.floor(markDate / ONE_DAY),
      customerName,
      targetName,
      shift,
    ]
      .filter(Boolean)
      .map((el) => encodeURIComponent(el?.toString() || ""))
      .join("."),
  );
  return "#" + hash;
}

function _status() {
  const list = [
    "NEW",
    "WAITING",
    "CONFIRMED",
    "PROCESSING",
    "READY",
    "DELIVERED",
  ] as DailyMenuStatus[];
  return list[Math.floor(Math.random() * list.length)];
}
