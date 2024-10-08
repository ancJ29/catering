import { SimpleGrid, SimpleGridProps } from "@mantine/core";

interface GridProps extends SimpleGridProps {
  children: React.ReactNode;
}

const Grid = ({ children, ...props }: GridProps) => {
  return (
    <SimpleGrid
      cols={{ base: 1, md: 4, sm: 3, xs: 2 }}
      mt="md"
      spacing={{ base: "sm", md: "lg" }}
      {...props}
    >
      {children}
    </SimpleGrid>
  );
};

export default Grid;
