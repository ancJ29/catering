import {
  PIStatus,
  piStatusSchema,
} from "@/auto-generated/api-configs";
import Stepper from "@/components/common/Stepper";
import {
  changeablePurchaseInternalStatus,
  statusInternalColor,
} from "@/services/domain";
import Status from "../../components/Status";

const statuses = piStatusSchema.options;

const map = new Map<number, PIStatus>(statuses.map((s, i) => [i, s]));

type SteppersProps = {
  status: PIStatus;
  disabled?: boolean;
};

const Steppers = ({ status, disabled }: SteppersProps) => {
  return (
    <Stepper
      size="sm"
      status={status}
      fz={12}
      statuses={statuses}
      map={map}
      statusColor={statusInternalColor}
      changeableStatus={changeablePurchaseInternalStatus}
      StatusComponent={Status}
      keyPrefix="purchaseInternal"
      disabled={disabled}
    />
  );
};

export default Steppers;
