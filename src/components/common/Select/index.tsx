import useTranslation from "@/hooks/useTranslation";
import { OptionProps } from "@/types";
import { Select as MantineSelect, SelectProps } from "@mantine/core";
import { IconChevronDown } from "@tabler/icons-react";
import classes from "./Select.module.scss";

interface ISelectProps extends SelectProps {
  options?: OptionProps[];
  translation?: boolean;
  disabled?: boolean;
}

const Select = ({
  options,
  translation = false,
  disabled,
  ...props
}: ISelectProps) => {
  const t = useTranslation();

  const data = options?.map(({ value, label }, index) => ({
    value: value.toString(),
    label: translation ? t(label).toString() : label,
    isLastOption: index === options?.length - 1,
  }));

  return (
    <MantineSelect
      data={data}
      disabled={disabled ?? (options?.length || 0) < 1}
      checkIconPosition="right"
      rightSection={<IconChevronDown size={16} />}
      classNames={{
        input: "truncate",
        label: classes.label,
      }}
      {...props}
    />
  );
};

export default Select;
