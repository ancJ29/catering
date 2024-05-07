import { PurchaseOrderStatus } from "@/auto-generated/api-configs";
import useTranslation from "@/hooks/useTranslation";
import { purchaseOrderStatusColor } from "@/services/domain";
import { Badge, MantineColor } from "@mantine/core";

const Status = ({
  fz = 12,
  status,
  c,
}: {
  c?: MantineColor;
  fz?: number;
  status: PurchaseOrderStatus;
}) => {
  const t = useTranslation();
  return (
    <Badge fz={fz} color={c || purchaseOrderStatusColor(status)}>
      {t(`purchaseOrder.status.${status}`)}
    </Badge>
  );
};

export default Status;
