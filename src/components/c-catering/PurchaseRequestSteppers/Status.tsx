import { PRStatus } from "@/auto-generated/api-configs";
import useTranslation from "@/hooks/useTranslation";
import { statusColor } from "@/services/domain";
import { Badge, MantineColor } from "@mantine/core";

const Status = ({
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
    <Badge fz={fz} color={c || statusColor(status, 9)}>
      {t(`purchaseRequest.status.${status}`)}
    </Badge>
  );
};

export default Status;
