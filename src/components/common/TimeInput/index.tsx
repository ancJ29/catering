import { useRef } from "react";
import { ActionIcon, rem } from "@mantine/core";
import {
  TimeInput as TimeInputMantine,
  TimeInputProps,
} from "@mantine/dates";
import { IconClock } from "@tabler/icons-react";

const TimeInput = ({ ...props }: TimeInputProps) => {
  const ref = useRef<HTMLInputElement>(null);

  const pickerControl = (
    <ActionIcon
      variant="subtle"
      onClick={() => ref.current?.showPicker()}
    >
      <IconClock
        style={{ width: rem(16), height: rem(16) }}
        stroke={1.5}
      />
    </ActionIcon>
  );

  return (
    <TimeInputMantine
      ref={ref}
      rightSection={pickerControl}
      {...props}
    />
  );
};

export default TimeInput;
