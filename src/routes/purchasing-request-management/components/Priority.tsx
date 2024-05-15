import { PRPriority } from "@/auto-generated/api-configs";
import useTranslation from "@/hooks/useTranslation";
import { priorityColor } from "@/services/domain";
import { Text } from "@mantine/core";

const Priority = ({ priority }: { priority: PRPriority }) => {
  const t = useTranslation();
  return (
    <Text fz={16} c={priorityColor(priority)}>
      {t(`purchaseRequest.priority.${priority}`)}
    </Text>
  );
};

export default Priority;
