import {
  DailyMenuStatus,
  dailyMenuStatusColor,
} from "@/services/domain";
import useProductStore from "@/stores/product.store";
import { Box, Table } from "@mantine/core";

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
  const { products: allProducts } = useProductStore();
  return (
    <Table.Td
      onClick={onClick}
      height={150}
      style={{
        position: "relative",
        cursor: "pointer",
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
            bg="teal.6"
            style={{
              userSelect: "none",
              borderRadius: "5px",
            }}
          >
            {product?.name || "--"}
          </Box>
        ))}
      <Box
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          padding: "1px",
          width: "100%",
          display: "flex",
          justifyContent: "start",
          alignItems: "center",
        }}
      ></Box>
    </Table.Td>
  );
};

export default Cell;
