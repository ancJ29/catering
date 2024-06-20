import { Popover, Text, UnstyledButton } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { IconInfoCircle } from "@tabler/icons-react";

const fz = 14;

const AddressPopover = ({ value }: {value?: string | null}) => {
  const [opened, { close, open }] = useDisclosure(false);
  return (
    <Popover
      width={300}
      position="left"
      withArrow
      shadow="md"
      opened={opened}
    >
      <Popover.Target>
        <UnstyledButton
          onMouseEnter={open}
          onMouseLeave={close}
          display="flex"
        >
          <IconInfoCircle strokeWidth="1.5" color="black" />
        </UnstyledButton>
      </Popover.Target>
      <Popover.Dropdown style={{ pointerEvents: "none" }}>
        <Text fz={fz}>{value || "N/A"}</Text>
      </Popover.Dropdown>
    </Popover>
  );
};

export default AddressPopover;
