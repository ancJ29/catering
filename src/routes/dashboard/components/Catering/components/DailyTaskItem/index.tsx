import useTranslation from "@/hooks/useTranslation";
import { Card, Flex, Text } from "@mantine/core";
import { IconEye } from "@tabler/icons-react";
import { useNavigate } from "react-router-dom";
import { DailyTaskType } from "../../_configs";
import classes from "./DailyTaskItem.module.scss";

type DailyTaskItemProps = {
  index: number;
  item: DailyTaskType;
};

const DailyTaskItem = ({ index, item }: DailyTaskItemProps) => {
  const t = useTranslation();
  const navigate = useNavigate();

  const onClick = (url: string) => {
    navigate(url);
  };

  return (
    <Card
      key={item.title}
      withBorder
      radius="md"
      className={classes.item}
      onClick={() => onClick(item.url)}
    >
      <Flex align="space-between" justify="space-between" w="100%">
        <Flex direction="column" gap={5}>
          <Text c="primary" ta="start" fw="bold">
            {`${index + 1}. ${t(item.title)}`}
          </Text>
          <Text ta="start">{item.content}</Text>
        </Flex>
        <Flex gap={5}>
          <IconEye strokeWidth="1.5" color="#51b68c" />
          <Text c="primary" lh="xs">
            {t("View")}
          </Text>
        </Flex>
      </Flex>
    </Card>
  );
};

export default DailyTaskItem;
