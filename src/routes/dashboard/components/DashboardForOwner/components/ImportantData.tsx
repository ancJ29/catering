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
  const iconColor = theme.colors?.primary?.[5] || "";

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
      amount: dashboard?.content.pendingConfirmation || 0,
      icon: IconCheck,
      iconColor,
      url: `/purchase-request-management#${purchaseRequestHash}`,
    },
    {
      title: "Dispatch case",
      amount: dashboard?.content.dispatchCase || 0,
      icon: IconCar,
      iconColor,
      url: "/purchase-coordination-management",
    },
    {
      title: "Purchase case",
      amount: dashboard?.content.purchaseCase || 0,
      icon: IconShoppingCart,
      iconColor,
    },
    {
      title: "PO to be processed",
      amount: dashboard?.content.poToBeProcessed || 0,
      icon: IconCheck,
      iconColor,
      url: `/purchase-order-management#${purchaseOrderHash}`,
    },
  ];

  const data2: DashboardDataType[] = [
    {
      title: "Catering has not ordered",
      amount: dashboard?.content.cateringHasNotOrdered.length || 0,
      icon: IconInfoCircle,
      iconColor,
      cateringIds: dashboard?.content.cateringHasNotOrdered,
    },
    {
      title: "Catering has ordered for tomorrow",
      amount:
        dashboard?.content.cateringHasOrderedForTomorrow.length || 0,
      icon: IconInfoCircle,
      iconColor,
      cateringIds: dashboard?.content.cateringHasOrderedForTomorrow,
    },
    {
      title: "Catering has not stocked",
      amount: dashboard?.content.cateringHasNotStocked.length || 0,
      icon: IconInfoCircle,
      iconColor,
      cateringIds: dashboard?.content.cateringHasNotStocked,
    },
    {
      title: "Catering has not conducted inventory",
      amount:
        dashboard?.content.cateringHasNotConductedInventory.length ||
        0,
      icon: IconInfoCircle,
      iconColor,
      cateringIds:
        dashboard?.content.cateringHasNotConductedInventory,
    },
  ];

  return (
    <Container
      icon={IconExclamationMark}
      title="Important data"
      data={data}
      data2={data2}
    />
  );
};

export default ImportantData;
