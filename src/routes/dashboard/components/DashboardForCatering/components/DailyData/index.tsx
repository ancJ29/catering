import { theme } from "@/configs/theme/mantine-theme";
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
  const iconColor = theme.colors?.primary?.[5] || "";
  const data: DashboardDataType[] = [
    {
      title: "Shift services",
      amount: dashboard?.content.shiftService || 0,
      icon: IconClock,
      iconColor,
    },
    {
      title: "Meal count",
      amount: dashboard?.content.mealCount || 0,
      icon: IconGrill,
      iconColor,
    },
    {
      title: "Revenue",
      unit: "VNĐ",
      amount: dashboard?.content.revenue || 0,
      icon: IconMoneybag,
      iconColor,
    },
    {
      title: "Cost",
      unit: "VNĐ",
      amount: dashboard?.content.cost || 0,
      icon: IconCurrencyDollar,
      iconColor,
    },
  ];

  return <Container icon={IconBox} title="Daily data" data={data} />;
};

export default DailyData;
