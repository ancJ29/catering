import {
  PRStatus,
  prStatusSchema,
} from "@/auto-generated/api-configs";
import Stepper from "@/components/common/Stepper";
import {
  changeablePurchaseRequestStatus,
  statusRequestColor,
} from "@/services/domain";
import { useEffect, useState } from "react";
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

type PurchaseRequestSteppersProps = {
  status?: PRStatus;
  disabled?: boolean;
  onChange: (status: PRStatus) => void;
};

const PurchaseRequestSteppers = ({
  status = prStatusSchema.Values.DG,
  disabled = false,
  onChange,
}: PurchaseRequestSteppersProps) => {
  const [isChanged, setIsChanged] = useState(false);
  useEffect(() => {
    if (status === prStatusSchema.Values.KD) {
      statuses[1] = prStatusSchema.Values.KD;
      map.set(1, prStatusSchema.Values.KD);
      setIsChanged(true);
    }
  }, [status]);

  return (
    <Stepper
      status={status}
      fz={12}
      statuses={statuses}
      onChangeStatus={onChange}
      map={map}
      statusColor={statusRequestColor}
      changeableStatus={changeablePurchaseRequestStatus}
      StatusComponent={PurchaseRequestStatus}
      keyPrefix="purchaseRequest.status"
      disabled={disabled}
      isChanged={isChanged}
    />
  );
};

export default PurchaseRequestSteppers;
