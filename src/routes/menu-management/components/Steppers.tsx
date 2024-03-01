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
import { useCallback, useMemo, useState } from "react";
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
  disabled = false,
  status = "NEW",
  onChange,
}: {
  disabled?: boolean;
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

  const click = useCallback(
    (idx: number) => {
      const current = statuses.indexOf(status);
      if (disabled || idx <= current || idx === active) {
        return;
      }
      setActive(idx);
      onChange(statuses[idx]);
    },
    [active, disabled, status, onChange],
  );

  return (
    <Stepper
      w="100%"
      size="sm"
      style={{
        cursor: disabled ? "not-allowed" : "pointer",
      }}
      onStepClick={click}
      color={color}
      m={10}
      active={active}
      completedIcon={<IconCircleCheckFilled size={size} />}
    >
      {statuses.map((s, idx) => {
        const _disabled = disabled || idx !== active + 1;
        const cursor =
          _disabled || idx <= active ? "not-allowed" : "pointer";
        const label =
          idx <= active ? (
            <Status status={s} fz={size} c={c} />
          ) : (
            t(`dailyMenu.status.${s}`)
          );
        return (
          <Stepper.Step
            style={{ cursor }}
            disabled={_disabled}
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
