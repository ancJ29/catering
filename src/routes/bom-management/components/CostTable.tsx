import useTranslation from "@/hooks/useTranslation";
import { numberWithDelimiter } from "@/utils";
import { Table } from "@mantine/core";
import { useMemo } from "react";
import store from "../_bom.store";
import { FilterType, _customizeKey } from "../_configs";

const CostTable = ({ condition }: { condition: FilterType }) => {
  const t = useTranslation();
  const customizeKey = useMemo(
    () => _customizeKey(condition),
    [condition],
  );
  const [cost, originCost, change] = useMemo(() => {
    const cost = store.cost(customizeKey);
    const originCost = store.originCost(customizeKey);
    let change = 0;
    if (originCost) {
      change =
        Math.round((10000 * (cost - originCost)) / originCost) / 100;
    }
    return [cost, originCost, change];
  }, [customizeKey]);

  return (
    <Table withTableBorder mt={10}>
      <Table.Tbody>
        <Table.Tr>
          <Table.Td fw={700} w="70%">
            {t("Estimated cost")}
          </Table.Td>
          <Table.Td
            ta="right"
            style={{
              borderLeft: "1px solid var(--border-color)",
            }}
          >
            {numberWithDelimiter(cost)}
          </Table.Td>
          <Table.Td
            ta="center"
            w="80px"
            style={{
              borderLeft: "1px solid var(--border-color)",
            }}
          >
            VNĐ
          </Table.Td>
        </Table.Tr>
        <Table.Tr>
          <Table.Td fw={700} w="70%">
            {t("Previous saved cost")}
          </Table.Td>
          <Table.Td
            ta="right"
            style={{
              borderLeft: "1px solid var(--border-color)",
            }}
          >
            {numberWithDelimiter(originCost)}
          </Table.Td>
          <Table.Td
            ta="center"
            w="80px"
            style={{
              borderLeft: "1px solid var(--border-color)",
            }}
          >
            VNĐ
          </Table.Td>
        </Table.Tr>
        <Table.Tr>
          <Table.Td fw={700} w="70%">
            {t("Change ratio")}
          </Table.Td>
          <Table.Td
            ta="right"
            style={{
              borderLeft: "1px solid var(--border-color)",
            }}
          >
            {numberWithDelimiter(change)}
          </Table.Td>
          <Table.Td
            ta="center"
            w="80px"
            style={{
              borderLeft: "1px solid var(--border-color)",
            }}
          >
            %
          </Table.Td>
        </Table.Tr>
        <Table.Tr>
          <Table.Td fw={700} w="70%">
            {t("Cost per sale price")}
          </Table.Td>
          <Table.Td
            ta="right"
            style={{
              borderLeft: "1px solid var(--border-color)",
            }}
          >
            {numberWithDelimiter(condition.target?.price || 0)}
          </Table.Td>
          <Table.Td
            ta="center"
            w="80px"
            style={{
              borderLeft: "1px solid var(--border-color)",
            }}
          >
            VNĐ
          </Table.Td>
        </Table.Tr>
      </Table.Tbody>
    </Table>
  );
};

export default CostTable;
