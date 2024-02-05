import {
  Collapse as CollapseMantine,
  Group,
  Text,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { IconChevronDown, IconChevronUp } from "@tabler/icons-react";
import { useMemo } from "react";

type Props = {
  title?: string;
  children?: React.ReactNode;
  open?: boolean;
};
const Collapse = ({ title, children, open = false }: Props) => {
  const [opened, { toggle }] = useDisclosure(open);

  const icon = useMemo(
    () => (!opened ? <IconChevronDown /> : <IconChevronUp />),
    [opened],
  );

  return (
    <>
      <Group
        justify="space-between"
        w="100%"
        onClick={toggle}
        className="cursor-pointer"
      >
        <Text fz={16} fw="bold" mb={5}>
          {title}
        </Text>
        {icon}
      </Group>
      <CollapseMantine in={opened}>
        <div className="bdr-t"></div>
        {children}
      </CollapseMantine>
    </>
  );
};
export default Collapse;
