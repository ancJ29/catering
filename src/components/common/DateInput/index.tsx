import {
  DateInput as MantineDateInput,
  DateInputProps as MantineDateInputProps,
} from "@mantine/dates";

export type DateValue = Date | null;

interface DateInputProps extends MantineDateInputProps {
  onChangeDate: (value?: number) => void;
}

const DateInput = ({
  onChangeDate,
  valueFormat = "DD/MM/YYYY",
  ...props
}: DateInputProps) => {
  const _onChange = (date: DateValue) => {
    onChangeDate(date?.getTime());
  };

  return (
    <MantineDateInput
      onChange={_onChange}
      valueFormat={valueFormat}
      {...props}
    />
  );
};

export default DateInput;
