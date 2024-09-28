import { userNotificationStatusSchema } from "@/auto-generated/api-configs";
import { theme } from "@/configs/theme/mantine-theme";
import useTranslation from "@/hooks/useTranslation";
import {
  getNotifications,
  Notification,
  updateNotification,
} from "@/services/domain/notification";
import {
  Button,
  Flex,
  Indicator,
  Popover,
  ScrollArea,
  Text,
} from "@mantine/core";
import { IconBell, IconCheck } from "@tabler/icons-react";
import { useEffect, useState } from "react";
import NoticeItem from "../NoticeItem";
import classes from "./Notice.module.scss";

const Notice = () => {
  const t = useTranslation();
  const [opened, setOpened] = useState(false);
  const [data, setData] = useState<Notification[]>([]);
  const [total, setTotal] = useState(0);

  const getData = async () => {
    const data = await getNotifications();
    setData(data);
    setTotal(
      data.filter(
        (e) =>
          e.others.status ===
          userNotificationStatusSchema.Values.UNREAD,
      ).length,
    );
  };

  useEffect(() => {
    getData();
  }, []);

  const markAllRead = async () => {
    await updateNotification(
      data.map((notification) => ({
        id: notification.id,
        others: {
          status: userNotificationStatusSchema.Values.READ,
        },
      })),
    );
    await getData();
  };

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
          <Indicator
            size="6"
            offset={6}
            color="error.7"
            disabled={total === 0}
          >
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
        <Popover.Dropdown p={0} w={350}>
          {total > 0 && (
            <Flex className={classes.markAllRead}>
              <IconCheck color={theme.colors?.primary?.[7] || ""} />
              <Text onClick={markAllRead} fw="bold">
                {t("Mark all read")}
              </Text>
            </Flex>
          )}
          <ScrollArea.Autosize mah={300} type="always" scrollbars="y">
            {data.map((notification, index) => (
              <NoticeItem
                key={index}
                notification={notification}
                reload={getData}
              />
            ))}
            {total === 0 && (
              <Flex
                w="100%"
                align="center"
                justify="center"
                fw="bold"
                py={20}
              >
                {t("No new notifications")}
              </Flex>
            )}
          </ScrollArea.Autosize>
        </Popover.Dropdown>
      </Popover>
    </Flex>
  );
};

export default Notice;
