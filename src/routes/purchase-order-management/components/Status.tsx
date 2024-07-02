import { POStatus } from "@/auto-generated/api-configs";
import useTranslation from "@/hooks/useTranslation";
import { statusOrderColor } from "@/services/domain";
import { Badge, MantineColor } from "@mantine/core";

const Status = ({
  fz = 12,
  status,
  c,
}: {
  fz?: number;
  status: POStatus;
  c?: MantineColor;
}) => {
  const t = useTranslation();
  return (
    <Badge fz={fz} color={c || statusOrderColor(status)}>
      {t(`purchaseOrder.status.${status}`)}
    </Badge>
  );
};

export default Status;
