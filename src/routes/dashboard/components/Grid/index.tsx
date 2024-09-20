import { SimpleGrid } from "@mantine/core";

type GridProps = {
  children: React.ReactNode;
};

const Grid = ({ children }: GridProps) => {
  return (
    <SimpleGrid
      cols={{ base: 1, md: 4, sm: 3, xs: 2 }}
      mt="md"
      spacing={{ base: "sm", md: "lg" }}
    >
      {children}
    </SimpleGrid>
  );
};

export default Grid;
