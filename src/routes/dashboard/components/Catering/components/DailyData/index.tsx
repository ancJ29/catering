import { CateringDashboard } from "@/services/domain";
import { Card, SimpleGrid } from "@mantine/core";
import {
  IconBox,
  IconClock,
  IconCurrencyDollar,
  IconGrill,
  IconMoneybag,
} from "@tabler/icons-react";
import { DailyDataType } from "../../_configs";
import DailyDataItem from "../DailyDataItem";
import Title from "../Title";
import classes from "./DailyData.module.scss";

type DailyDataProps = {
  dashboard?: CateringDashboard;
};

const DailyData = ({ dashboard }: DailyDataProps) => {
  const data: DailyDataType[] = [
    {
      title: "Shift services",
      amount: dashboard?.shiftService || 0,
      icon: IconClock,
      iconColor: "#51b68c",
    },
    {
      title: "Meal count",
      amount: dashboard?.mealCount || 0,
      icon: IconGrill,
      iconColor: "#51b68c",
    },
    {
      title: "Revenue",
      unit: "VNĐ",
      amount: dashboard?.revenue || 0,
      icon: IconMoneybag,
      iconColor: "#51b68c",
    },
    {
      title: "Cost",
      unit: "VNĐ",
      amount: dashboard?.cost || 0,
      icon: IconCurrencyDollar,
      iconColor: "#51b68c",
    },
  ];

  return (
    <Card withBorder radius="md" className={classes.card}>
      <Title icon={IconBox} title="Daily data" />
      <SimpleGrid cols={4} mt="md" spacing="lg">
        {data.map((item, index) => (
          <DailyDataItem key={index} item={item} />
        ))}
      </SimpleGrid>
    </Card>
  );
};

export default DailyData;
