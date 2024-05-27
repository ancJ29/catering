import { ActionIcon, rem } from "@mantine/core";
import {
  TimeInput as MantineTimeInput,
  TimeInputProps as MantineTimeInputProps,
} from "@mantine/dates";
import { IconClock } from "@tabler/icons-react";
import { ChangeEvent, useRef } from "react";

interface TimeInputProps extends MantineTimeInputProps {
  onChangeValue: (value: string) => void;
}

const TimeInput = ({ onChangeValue, ...props }: TimeInputProps) => {
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

  const onChange = (event: ChangeEvent<HTMLInputElement>) => {
    onChangeValue(event.target.value);
  };

  return (
    <MantineTimeInput
      ref={ref}
      onChange={onChange}
      rightSection={pickerControl}
      {...props}
    />
  );
};

export default TimeInput;
