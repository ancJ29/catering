import { ClientRoles } from "@/auto-generated/api-configs";
import useTranslation from "@/hooks/useTranslation";
import useAuthStore from "@/stores/auth.store";
import {
  Stepper as MantineStepper,
  StepperProps as MantineStepperProps,
} from "@mantine/core";
import {
  IconCircleCheck,
  IconCircleCheckFilled,
} from "@tabler/icons-react";
import { useCallback, useEffect, useMemo, useState } from "react";

interface StatusComponentProps<T> {
  status: T;
  fz: number;
  c: string;
}
interface StepperProps<T>
  extends Omit<MantineStepperProps, "children" | "active"> {
  status: T;
  fz: number;
  statuses: T[];
  onChangeStatus?: (value: T) => void;
  map: Map<number, T>;
  statusColor: (status: T, level?: number) => string;
  disabled?: boolean;
  changeableStatus: (
    current: T,
    next: T,
    role?: ClientRoles,
  ) => boolean;
  StatusComponent: React.ComponentType<StatusComponentProps<T>>;
  keyPrefix: string;
  isChanged?: boolean;
}

const Stepper = <T extends string>({
  status,
  fz,
  statuses,
  onChangeStatus,
  map,
  statusColor,
  disabled = false,
  changeableStatus,
  StatusComponent,
  keyPrefix,
  isChanged = false,
  ...props
}: StepperProps<T>) => {
  const t = useTranslation();
  const { role } = useAuthStore();
  const [active, setActive] = useState<number>(
    statuses.indexOf(status),
  );

  useEffect(() => {
    setActive(statuses.indexOf(status));
  }, [status, statuses, isChanged]);

  const [color, c] = useMemo(
    () => [
      statusColor(map.get(active || 0) || statuses[0], 9),
      statusColor(statuses[active], 9),
    ],
    [statusColor, map, active, statuses],
  );

  const click = useCallback(
    (idx: number) => {
      setActive(idx);
      onChangeStatus?.(statuses[idx]);
    },
    [onChangeStatus, statuses],
  );

  return (
    <MantineStepper
      w="100%"
      size="xs"
      my={10}
      onStepClick={click}
      color={color}
      active={active}
      completedIcon={<IconCircleCheckFilled size={fz} />}
      {...props}
    >
      {statuses.map((s, idx) => {
        const _disabled =
          disabled || !changeableStatus(status, s, role);
        const cursor = _disabled ? "not-allowed" : "pointer";
        const label =
          idx <= active ? (
            <StatusComponent status={s} fz={fz} c={c} />
          ) : (
            t(`${keyPrefix}.${s}`)
          );
        return (
          <MantineStepper.Step
            id={`${keyPrefix}.${s}`}
            key={s}
            style={{ cursor }}
            disabled={_disabled}
            icon={<IconCircleCheck size={fz} />}
            label={label}
          />
        );
      })}
    </MantineStepper>
  );
};

export default Stepper;
