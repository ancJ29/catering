import useCateringStore from "@/stores/catering.store";
import { Popover, Text, UnstyledButton } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { DashboardDataType } from "../../_configs";
import Item from "../Item";

type PopoverItemProps = {
  item: DashboardDataType;
};

const PopoverItem = ({ item }: PopoverItemProps) => {
  const { caterings } = useCateringStore();
  const [opened, { close, open }] = useDisclosure(false);
  return (
    <Popover
      width={400}
      position="right"
      withArrow
      shadow="md"
      opened={opened}
    >
      <Popover.Target>
        <UnstyledButton onMouseEnter={open} onMouseLeave={close}>
          <Item item={item} />
        </UnstyledButton>
      </Popover.Target>
      <Popover.Dropdown p={10} style={{ pointerEvents: "none" }}>
        {item.cateringIds?.map((cateringId, index) => (
          <Text key={cateringId}>
            {`${index + 1}. ${caterings.get(cateringId)?.name}`}
          </Text>
        ))}
      </Popover.Dropdown>
    </Popover>
  );
};

export default PopoverItem;
