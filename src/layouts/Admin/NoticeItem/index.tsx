import { Flex, Text } from "@mantine/core";
import classes from "./NoticeItem.module.scss";

const NoticeItem = () => {
  const content = "Bạn có 1 thông báo từ bếp C Catering";
  const time = "10 phút trước";

  return (
    <Flex className={classes.container}>
      <Text c="black">{content}</Text>
      <Text c="dimmed" fz="sm">
        {time}
      </Text>
    </Flex>
  );
};

export default NoticeItem;
