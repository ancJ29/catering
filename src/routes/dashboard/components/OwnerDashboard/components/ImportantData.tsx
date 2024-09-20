import { DashboardDataType } from "@/routes/dashboard/_configs";
import { OwnerDashboard } from "@/services/domain";
import {
  IconCar,
  IconCheck,
  IconExclamationMark,
  IconInfoCircle,
  IconShoppingCart,
} from "@tabler/icons-react";
import Container from "../../Container";

type ImportantDataProps = {
  dashboard?: OwnerDashboard;
};

const ImportantData = ({ dashboard }: ImportantDataProps) => {
  const iconColor = "#51b68c";
  const data: DashboardDataType[] = [
    {
      title: "Pending confirmation",
      amount: dashboard?.pendingConfirmation || 0,
      icon: IconCheck,
      iconColor,
    },
    {
      title: "Dispatch case",
      amount: dashboard?.dispatchCase || 0,
      icon: IconCar,
      iconColor,
    },
    {
      title: "Purchase case",
      amount: dashboard?.purchaseCase || 0,
      icon: IconShoppingCart,
      iconColor,
    },
    {
      title: "PO to be processed",
      amount: dashboard?.poToBeProcessed || 0,
      icon: IconCheck,
      iconColor,
    },
    {
      title: "Catering has not ordered",
      amount: dashboard?.cateringHasNotOrdered || 0,
      icon: IconInfoCircle,
      iconColor,
    },
    {
      title: "Catering has ordered for tomorrow",
      amount: dashboard?.cateringHasOrderedForTomorrow || 0,
      icon: IconInfoCircle,
      iconColor,
    },
    {
      title: "Catering has not stocked",
      amount: dashboard?.cateringHasNotStocked || 0,
      icon: IconInfoCircle,
      iconColor,
    },
    {
      title: "Catering has not conducted inventory",
      amount: dashboard?.cateringHasNotConductedInventory || 0,
      icon: IconInfoCircle,
      iconColor,
    },
  ];

  return (
    <Container
      icon={IconExclamationMark}
      title="Important data"
      data={data}
    />
  );
};

export default ImportantData;
