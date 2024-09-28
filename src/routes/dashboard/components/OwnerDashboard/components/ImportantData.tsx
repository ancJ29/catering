import {
  poStatusSchema,
  prStatusSchema,
} from "@/auto-generated/api-configs";
import { FilterType as PurchaseRequestFilterType } from "@/configs/filters/purchase-request";
import { theme } from "@/configs/theme/mantine-theme";
import { DashboardDataType } from "@/routes/dashboard/_configs";
import { FilterType as PurchaseOrderFilter } from "@/routes/purchase-order-management/_configs";
import { OwnerDashboard } from "@/services/domain";
import {
  buildHash,
  endOfWeek,
  startOfDay,
  startOfWeek,
} from "@/utils";
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
  const iconColor = theme.colors?.primary?.[7] || "";

  const purchaseRequestCondition: PurchaseRequestFilterType = {
    id: "",
    from: startOfDay(startOfWeek(Date.now())),
    to: endOfWeek(Date.now()),
    types: [],
    priorities: [],
    statuses: [prStatusSchema.Values.DG],
    departmentIds: [],
  };
  const purchaseRequestHash = buildHash(purchaseRequestCondition);

  const purchaseOrderCondition: PurchaseOrderFilter = {
    id: "",
    from: startOfWeek(Date.now()),
    to: endOfWeek(Date.now()),
    statuses: [poStatusSchema.Values.DG],
    supplierIds: [],
    receivingCateringIds: [],
  };
  const purchaseOrderHash = buildHash(purchaseOrderCondition);

  const data: DashboardDataType[] = [
    {
      title: "Pending confirmation",
      amount: dashboard?.pendingConfirmation || 0,
      icon: IconCheck,
      iconColor,
      url: `/purchase-request-management#${purchaseRequestHash}`,
    },
    {
      title: "Dispatch case",
      amount: dashboard?.dispatchCase || 0,
      icon: IconCar,
      iconColor,
      url: "/purchase-coordination-management",
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
      url: `/purchase-order-management#${purchaseOrderHash}`,
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
