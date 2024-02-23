import useTranslation from "@/hooks/useTranslation";
import {
  DailyMenuStatus,
  dailyMenuStatusColor,
} from "@/services/domain";
import { Stepper } from "@mantine/core";
import {
  IconCircleCheck,
  IconCircleCheckFilled,
} from "@tabler/icons-react";
import { useMemo, useState } from "react";
import Status from "./Status";

const statuses: DailyMenuStatus[] = [
  "NEW",
  "WAITING",
  "CONFIRMED",
  "PROCESSING",
  "READY",
  "DELIVERED",
];

const map = new Map<number, DailyMenuStatus>(
  statuses.map((s, i) => [i, s]),
);

const Steppers = ({ status }: { status: DailyMenuStatus }) => {
  const t = useTranslation();
  const [active, setActive] = useState<number>(
    statuses.indexOf(status),
  );
  const color = useMemo(
    () => dailyMenuStatusColor(map.get(active || 0) || "NEW", 9),
    [active],
  );
  return (
    <Stepper
      w="80%"
      size="sm"
      onStepClick={setActive}
      color={color}
      m={10}
      active={active}
      completedIcon={<IconCircleCheckFilled size={18} />}
    >
      {statuses.map((s, idx) => {
        const isActive = idx === active;
        const label = isActive ? (
          <Status status={s} fz={16} />
        ) : (
          t(`dailyMenu.status.${s}`)
        );
        return (
          <Stepper.Step
            icon={<IconCircleCheck size={18} />}
            key={s}
            label={label}
          />
        );
      })}
    </Stepper>
  );
};

export default Steppers;
