import {
  PICateringStatus,
  piCateringStatusSchema,
} from "@/auto-generated/api-configs";
import Stepper from "@/components/common/Stepper";
import {
  changeablePurchaseInternalCateringStatus,
  statusInternalCateringColor,
} from "@/services/domain";
import Status from "../../components/Status";

const statuses = piCateringStatusSchema.options;

const map = new Map<number, PICateringStatus>(
  statuses.map((s, i) => [i, s]),
);

type SteppersProps = {
  status?: PICateringStatus;
  disabled?: boolean;
  onChangeStatus?: (value: PICateringStatus) => void;
};

const Steppers = ({
  status = piCateringStatusSchema.Values.CN,
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
      statusColor={statusInternalCateringColor}
      changeableStatus={changeablePurchaseInternalCateringStatus}
      StatusComponent={Status}
      keyPrefix="purchaseInternal.cateringStatus"
      disabled={disabled}
      onChangeStatus={onChangeStatus}
    />
  );
};

export default Steppers;
