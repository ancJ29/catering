import { PIStatus } from "@/auto-generated/api-configs";
import useTranslation from "@/hooks/useTranslation";
import { statusInternalColor } from "@/services/domain";
import { Badge, MantineColor } from "@mantine/core";

const Status = ({
  fz = 10,
  status,
  c,
}: {
  c?: MantineColor;
  fz?: number;
  status: PIStatus;
}) => {
  const t = useTranslation();
  return (
    <Badge fz={fz} color={c || statusInternalColor(status)}>
      {t(`purchaseInternal.status.${status}`)}
    </Badge>
  );
};

export default Status;
