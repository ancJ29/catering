import { POStatus } from "@/auto-generated/api-configs";
import useTranslation from "@/hooks/useTranslation";
import { statusOrderColor } from "@/services/domain";
import { Badge } from "@mantine/core";

const Status = ({ status }: { status: POStatus }) => {
  const t = useTranslation();
  return (
    <Badge fz={12} color={statusOrderColor(status)}>
      {t(`purchaseOrder.status.${status}`)}
    </Badge>
  );
};

export default Status;
