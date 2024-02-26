import { Box, Flex, Text } from "@mantine/core";
import { IconCircleMinus, IconCirclePlus } from "@tabler/icons-react";

type Base = {
  id: string;
  name: string;
};

type SelectorProps<T> = {
  data: T[];
  selectedIds: string[];
  disabled?: boolean;
  onAdd: (id: string) => void;
  onRemove: (id: string) => void;
  labelGenerator?: (el: T) => React.ReactNode;
};
function Selector<T extends Base>({
  data,
  selectedIds,
  disabled,
  onAdd,
  onRemove,
  labelGenerator,
}: SelectorProps<T>) {
  return (
    <>
      {data.map((p) => {
        const existed = selectedIds.includes(p.id);
        const Icon = existed ? IconCircleMinus : IconCirclePlus;
        return (
          <Box
            style={{
              cursor: disabled ? "not-allowed" : "pointer",
              borderRadius: "5px",
            }}
            bg={existed ? "primary.4" : undefined}
            className={disabled ? "" : "c-catering-hover-bg"}
            key={p.id}
            w="100%"
            p={10}
            mb={4}
            onClick={() => {
              if (disabled) {
                return;
              }
              if (existed) {
                onRemove(p.id);
              } else {
                onAdd(p.id);
              }
            }}
          >
            <Flex gap={5}>
              <Icon />
              <Text>
                {labelGenerator ? labelGenerator(p) : p.name}
              </Text>
            </Flex>
          </Box>
        );
      })}
    </>
  );
}

export default Selector;
