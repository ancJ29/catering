import { DashboardDataType } from "@/routes/dashboard/_configs";
import { OwnerDashboard } from "@/services/domain";
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
  const iconColor = "#51b68c";
  const data: DashboardDataType[] = [
    {
      title: "Shift services",
      amount: dashboard?.shiftServices || 0,
      icon: IconToolsKitchen,
      iconColor,
    },
    {
      title: "Enable catering",
      amount: dashboard?.enableCaterings || 0,
      icon: IconInfoCircle,
      iconColor,
    },
    {
      title: "User",
      amount: dashboard?.users || 0,
      icon: IconUsers,
      iconColor,
    },
    {
      title: "Catering name",
      amount: dashboard?.caterings || 0,
      icon: IconInfoCircle,
      iconColor,
    },
    {
      title: "Customer",
      amount: dashboard?.customers || 0,
      icon: IconInfoCircle,
      iconColor,
    },
    {
      title: "Suppliers",
      amount: dashboard?.suppliers || 0,
      icon: IconInfoCircle,
      iconColor,
    },
  ];

  return <Container icon={IconBox} title="Other data" data={data} />;
};

export default OtherData;
