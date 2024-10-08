import { theme } from "@/configs/theme/mantine-theme";
import useTranslation from "@/hooks/useTranslation";
import { DashboardDataType } from "@/routes/dashboard/_configs";
import { Card, Flex, Text } from "@mantine/core";
import { IconEye } from "@tabler/icons-react";
import { useNavigate } from "react-router-dom";
import classes from "./DailyTaskItem.module.scss";

type DailyTaskItemProps = {
  index: number;
  item: DashboardDataType;
};

const DailyTaskItem = ({ index, item }: DailyTaskItemProps) => {
  const t = useTranslation();
  const navigate = useNavigate();

  const onClick = () => {
    item.url && navigate(item.url);
  };

  return (
    <Card
      key={item.title}
      withBorder
      radius="md"
      className={classes.item}
      onClick={onClick}
    >
      <Flex align="space-between" justify="space-between" w="100%">
        <Flex direction="column" gap={5}>
          <Text c="primary" ta="start" fw="bold">
            {`${index + 1}. ${t(item.title)}`}
          </Text>
          <Text ta="start">{item.description}</Text>
        </Flex>
        <Flex gap={5}>
          <IconEye
            strokeWidth="1.5"
            color={theme.colors?.primary?.[5] || ""}
          />
          <Text c="primary" lh="xs">
            {t("View")}
          </Text>
        </Flex>
      </Flex>
    </Card>
  );
};

export default DailyTaskItem;
