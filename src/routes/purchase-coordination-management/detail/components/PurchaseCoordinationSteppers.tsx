import {
  PCStatus,
  pcStatusSchema,
} from "@/auto-generated/api-configs";
import useTranslation from "@/hooks/useTranslation";
import {
  changeablePurchaseCoordinationStatus,
  statusCoordinationColor,
} from "@/services/domain";
import useAuthStore from "@/stores/auth.store";
import { Stepper } from "@mantine/core";
import {
  IconCircleCheck,
  IconCircleCheckFilled,
} from "@tabler/icons-react";
import { useCallback, useEffect, useMemo, useState } from "react";
import PurchaseCoordinationStatus from "../../components/PurchaseCoordinationStatus";

const statuses = pcStatusSchema.options;
const map = new Map<number, PCStatus>(statuses.map((s, i) => [i, s]));

const size = 12;

type PurchaseCoordinationSteppersProps = {
  status: PCStatus;
  disabled?: boolean;
};

const PurchaseCoordinationSteppers = ({
  status,
  disabled,
}: PurchaseCoordinationSteppersProps) => {
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
      statusCoordinationColor(map.get(active || 0) || "CXL", 9),
      statusCoordinationColor(statuses[active], 9),
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
      size="xs"
      onStepClick={click}
      color={color}
      my={10}
      active={active}
      completedIcon={<IconCircleCheckFilled size={size} />}
    >
      {statuses.map((s, idx) => {
        const _disabled =
          disabled ||
          !changeablePurchaseCoordinationStatus(status, s, role);
        const cursor = _disabled ? "not-allowed" : "pointer";
        const label =
          idx <= active ? (
            <PurchaseCoordinationStatus status={s} fz={size} c={c} />
          ) : (
            t(`purchaseCoordination.status.${s}`)
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

export default PurchaseCoordinationSteppers;
