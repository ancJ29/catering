import CateringBar from "@/components/c-catering/CateringBar";
import { RadioGroupProps } from "@/components/c-catering/CateringBar/RadioGroup";
import { Customer, Target } from "@/services/domain";
import { Flex } from "@mantine/core";
import DateControl, { DateControlProps } from "./DateControll";

// prettier-ignore
type ControlBarProps = RadioGroupProps & Omit<DateControlProps, "onShift"> & {
  customer?: Customer;
  targetName: string;
  cateringId?: string;
  onClear: () => void;
  onChangeCateringId: (cateringId?: string) => void;
  onShiftMarkDate: (diff: 1 | -1) => void;
  onCustomerChange: (customer?: Customer) => void;
  onTargetChange: (_: Target) => void;
};

const ControlBar = ({
  mode,
  shift,
  customer,
  targetName,
  cateringId,
  onChangeShift,
  onResetDate,
  onShiftMarkDate,
  onClear,
  onChangeMode,
  onChangeCateringId,
  onTargetChange,
  onCustomerChange,
  onExportMenu,
  onExportProductionOrders,
}: ControlBarProps) => {
  return (
    <Flex gap={10} w="100%" justify="space-between" align="end">
      <CateringBar
        enableShift={mode === "M"}
        shift={shift}
        customer={customer}
        targetName={targetName}
        cateringId={cateringId}
        onChangeShift={onChangeShift}
        onClear={onClear}
        onChangeCateringId={onChangeCateringId}
        onTargetChange={onTargetChange}
        onCustomerChange={onCustomerChange}
      />
      <DateControl
        mode={mode}
        onResetDate={onResetDate}
        onShift={onShiftMarkDate}
        onChangeMode={onChangeMode}
        onExportMenu={onExportMenu}
        onExportProductionOrders={onExportProductionOrders}
      />
    </Flex>
  );
};

export default ControlBar;
