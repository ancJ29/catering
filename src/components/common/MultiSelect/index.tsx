import useOnEnter from "@/hooks/useOnEnter";
import useTranslation from "@/hooks/useTranslation";
import { OptionProps } from "@/types";
import { blank } from "@/utils";
import {
  MultiSelect as MantineMultiSelect,
  MultiSelectProps,
} from "@mantine/core";
import { useMemo } from "react";
import classes from "./MultiSelect.module.scss";
import { IconChevronDown } from "@tabler/icons-react";

interface Props extends MultiSelectProps {
  options: OptionProps[];
  translation?: boolean;
  value?: string[];
  placeholder?: string;
  onEnter?: () => void;
}
// TODO: remove it, merger with select
const MultiSelect = ({
  options,
  translation = false,
  value = [],
  placeholder,
  onEnter = blank,
  ...props
}: Props) => {
  const t = useTranslation();

  const data = options.map(({ value, label }, idx) => ({
    value: value.toString(),
    label: translation ? t(label) : label,
    isLastOption: idx === options.length - 1,
  }));

  const customPlaceholder = useMemo(
    () => (value.length > 0 ? undefined : placeholder),
    [placeholder, value],
  );
  const _onEnter = useOnEnter(onEnter);

  return (
    <MantineMultiSelect
      data={data}
      checkIconPosition="right"
      rightSection={<IconChevronDown size={16} />}
      classNames={{
        input: "c-catering-truncate h-16",
        label: classes.label,
      }}
      value={value}
      placeholder={customPlaceholder}
      onKeyDown={_onEnter}
      {...props}
    />
  );
};

export default MultiSelect;
