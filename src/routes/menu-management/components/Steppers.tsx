import useTranslation from "@/hooks/useTranslation";
import {
  DailyMenuStatus,
  changeableDailyMenuStatus,
  dailyMenuStatusColor,
} from "@/services/domain";
import useAuthStore from "@/stores/auth.store";
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

const size = 12;

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
  const { role } = useAuthStore();
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
      setActive(idx);
      onChange(statuses[idx]);
    },
    [onChange],
  );

  return (
    <Stepper
      w="100%"
      size="xs"
      onStepClick={click}
      color={color}
      m={10}
      active={active}
      completedIcon={<IconCircleCheckFilled size={size} />}
    >
      {statuses.map((s, idx) => {
        const _disabled =
          disabled || !changeableDailyMenuStatus(status, s, role);
        const cursor = _disabled ? "not-allowed" : "pointer";
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
