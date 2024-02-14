import { Product } from "@/services/domain";
import { Box } from "@mantine/core";

const MenuItem = ({ product }: { product?: Product }) => {
  return product ? (
    <Box
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
  ) : (
    <></>
  );
};

export default MenuItem;
