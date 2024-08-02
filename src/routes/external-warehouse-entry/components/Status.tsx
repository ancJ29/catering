import { POCateringStatus } from "@/auto-generated/api-configs";
import useTranslation from "@/hooks/useTranslation";
import { statusOrderCateringColor } from "@/services/domain";
import { Badge, MantineColor } from "@mantine/core";

const Status = ({
  fz = 12,
  status,
  c,
}: {
  fz?: number;
  status: POCateringStatus;
  c?: MantineColor;
}) => {
  const t = useTranslation();
  return (
    <Badge fz={fz} color={c || statusOrderCateringColor(status)}>
      {t(`purchaseOrder.cateringStatus.${status}`)}
    </Badge>
  );
};

export default Status;
