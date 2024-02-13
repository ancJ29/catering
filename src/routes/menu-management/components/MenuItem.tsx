import { Product } from "@/services/domain";
import { Box, useMantineTheme } from "@mantine/core";

const MenuItem = ({ product }: { product: Product }) => {
  const theme = useMantineTheme();
  return (
    <Box
      w="100%"
      fz={10}
      fw={900}
      c="white"
      pl={8}
      mt={4}
      bg={theme.colors.teal[6]}
      style={{
        userSelect: "none",
        borderRadius: "5px",
      }}
    >
      {product?.name || "--"}
    </Box>
  );
};

export default MenuItem;
