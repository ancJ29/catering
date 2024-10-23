import { SMStatus } from "@/auto-generated/api-configs";
import useTranslation from "@/hooks/useTranslation";
import { statusSMColor } from "@/services/domain";
import { Badge, MantineColor } from "@mantine/core";

const Status = ({
  fz = 10,
  status,
  c,
}: {
  c?: MantineColor;
  fz?: number;
  status: SMStatus;
}) => {
  const t = useTranslation();
  return (
    <Badge fz={fz} color={c || statusSMColor(status)}>
      {t(`supplierMaterial.status.${status}`)}
    </Badge>
  );
};

export default Status;
