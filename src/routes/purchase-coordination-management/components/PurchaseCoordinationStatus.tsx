import { PCStatus } from "@/auto-generated/api-configs";
import useTranslation from "@/hooks/useTranslation";
import { statusCoordinationColor } from "@/services/domain";
import { Badge } from "@mantine/core";

const PurchaseCoordinationStatus = ({
  status,
}: {
  status: PCStatus;
}) => {
  const t = useTranslation();
  return (
    <Badge fz={12} color={statusCoordinationColor(status)}>
      {t(`purchaseCoordination.status.${status}`)}
    </Badge>
  );
};

export default PurchaseCoordinationStatus;
