import { ActionIcon, rem } from "@mantine/core";
import {
  TimeInput as MantineTimeInput,
  TimeInputProps as MantineTimeInputProps,
} from "@mantine/dates";
import { IconClock } from "@tabler/icons-react";
import { ChangeEvent, useRef } from "react";

interface TimeInputProps extends MantineTimeInputProps {
  minTime?: string;
  maxTime?: string;
  onChangeValue: (value: string) => void;
}

const TimeInput = ({
  minTime,
  maxTime,
  withSeconds,
  onChangeValue,
  ...props
}: TimeInputProps) => {
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

  const onTimeChange = (event: ChangeEvent<HTMLInputElement>) => {
    if (minTime !== undefined && maxTime !== undefined) {
      const val = event.currentTarget.value;

      if (val) {
        const [hours, minutes, seconds] = val.split(":").map(Number);
        if (minTime) {
          const [minHours, minMinutes, minSeconds] = minTime
            .split(":")
            .map(Number);

          if (
            hours < minHours ||
            (hours === minHours && minutes < minMinutes) ||
            (withSeconds &&
              hours === minHours &&
              minutes === minMinutes &&
              seconds < minSeconds)
          ) {
            event.currentTarget.value = minTime;
          }
        }

        if (maxTime) {
          const [maxHours, maxMinutes, maxSeconds] = maxTime
            .split(":")
            .map(Number);

          if (
            hours > maxHours ||
            (hours === maxHours && minutes > maxMinutes) ||
            (withSeconds &&
              hours === maxHours &&
              minutes === maxMinutes &&
              seconds > maxSeconds)
          ) {
            event.currentTarget.value = maxTime;
          }
        }
      }
    }
    onChangeValue(event.currentTarget.value);
  };

  return (
    <MantineTimeInput
      ref={ref}
      onChange={onTimeChange}
      rightSection={pickerControl}
      {...props}
    />
  );
};

export default TimeInput;
