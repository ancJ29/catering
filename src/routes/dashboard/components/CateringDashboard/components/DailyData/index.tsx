import { DashboardDataType } from "@/routes/dashboard/_configs";
import { CateringDashboard } from "@/services/domain";
import {
  IconBox,
  IconClock,
  IconCurrencyDollar,
  IconGrill,
  IconMoneybag,
} from "@tabler/icons-react";
import Container from "../../../Container";

type DailyDataProps = {
  dashboard?: CateringDashboard;
};

const DailyData = ({ dashboard }: DailyDataProps) => {
  const iconColor = "#51b68c";
  const data: DashboardDataType[] = [
    {
      title: "Shift services",
      amount: dashboard?.shiftService || 0,
      icon: IconClock,
      iconColor,
    },
    {
      title: "Meal count",
      amount: dashboard?.mealCount || 0,
      icon: IconGrill,
      iconColor,
    },
    {
      title: "Revenue",
      unit: "VNĐ",
      amount: dashboard?.revenue || 0,
      icon: IconMoneybag,
      iconColor,
    },
    {
      title: "Cost",
      unit: "VNĐ",
      amount: dashboard?.cost || 0,
      icon: IconCurrencyDollar,
      iconColor,
    },
  ];

  return <Container icon={IconBox} title="Daily data" data={data} />;
};

export default DailyData;