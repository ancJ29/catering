import { PCStatus } from "@/auto-generated/api-configs";
import useTranslation from "@/hooks/useTranslation";
import { statusCoordinationColor } from "@/services/domain";
import { Badge, MantineColor } from "@mantine/core";

type StatusProps = {
  status: PCStatus;
  w?: string;
  c?: MantineColor;
  fz?: number;
};

const Status = ({ status, fz = 10, c }: StatusProps) => {
  const t = useTranslation();
  return (
    <Badge
      fz={fz}
      color={c || statusCoordinationColor(status)}
      style={{ height: "auto" }}
      styles={{
        label: {
          whiteSpace: "normal",
          wordBreak: "break-word",
        },
      }}
    >
      {t(`purchaseCoordination.status.${status}`)}
    </Badge>
  );
};

export default Status;
