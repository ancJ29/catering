import {
  PCStatus,
  pcStatusSchema,
} from "@/auto-generated/api-configs";
import Stepper from "@/components/common/Stepper";
import {
  changeablePurchaseCoordinationStatus,
  statusCoordinationColor,
} from "@/services/domain";
import Status from "../../components/Status";

const statuses = pcStatusSchema.options;
const map = new Map<number, PCStatus>(statuses.map((s, i) => [i, s]));

type SteppersProps = {
  status: PCStatus;
  disabled?: boolean;
};

const Steppers = ({ status, disabled }: SteppersProps) => {
  return (
    <Stepper
      status={status}
      fz={12}
      statuses={statuses}
      map={map}
      statusColor={statusCoordinationColor}
      changeableStatus={changeablePurchaseCoordinationStatus}
      StatusComponent={Status}
      keyPrefix="purchaseCoordination.status"
      disabled={disabled}
    />
  );
};

export default Steppers;
