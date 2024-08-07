import { PICateringStatus } from "@/auto-generated/api-configs";
import useTranslation from "@/hooks/useTranslation";
import { statusInternalCateringColor } from "@/services/domain";
import { Badge, MantineColor } from "@mantine/core";

const Status = ({
  fz = 12,
  status,
  c,
}: {
  fz?: number;
  status: PICateringStatus;
  c?: MantineColor;
}) => {
  const t = useTranslation();
  return (
    <Badge fz={fz} color={c || statusInternalCateringColor(status)}>
      {t(`purchaseInternal.cateringStatus.${status}`)}
    </Badge>
  );
};

export default Status;
