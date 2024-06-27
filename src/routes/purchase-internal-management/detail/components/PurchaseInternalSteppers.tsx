import {
  PIStatus,
  piStatusSchema,
} from "@/auto-generated/api-configs";
import useTranslation from "@/hooks/useTranslation";
import {
  changeablePurchaseInternalStatus,
  statusInternalColor,
} from "@/services/domain";
import useAuthStore from "@/stores/auth.store";
import { Stepper } from "@mantine/core";
import {
  IconCircleCheck,
  IconCircleCheckFilled,
} from "@tabler/icons-react";
import { useCallback, useEffect, useMemo, useState } from "react";
import PurchaseInternalStatus from "../../components/PurchaseInternalStatus";

const statuses = piStatusSchema.options;

const map = new Map<number, PIStatus>(statuses.map((s, i) => [i, s]));

const size = 14;

type PurchaseInternalSteppersProps = {
  status: PIStatus;
  disabled?: boolean;
};

const PurchaseInternalSteppers = ({
  status,
  disabled,
}: PurchaseInternalSteppersProps) => {
  const t = useTranslation();
  const { role } = useAuthStore();
  const [active, setActive] = useState<number>(
    statuses.indexOf(status),
  );

  useEffect(() => {
    setActive(statuses.indexOf(status));
  }, [status]);

  const [color, c] = useMemo(
    () => [
      statusInternalColor(map.get(active || 0) || "DG", 9),
      statusInternalColor(statuses[active], 9),
    ],
    [active],
  );

  const click = useCallback((idx: number) => {
    setActive(idx);
    // onChange(statuses[idx]);
  }, []);

  return (
    <Stepper
      w="100%"
      size="sm"
      onStepClick={click}
      color={color}
      my={10}
      active={active}
      completedIcon={<IconCircleCheckFilled size={size} />}
    >
      {statuses.map((s, idx) => {
        const _disabled =
          disabled ||
          !changeablePurchaseInternalStatus(status, s, role);
        const cursor = _disabled ? "not-allowed" : "pointer";
        const label =
          idx <= active ? (
            <PurchaseInternalStatus status={s} fz={size} c={c} />
          ) : (
            t(`purchaseInternal.status.${s}`)
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

export default PurchaseInternalSteppers;
