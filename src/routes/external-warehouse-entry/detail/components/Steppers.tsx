import {
  POCateringStatus,
  poCateringStatusSchema,
} from "@/auto-generated/api-configs";
import Stepper from "@/components/common/Stepper";
import {
  changeablePurchaseOrderCateringStatus,
  statusOrderCateringColor,
} from "@/services/domain";
import Status from "../../components/Status";

const statuses = poCateringStatusSchema.options;

const map = new Map<number, POCateringStatus>(
  statuses.map((s, i) => [i, s]),
);

type SteppersProps = {
  status?: POCateringStatus;
  disabled?: boolean;
  onChangeStatus?: (value: POCateringStatus) => void;
};

const Steppers = ({
  status = poCateringStatusSchema.Values.CN,
  disabled,
  onChangeStatus,
}: SteppersProps) => {
  return (
    <Stepper
      size="md"
      status={status}
      fz={12}
      statuses={statuses}
      map={map}
      statusColor={statusOrderCateringColor}
      changeableStatus={changeablePurchaseOrderCateringStatus}
      StatusComponent={Status}
      keyPrefix="purchaseOrder.cateringStatus"
      disabled={disabled}
      onChangeStatus={onChangeStatus}
    />
  );
};

export default Steppers;
