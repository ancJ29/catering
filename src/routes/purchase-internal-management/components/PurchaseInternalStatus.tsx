import { PIStatus } from "@/auto-generated/api-configs";
import useTranslation from "@/hooks/useTranslation";
import { statusInternalColor } from "@/services/domain";
import { Badge } from "@mantine/core";

const PurchaseInternalStatus = ({ status }: { status: PIStatus }) => {
  const t = useTranslation();
  return (
    <Badge fz={12} color={statusInternalColor(status)}>
      {t(`purchaseInternal.status.${status}`)}
    </Badge>
  );
};

export default PurchaseInternalStatus;
