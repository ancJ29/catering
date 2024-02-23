import useTranslation from "@/hooks/useTranslation";
import {
  DailyMenuStatus,
  dailyMenuStatusColor,
} from "@/services/domain";
import { Badge } from "@mantine/core";

const Status = ({
  fz = 10,
  status,
}: {
  fz?: number;
  status: DailyMenuStatus;
}) => {
  const t = useTranslation();
  return (
    <Badge fz={fz} color={dailyMenuStatusColor(status, 9)}>
      {t(`dailyMenu.status.${status}`)}
    </Badge>
  );
};

export default Status;
