import { ClientRoles } from "@/auto-generated/api-configs";
import useTranslation from "@/hooks/useTranslation";
import {
  DailyMenuStatus,
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
      if (role !== ClientRoles.OWNER) {
        const current = statuses.indexOf(status);
        if (disabled || idx <= current || idx === active) {
          return;
        }
      }
      setActive(idx);
      onChange(statuses[idx]);
    },
    [role, onChange, status, disabled, active],
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
        let _disabled = disabled || idx !== active + 1;
        let cursor =
          _disabled || idx <= active ? "not-allowed" : "pointer";

        if (role === ClientRoles.OWNER) {
          _disabled = false;
          cursor = "pointer";
        }
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
