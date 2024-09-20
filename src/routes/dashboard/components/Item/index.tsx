import useTranslation from "@/hooks/useTranslation";
import { DashboardDataType } from "@/routes/dashboard/_configs";
import { numberWithDelimiter } from "@/utils";
import { Card, Flex, Text } from "@mantine/core";
import classes from "./DailyDataItem.module.scss";

type ItemProps = {
  item: DashboardDataType;
};

const Item = ({ item }: ItemProps) => {
  const t = useTranslation();
  return (
    <Card
      key={item.title}
      withBorder
      radius="md"
      className={classes.item}
    >
      <item.icon
        size="2rem"
        strokeWidth="1.5"
        color={item.iconColor}
      />
      <Flex direction="column" align="start">
        <Text size="xl" fw="bold" lh="xs" c="primary">
          {numberWithDelimiter(item.amount)}
        </Text>
        <Text
          size="xs"
          c="dimmed"
          ta="start"
          tt="uppercase"
          fw="bold"
        >
          {t(item.title)}
          {item.unit && <span>{` (${item.unit})`}</span>}
        </Text>
      </Flex>
    </Card>
  );
};

export default Item;
