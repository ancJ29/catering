import { OptionProps } from "@/types";
import {
  AutocompleteProps,
  Autocomplete as MantineAutocomplete,
} from "@mantine/core";
import { IconChevronDown, IconFilter } from "@tabler/icons-react";
import { useCallback, useMemo, useState } from "react";
import classes from "./Autocomplete.module.scss";

interface IAutocompleteProps extends AutocompleteProps {
  options?: OptionProps[];
  data?: string[];
  disabled?: boolean;
  onEnter?: (value: string) => void;
}

const Autocomplete = ({
  options,
  data,
  disabled,
  onEnter,
  onChange,
  ...props
}: IAutocompleteProps) => {
  const _data = useMemo(
    () => data || options?.map((el) => el.label),
    [options, data],
  );
  const [currentValue, setCurrentValue] = useState<string>("");
  const _onChange = useCallback(
    (value: string) => {
      onChange && onChange(value);
      setCurrentValue(value);
    },
    [onChange],
  );
  const _onKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === "Enter") {
        onEnter && onEnter(currentValue);
      }
    },
    [currentValue, onEnter],
  );

  return (
    <MantineAutocomplete
      classNames={{
        input: "truncate",
        label: classes.label,
      }}
      leftSection={<IconFilter size={14} />}
      data={_data}
      onKeyDown={_onKeyDown}
      onChange={_onChange}
      disabled={disabled ?? (_data?.length || 0) < 1}
      rightSection={<IconChevronDown size={14} />}
      {...props}
    />
  );
};

export default Autocomplete;
