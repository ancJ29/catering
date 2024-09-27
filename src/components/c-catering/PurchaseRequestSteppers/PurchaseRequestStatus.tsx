import { PRStatus } from "@/auto-generated/api-configs";
import useTranslation from "@/hooks/useTranslation";
import { statusRequestColor } from "@/services/domain";
import { Badge, MantineColor } from "@mantine/core";

const PurchaseRequestStatus = ({
  fz = 10,
  status,
  c,
}: {
  c?: MantineColor;
  fz?: number;
  status: PRStatus;
}) => {
  const t = useTranslation();
  return (
    <Badge fz={fz} color={c || statusRequestColor(status)}>
      {t(`purchaseRequest.status.${status}`)}
    </Badge>
  );
};

export default PurchaseRequestStatus;
