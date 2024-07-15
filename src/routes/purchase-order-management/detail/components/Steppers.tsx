import { POStatus } from "@/auto-generated/api-configs";
import Stepper from "@/components/common/Stepper";
import {
  changeablePurchaseOrderStatus,
  statusOrderColor,
} from "@/services/domain";
import { scroll } from "@/utils";
import { ScrollArea } from "@mantine/core";
import { useEffect, useState } from "react";
import Status from "../../components/Status";

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

type SteppersProps = {
  status: POStatus;
  disabled?: boolean;
};

const Steppers = ({ status, disabled = false }: SteppersProps) => {
  const [isChanged, setIsChanged] = useState(false);
  useEffect(() => {
    if (status === "DTC") {
      statuses[1] = "DTC";
      map.set(1, "DTC");
      setIsChanged(true);
    }
  }, [status]);

  useEffect(() => {
    scroll(`purchaseOrder.${status}`);
  }, [status]);

  return (
    <ScrollArea h="3.5rem">
      <Stepper
        w="200vw"
        status={status}
        fz={12}
        statuses={statuses}
        map={map}
        statusColor={statusOrderColor}
        changeableStatus={changeablePurchaseOrderStatus}
        StatusComponent={Status}
        keyPrefix="purchaseOrder"
        disabled={disabled}
        isChanged={isChanged}
      />
    </ScrollArea>
  );
};

export default Steppers;
