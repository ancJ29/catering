import { OptionProps } from "@/types";
import { Select as MantineSelect, SelectProps } from "@mantine/core";
import { IconChevronDown } from "@tabler/icons-react";
import { useMemo } from "react";
import classes from "./Select.module.scss";

interface ISelectProps extends SelectProps {
  options?: OptionProps[];
  disabled?: boolean;
  data?: string[];
}

const Select = ({
  data: _data,
  options,
  disabled,
  ...props
}: ISelectProps) => {
  const data = useMemo(() => {
    if (_data) {
      return _data.map((el, index) => ({
        value: el,
        label: el,
        isLastOption: index === _data?.length - 1,
      }));
    }
    return options?.map(({ value, label }, index) => ({
      value: value.toString(),
      label,
      isLastOption: index === options?.length - 1,
    }));
  }, [options, _data]);

  return (
    <MantineSelect
      data={data}
      disabled={disabled ?? (data?.length || 0) < 1}
      checkIconPosition="right"
      rightSection={<IconChevronDown size={16} />}
      classNames={{
        input: "c-catering-truncate",
        label: classes.label,
      }}
      {...props}
    />
  );
};

export default Select;
