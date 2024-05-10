import { PurchaseOrderPriority } from "@/auto-generated/api-configs";
import useTranslation from "@/hooks/useTranslation";
import { poPriorityColor } from "@/services/domain";
import { Text } from "@mantine/core";

const Priority = ({
  priority,
}: {
  priority: PurchaseOrderPriority;
}) => {
  const t = useTranslation();
  return (
    <Text fz={16} c={poPriorityColor(priority)}>
      {t(`purchaseOrder.priority.${priority}`)}
    </Text>
  );
};

export default Priority;
