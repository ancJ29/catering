import { Text, Title } from "@mantine/core";
import classNames from "classnames";
import DateInput from "../DateInput";
import TimeInput from "../TimeInput";
import classes from "./DateTimeInput.module.scss";

type DateTimeInputProps = {
  label?: string;
  date?: number;
  time: string;
  onChangeDate: (value?: number) => void;
  onChangeTime: (value?: string) => void;
  minDate?: Date;
  w?: string;
  dateTimeClassName?: string;
  required?: boolean;
  disabled: boolean;
  minTime?: string;
  maxTime?: string;
};

const DateTimeInput = ({
  label,
  date,
  time,
  onChangeDate,
  onChangeTime,
  minDate,
  w,
  dateTimeClassName,
  required = false,
  disabled,
  minTime,
  maxTime,
}: DateTimeInputProps) => {
  return (
    <div className={classes.container} style={{ width: w }}>
      {label && (
        <Title className={classes.label}>
          {label}
          {required && (
            <Text span c="red" inherit>
              {" "}
              *
            </Text>
          )}
        </Title>
      )}
      <div className={classNames(classes.expand, dateTimeClassName)}>
        <DateInput
          value={new Date(date || 0)}
          onChangeDate={onChangeDate}
          minDate={minDate}
          w={"70%"}
          disabled={disabled}
        />
        <TimeInput
          value={time}
          onChangeValue={onChangeTime}
          w={"30%"}
          disabled={disabled}
          minTime={minTime}
          maxTime={maxTime}
        />
      </div>
    </div>
  );
};

export default DateTimeInput;
