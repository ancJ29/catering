import { userNotificationStatusSchema } from "@/auto-generated/api-configs";
import {
  Notification,
  updateNotification,
} from "@/services/domain/notification";
import { formatTime } from "@/utils";
import { Flex, Text } from "@mantine/core";
import classes from "./NoticeItem.module.scss";

type NoticeItemProps = {
  notification?: Notification;
  reload?: () => void;
};

const NoticeItem = ({ notification, reload }: NoticeItemProps) => {
  const onClick = async () => {
    await updateNotification([
      {
        id: notification?.id || "",
        others: {
          status: userNotificationStatusSchema.Values.READ,
        },
      },
    ]);
    await reload?.();
  };

  return (
    <Flex className={classes.container} onClick={onClick}>
      <Flex direction="column">
        <Text c="black">{notification?.notification.content}</Text>
        <Text c="dimmed" fz="sm">
          {formatTime(notification?.createdAt)}
        </Text>
      </Flex>
      {notification?.others.status ===
        userNotificationStatusSchema.Values.UNREAD && (
        <div className={classes.redDot} />
      )}
    </Flex>
  );
};

export default NoticeItem;
