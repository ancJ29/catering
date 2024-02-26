import {
  DailyMenuStatus,
  dailyMenuStatusColor,
} from "@/services/domain";
import useAuthStore from "@/stores/auth.store";
import useProductStore from "@/stores/product.store";
import { Box, Table } from "@mantine/core";
import { useCallback } from "react";

type CellProps = {
  date?: string;
  status?: DailyMenuStatus;
  quantity: Map<string, number>;
  onClick: () => void;
};

const Cell = ({
  status = "NEW",
  quantity,
  date,
  onClick,
}: CellProps) => {
  const { isCatering } = useAuthStore();
  const { products: allProducts } = useProductStore();

  // simple ==> don't use useMemo
  const clickAble = quantity.size > 0 && isCatering;

  const _click = useCallback(() => {
    clickAble && onClick();
  }, [clickAble, onClick]);

  return (
    <Table.Td
      onClick={_click}
      height={150}
      style={{
        position: "relative",
        cursor: clickAble ? "pointer" : "default",
        verticalAlign: "top",
      }}
      bg={dailyMenuStatusColor(status, 1)}
    >
      <Box fz={16} fw={900} mb={2} w="100%" ta="right">
        {date}
      </Box>
      {Array.from(quantity.keys())
        .map((productId) => {
          return allProducts.get(productId);
        })
        .filter(Boolean)
        .map((product, idx) => (
          <Box
            key={idx}
            w="100%"
            fz={10}
            fw={900}
            c="white"
            pl={8}
            mt={4}
            bg={dailyMenuStatusColor(status, 9) || "primary.6"}
            style={{
              userSelect: "none",
              borderRadius: "5px",
            }}
          >
            {product?.name || "--"}
          </Box>
        ))}
    </Table.Td>
  );
};

export default Cell;
