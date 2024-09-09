import {
  Collapse as CollapseMantine,
  Flex,
  Group,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { IconChevronDown, IconChevronUp } from "@tabler/icons-react";
import { useCallback, useMemo } from "react";

type CollapseProps = {
  children?: React.ReactNode;
};
const Collapse = ({ children }: CollapseProps) => {
  const [opened, { toggle }] = useDisclosure(false);

  const icon = useMemo(
    () =>
      !opened ? (
        <IconChevronDown color="gray" />
      ) : (
        <IconChevronUp color="gray" />
      ),
    [opened],
  );

  const handleClick = useCallback(
    (event: React.MouseEvent) => {
      event.stopPropagation();
      toggle();
    },
    [toggle],
  );

  return (
    <Flex w="100%" direction={opened ? "column-reverse" : "column"}>
      <Group justify="center" w="100%" onClick={handleClick}>
        {icon}
      </Group>
      <CollapseMantine
        in={opened}
        style={{ borderTop: "1px solid var(--border-color)" }}
      >
        {children}
      </CollapseMantine>
    </Flex>
  );
};
export default Collapse;
