import { Text } from "@mantine/core";
import classNames from "classnames";
import DateInput from "../DateInput";
import classes from "./DateRangeInput.module.scss";

type DateRangeInputProps = {
  from?: number;
  to?: number;
  label?: string;
  rangeClassName?: string;
  placeholder?: string;
  onChange?: (from?: number, to?: number) => void;
  w?: string;
};

const DateRangeInput = ({
  from = Date.now(),
  to = Date.now(),
  label,
  placeholder,
  rangeClassName,
  onChange,
  w,
}: DateRangeInputProps) => {
  const _onChange = (from?: number, to?: number) => {
    onChange && onChange(from, to);
  };

  return (
    <div className={classes.container} style={{ width: w }}>
      {label && <Text className={classes.label}>{label}</Text>}
      <div className={classNames(classes.expand, rangeClassName)}>
        <DateInput
          placeholder={placeholder}
          value={new Date(from)}
          onChangeDate={(value) => _onChange(value, to || value)}
          maxDate={new Date(to)}
        />
        <span className={classes.tilde}>~</span>
        <DateInput
          placeholder={placeholder}
          value={new Date(to)}
          minDate={new Date(from)}
          onChangeDate={(value) => _onChange(from || value, value)}
        />
      </div>
    </div>
  );
};

export default DateRangeInput;
