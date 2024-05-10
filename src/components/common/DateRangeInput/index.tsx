import { Text } from "@mantine/core";
import { DateInput } from "@mantine/dates";
import classNames from "classnames";
import classes from "./DateRangeInput.module.scss";

type DateValue = Date | null;

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
  const _onChange = (from: DateValue, to: DateValue) => {
    onChange && onChange(from?.getTime(), to?.getTime());
  };

  return (
    <div className={classes.container} style={{ width: w }}>
      {label && <Text className={classes.label}>{label}</Text>}
      <div className={classNames(classes.expand, rangeClassName)}>
        <DateInput
          placeholder={placeholder}
          value={new Date(from)}
          onChange={(value) =>
            _onChange(value, new Date(to) || value)
          }
          maxDate={new Date(to)}
          valueFormat="DD/MM/YYYY"
        />
        <span>~</span>
        <DateInput
          placeholder={placeholder}
          value={new Date(to)}
          minDate={new Date(from)}
          onChange={(value) =>
            _onChange(new Date(from) || value, value)
          }
          valueFormat="DD/MM/YYYY"
        />
      </div>
    </div>
  );
};

export default DateRangeInput;
