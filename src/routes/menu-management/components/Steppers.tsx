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

const size = 16;

const Steppers = ({
  status = "NEW",
  onChange,
}: {
  status?: DailyMenuStatus;
  onChange: (status: DailyMenuStatus) => void;
}) => {
  const t = useTranslation();
  const [active, setActive] = useState<number>(
    statuses.indexOf(status),
  );

  const [color, c] = useMemo(
    () => [
      dailyMenuStatusColor(map.get(active || 0) || "NEW", 9),
      dailyMenuStatusColor(statuses[active], 9),
    ],
    [active],
  );

  const click = (idx: number) => {
    setActive(idx);
    onChange(statuses[idx]);
  };
  return (
    <Stepper
      w="100%"
      size="sm"
      onStepClick={click}
      color={color}
      m={10}
      active={active}
      completedIcon={<IconCircleCheckFilled size={size} />}
    >
      {statuses.map((s, idx) => {
        const label =
          idx <= active ? (
            <Status status={s} fz={size} c={c} />
          ) : (
            t(`dailyMenu.status.${s}`)
          );
        return (
          <Stepper.Step
            icon={<IconCircleCheck size={size} />}
            key={s}
            label={label}
          />
        );
      })}
    </Stepper>
  );
};

export default Steppers;
