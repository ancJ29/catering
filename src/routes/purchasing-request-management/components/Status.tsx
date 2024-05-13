import { PRStatus } from "@/auto-generated/api-configs";
import useTranslation from "@/hooks/useTranslation";
import { prStatusColor } from "@/services/domain";
import { Badge } from "@mantine/core";

const Status = ({ status }: { status: PRStatus }) => {
  const t = useTranslation();
  return (
    <Badge fz={12} color={prStatusColor(status)}>
      {t(`purchaseRequest.status.${status}`)}
    </Badge>
  );
};

export default Status;
