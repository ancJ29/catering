import { PRStatus } from "@/auto-generated/api-configs";
import useTranslation from "@/hooks/useTranslation";
import {
  changeablePurchaseRequestStatus,
  statusRequestColor,
} from "@/services/domain";
import useAuthStore from "@/stores/auth.store";
import { Stepper } from "@mantine/core";
import {
  IconCircleCheck,
  IconCircleCheckFilled,
} from "@tabler/icons-react";
import { useCallback, useEffect, useMemo, useState } from "react";
import PurchaseRequestStatus from "./PurchaseRequestStatus";

const statuses: PRStatus[] = [
  // cspell:disable
  "DG", // Đã gửi
  "DD", // Đã duyệt
  "DDP", // Đang điều phối
  "MH", // Mua hàng
  "DNH", // Đang nhận hàng
  "NH", // Đã nhận hàng
  "DH", // Đã huỷ
  // cspell:enable
];

const map = new Map<number, PRStatus>(statuses.map((s, i) => [i, s]));

const size = 12;

type PurchaseRequestSteppersProps = {
  status?: PRStatus;
  disabled?: boolean;
  onChange: (status: PRStatus) => void;
};

const PurchaseRequestSteppers = ({
  status = "DG",
  disabled = false,
  onChange,
}: PurchaseRequestSteppersProps) => {
  const t = useTranslation();
  const { role } = useAuthStore();
  const [active, setActive] = useState<number>(
    statuses.indexOf(status),
  );

  useEffect(() => {
    if (status === "KD") {
      statuses[1] = "KD";
      map.set(1, "KD");
    }
    setActive(statuses.indexOf(status));
  }, [status]);

  const [color, c] = useMemo(
    () => [
      statusRequestColor(map.get(active || 0) || "DG", 9),
      statusRequestColor(statuses[active], 9),
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
      my={10}
      active={active}
      completedIcon={<IconCircleCheckFilled size={size} />}
    >
      {statuses.map((s, idx) => {
        const _disabled =
          disabled ||
          !changeablePurchaseRequestStatus(status, s, role);
        const cursor = _disabled ? "not-allowed" : "pointer";
        const label =
          idx <= active ? (
            <PurchaseRequestStatus status={s} fz={size} c={c} />
          ) : (
            t(`purchaseRequest.status.${s}`)
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

export default PurchaseRequestSteppers;