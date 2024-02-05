import useTranslation from "@/hooks/useTranslation";
import { OptionProps } from "@/types";
import {
  MultiSelect as MantineMultiSelect,
  MultiSelectProps,
} from "@mantine/core";
import { IconChevronDown } from "@tabler/icons-react";
import { useCallback, useMemo } from "react";
import classes from "./MultiSelect.module.scss";

interface Props extends MultiSelectProps {
  options: OptionProps[];
  translation?: boolean;
  value: string[];
  placeholder?: string;
  onEnter?: () => void;
}
// TODO: remove it, merger with select
const MultiSelect = ({
  options,
  translation = false,
  value,
  placeholder,
  onEnter,
  ...props
}: Props) => {
  const t = useTranslation();

  const data = options.map(({ value, label }, index) => ({
    value: value.toString(),
    label: translation ? t(label) : label,
    isLastOption: index === options.length - 1,
  }));

  const customPlaceholder = useMemo(
    () => (value.length > 0 ? undefined : placeholder),
    [placeholder, value],
  );
  const handleChange = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === "Enter" && onEnter) {
        e.preventDefault();
        e.stopPropagation();
        onEnter();
      }
    },
    [onEnter],
  );

  return (
    <MantineMultiSelect
      data={data}
      checkIconPosition="right"
      rightSection={<IconChevronDown size={16} />}
      classNames={{
        input: "truncate h-16",
        label: classes.label,
      }}
      value={value}
      placeholder={customPlaceholder}
      onKeyDown={handleChange}
      {...props}
    />
  );
};

export default MultiSelect;
