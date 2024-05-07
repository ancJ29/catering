import { PurchaseOrderPriority } from "@/auto-generated/api-configs";
import useTranslation from "@/hooks/useTranslation";
import { purchaseOrderPriorityColor } from "@/services/domain";
import { Badge, MantineColor } from "@mantine/core";

const Priority = ({
  fz = 12,
  priority,
  c,
}: {
  c?: MantineColor;
  fz?: number;
  priority: PurchaseOrderPriority;
}) => {
  const t = useTranslation();
  return (
    <Badge fz={fz} color={c || purchaseOrderPriorityColor(priority)}>
      {t(`purchaseOrder.priority.${priority}`)}
    </Badge>
  );
};

export default Priority;
