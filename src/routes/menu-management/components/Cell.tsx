import { Product } from "@/services/domain";
import { Box, Table } from "@mantine/core";
import MenuItem from "./MenuItem";

type CellProps = {
  date?: string;
  products: Product[];
  onClick?: () => void;
};

const Cell = ({ date, products, onClick }: CellProps) => {
  return (
    <Table.Td
      onClick={onClick}
      height={150}
      style={{
        cursor: "pointer",
        verticalAlign: "top",
      }}
    >
      <Box fz={16} fw={900} mb={2} w="100%" ta="right">
        {date}
      </Box>
      {products.map((product: Product, idx) => (
        <MenuItem key={idx} product={product} />
      ))}
    </Table.Td>
  );
};

export default Cell;
