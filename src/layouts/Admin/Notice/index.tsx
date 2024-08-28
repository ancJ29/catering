import useTranslation from "@/hooks/useTranslation";
import {
  Button,
  Flex,
  Indicator,
  Popover,
  ScrollArea,
  Text,
} from "@mantine/core";
import { IconBell, IconCheck } from "@tabler/icons-react";
import { useState } from "react";
import NoticeItem from "../NoticeItem";
import classes from "./Notice.module.scss";

const Notice = () => {
  const t = useTranslation();
  const [opened, setOpened] = useState(false);
  return (
    <Flex align="center">
      <Popover
        opened={opened}
        width={300}
        trapFocus
        position="bottom"
        withArrow
        shadow="md"
        onClose={() => setOpened(false)}
      >
        <Popover.Target>
          <Indicator size="6" offset={6} color="error.7">
            <Button
              onClick={() => setOpened(!opened)}
              p={0}
              h={30}
              w={30}
              radius={999}
              className={classes.btnIcon}
            >
              <IconBell width={24} height={24} color="black" />
            </Button>
          </Indicator>
        </Popover.Target>
        <Popover.Dropdown p={0} w={400}>
          <Flex className={classes.markAllRead}>
            <IconCheck color="#51b68c" />
            <Text fw="bold">{t("Mark all read")}</Text>
          </Flex>
          <ScrollArea.Autosize mah={300} type="always" scrollbars="y">
            {Array.from({ length: 20 }).map((_, index) => (
              <NoticeItem key={index} />
            ))}
          </ScrollArea.Autosize>
        </Popover.Dropdown>
      </Popover>
    </Flex>
  );
};

export default Notice;
