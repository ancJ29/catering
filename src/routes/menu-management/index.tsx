/* eslint-disable @typescript-eslint/no-unused-vars */
import { Actions } from "@/auto-generated/api-configs";
import Autocomplete from "@/components/common/Autocomplete";
import useOnMounted from "@/hooks/useOnMounted";
import useTranslation from "@/hooks/useTranslation";
import { loadAll } from "@/services/data-loaders";
import { Box, Flex, Stack, Table } from "@mantine/core";
import dayjs from "dayjs";
import { useCallback, useMemo, useState } from "react";
import { Customer, Product, Target } from "./_configs";

const ONE_DAY = 1000 * 60 * 60 * 24;
const ONE_WEEK = ONE_DAY * 7;

const MenuManagement = () => {
  const t = useTranslation();
  const [customers, setCustomers] = useState<Map<string, Customer>>();
  const [products, setProducts] = useState<Map<string, Product>>();
  const customerData = useMemo(() => {
    return [...(customers?.keys() || [])];
  }, [customers]);
  const [selectedCustomer, setSelectedCustomer] =
    useState<Customer>();
  const targetData = useMemo(() => {
    return selectedCustomer?.others.targets.map((el) => el.name);
  }, [selectedCustomer]);

  const _load = useCallback(() => {
    loadAll<Product>({
      key: "products",
      action: Actions.GET_PRODUCTS,
    }).then((products) => {
      const _products = products.map((el) => {
        if (typeof el.name === "string") {
          const strings = el.name.split(".");
          el.name =
            strings.length > 1
              ? strings.slice(0, -1).join(".")
              : strings[0];
        }
        return el;
      });
      setProducts(new Map(_products.map((el) => [el.name, el])));
      loadAll<Customer>({
        key: "customers",
        action: Actions.GET_CUSTOMERS,
      }).then((customers) => {
        setCustomers(new Map(customers.map((el) => [el.name, el])));
        setSelectedCustomer(customers[0]);
        setTarget(customers[0].others.targets[0]);
      });
    });
  }, []);

  const [target, setTarget] = useState<Target>();

  const _selectCustomer = useCallback(
    (name: string) => {
      if (customers?.has(name)) {
        setSelectedCustomer(customers.get(name));
        setTarget(undefined);
      }
    },
    [customers],
  );

  const _selectTarget = useCallback(
    (name: string) => {
      if (targetData?.includes(name)) {
        const target = selectedCustomer?.others.targets.find(
          (el) => el.name === name,
        );
        setTarget(target);
      }
    },
    [targetData, selectedCustomer],
  );

  const [mode] = useState<"M" | "W">("M");
  const [startOfWeek] = useState(_startOfWeek(Date.now()));
  const [startOfMonth] = useState(_startOfMonth(Date.now()));
  const [endOfMonth] = useState(_endOfMonth(Date.now()));

  const headers = useMemo(() => {
    if (mode === "W") {
      // TODO: english
      return ["T2", "T3", "T4", "T5", "T6", "T7", "CN"].map(
        (el, idx) => {
          const date = startOfWeek + idx * ONE_DAY;
          return `${dayjs(date).format("DD/MM")} (${el})`;
        },
      );
    }
    return ["T2", "T3", "T4", "T5", "T6", "T7", "CN"];
  }, [mode, startOfWeek]);

  const rows = useMemo(() => {
    const weeks = Math.floor((endOfMonth - startOfMonth) / ONE_WEEK);
    return Array.from(
      {
        length: weeks,
      },
      (_, w) => {
        return ["T2", "T3", "T4", "T5", "T6", "T7", "CN"].map(
          (el, idx) => {
            const date = startOfMonth + w * ONE_WEEK + idx * ONE_DAY;
            return `${dayjs(date).format("DD/MM")} (${el})`;
          },
        );
      },
    );
  }, [endOfMonth, startOfMonth]);

  useOnMounted(_load);

  return (
    <Stack gap={10}>
      <Flex gap={10} justify="start" align="center">
        <Autocomplete
          label={t("Customer")}
          data={customerData}
          onChange={_selectCustomer}
        />
        <Autocomplete
          label={t("Customer target")}
          data={targetData}
          onChange={_selectTarget}
        />
      </Flex>
      <Table withTableBorder withColumnBorders>
        <Table.Thead>
          <Table.Tr>
            {mode === "W" && <Table.Th w={60}>&nbsp;</Table.Th>}
            {headers.map((el, idx) => {
              return (
                <Table.Th ta="center" key={idx}>
                  {el}
                </Table.Th>
              );
            })}
          </Table.Tr>
        </Table.Thead>
        {mode === "W" && (
          <Table.Tbody>
            {target?.shifts.map((shift, idx) => {
              return (
                <Table.Tr key={idx}>
                  <Table.Td>{shift}</Table.Td>
                  {headers.map((el, idx) => {
                    return (
                      <Table.Td key={idx} py={12}>
                        {_randomMenu([
                          ...(products?.values() || []),
                        ]).map((product) => {
                          return (
                            <Box
                              fz={12}
                              // c="white"
                              pl={8}
                              key={product.id}
                              bg="orange.4"
                              my={3}
                              style={{
                                userSelect: "none",
                                cursor: "pointer",
                                borderRadius: "5px",
                              }}
                            >
                              {product.name}
                            </Box>
                          );
                        })}
                      </Table.Td>
                    );
                  })}
                </Table.Tr>
              );
            })}
          </Table.Tbody>
        )}
        {mode === "M" && (
          <Table.Tbody>
            {rows.map((cells, idx) => {
              return (
                <Table.Tr key={idx}>
                  {cells.map((cell, idx) => {
                    return (
                      <Table.Td
                        key={idx}
                        style={{
                          verticalAlign: "top",
                        }}
                      >
                        <Box mb={2}>{cell}</Box>
                        {_randomMenu([
                          ...(products?.values() || []),
                        ]).map((product, idx) => {
                          return (
                            <Box
                              w="100%"
                              fz={12}
                              pl={8}
                              mt={4}
                              key={idx}
                              bg="orange.4"
                              style={{
                                userSelect: "none",
                                cursor: "pointer",
                                borderRadius: "5px",
                              }}
                            >
                              {product?.name || "--"}
                            </Box>
                          );
                        })}
                      </Table.Td>
                    );
                  })}
                </Table.Tr>
              );
            })}
          </Table.Tbody>
        )}
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

function _startOfMonth(timestamp: number) {
  const date = new Date(timestamp);
  date.setUTCDate(1);
  return _startOfWeek(date.getTime());
}

function _endOfMonth(timestamp: number) {
  let date = new Date(timestamp);
  date.setUTCMonth(date.getUTCMonth() + 1);
  date = new Date(date.getTime() - ONE_DAY);
  return _startOfWeek(date.getTime() + ONE_WEEK) - ONE_DAY;
}

function _startOfWeek(timestamp: number) {
  return timestamp - (timestamp % ONE_WEEK) - 3 * ONE_DAY;
}

export default MenuManagement;
