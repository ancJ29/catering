import { POStatus } from "@/auto-generated/api-configs";
import useTranslation from "@/hooks/useTranslation";
import { changeablePurchaseOrderStatus, statusOrderColor } from "@/services/domain";
import useAuthStore from "@/stores/auth.store";
import { Stepper } from "@mantine/core";
import { IconCircleCheck, IconCircleCheckFilled } from "@tabler/icons-react";
import { useCallback, useEffect, useMemo, useState } from "react";
import PurchaseOrderStatus from "../../components/PurchaseOrderStatus";

const statuses: POStatus[] = [
  // cspell:disable
  "DG", // Đã gửi: đã tạo & gửi PO đến NCC
  "DD", // Đã duyệt: NCC duyệt PO
  "SSGH", // Sẵn sàng giao hàng
  "NK1P", // Nhập kho 1 phần
  "DNK", // Đã nhập kho
  "DKTSL", // Đã kiểm tra sai lệch
  "DTDNTT", // Đã tạo đề nghị thanh toán
  "DCBSHD", // Đã cập nhật số hoá đơn
  "DLLTT", // Đã lập lịch thanh toán
  "TT1P", // Thanh toán 1 phần
  "DTT", // Đã thanh toán
  // cspell:enable
];

const map = new Map<number, POStatus>(statuses.map((s, i) => [i, s]));

const size = 10;

type PurchaseOrderSteppersProps = {
  status?: POStatus;
  disabled?: boolean;
};

const PurchaseOrderSteppers = ({
  status = "DG",
  disabled = false,
}: PurchaseOrderSteppersProps) => {
  const t = useTranslation();
  const { role } = useAuthStore();
  const [active, setActive] = useState<number>(
    statuses.indexOf(status),
  );

  useEffect(() => {
    if (status === "DTC") {
      statuses[1] = "DTC";
      map.set(1, "DTC");
    }
    setActive(statuses.indexOf(status));
  }, [status]);

  const [color, c] = useMemo(
    () => [
      statusOrderColor(map.get(active || 0) || "DG", 9),
      statusOrderColor(statuses[active], 9),
    ],
    [active],
  );

  const click = useCallback(
    (idx: number) => {
      setActive(idx);
      // onChange(statuses[idx]);
    },
    [],
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
          !changeablePurchaseOrderStatus(status, s, role);
        const cursor = _disabled ? "not-allowed" : "pointer";
        const label =
          idx <= active ? (
            <PurchaseOrderStatus status={s} fz={size} c={c} />
          ) : (
            t(`purchaseOrder.status.${s}`)
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

export default PurchaseOrderSteppers;
