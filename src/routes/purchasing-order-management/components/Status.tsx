import { PurchaseOrderStatus } from "@/auto-generated/api-configs";
import useTranslation from "@/hooks/useTranslation";
import { poStatusColor } from "@/services/domain";
import { Badge } from "@mantine/core";

const Status = ({ status }: { status: PurchaseOrderStatus }) => {
  const t = useTranslation();
  return (
    <Badge fz={12} color={poStatusColor(status)}>
      {t(`purchaseOrder.status.${status}`)}
    </Badge>
  );
};

export default Status;
