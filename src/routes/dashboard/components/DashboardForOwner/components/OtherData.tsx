import { theme } from "@/configs/theme/mantine-theme";
import { FilterType as CateringFilterType } from "@/routes/catering-management/_configs";
import { DashboardDataType } from "@/routes/dashboard/_configs";
import { OwnerDashboard } from "@/services/domain";
import { buildHash } from "@/utils";
import {
  IconBox,
  IconInfoCircle,
  IconToolsKitchen,
  IconUsers,
} from "@tabler/icons-react";
import Container from "../../Container";

type OtherDataProps = {
  dashboard?: OwnerDashboard;
};

const OtherData = ({ dashboard }: OtherDataProps) => {
  const iconColor = theme.colors?.primary?.[5] || "";

  const activeCateringCondition: CateringFilterType = {
    onSaleOnly: true,
  };
  const activeCateringHash = buildHash(activeCateringCondition);

  const data: DashboardDataType[] = [
    {
      title: "Shift services",
      amount: dashboard?.content.shiftServices || 0,
      icon: IconToolsKitchen,
      iconColor,
      url: "/meal-management",
    },
    {
      title: "Enable catering",
      amount: dashboard?.content.enableCaterings || 0,
      icon: IconInfoCircle,
      iconColor,
      url: `/catering-management#${activeCateringHash}`,
    },
    {
      title: "User",
      amount: dashboard?.content.users || 0,
      icon: IconUsers,
      iconColor,
      url: "/user-management",
    },
    {
      title: "Catering name",
      amount: dashboard?.content.caterings || 0,
      icon: IconInfoCircle,
      iconColor,
      url: "/catering-management",
    },
    {
      title: "Customer",
      amount: dashboard?.content.customers || 0,
      icon: IconInfoCircle,
      iconColor,
      url: "/customer-management",
    },
    {
      title: "Suppliers",
      amount: dashboard?.content.suppliers || 0,
      icon: IconInfoCircle,
      iconColor,
      url: "/supplier-management",
    },
  ];

  return <Container icon={IconBox} title="Other data" data={data} />;
};

export default OtherData;
