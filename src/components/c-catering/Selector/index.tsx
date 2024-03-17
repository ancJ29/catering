import { Box, Flex, Text } from "@mantine/core";
import { IconCircleMinus, IconCirclePlus } from "@tabler/icons-react";
import { useCallback } from "react";

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
  const onClick = useCallback(
    (existed: boolean, id: string) => {
      if (disabled) {
        return;
      }
      existed ? onRemove(id) : onAdd(id);
    },
    [disabled, onAdd, onRemove],
  );

  return (
    <>
      {data.map((el) => {
        const existed = selectedIds.includes(el.id);
        const Icon = existed ? IconCircleMinus : IconCirclePlus;
        return (
          <Box
            style={{
              cursor: disabled ? "not-allowed" : "pointer",
              borderRadius: "5px",
            }}
            bg={existed ? "primary.4" : undefined}
            className={disabled ? "" : "c-catering-hover-bg"}
            key={el.id}
            w="100%"
            p={10}
            mb={4}
            onClick={onClick.bind(null, existed, el.id)}
          >
            <Flex gap={5}>
              <Icon />
              <Text>
                {labelGenerator ? labelGenerator(el) : el.name}
              </Text>
            </Flex>
          </Box>
        );
      })}
    </>
  );
}

export default Selector;
