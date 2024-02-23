import useOnEnter from "@/hooks/useOnEnter";
import { OptionProps } from "@/types";
import { blank } from "@/utils";
import {
  AutocompleteProps,
  Autocomplete as MantineAutocomplete,
} from "@mantine/core";
import { IconFilter, IconX } from "@tabler/icons-react";
import { useCallback, useMemo, useRef, useState } from "react";

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
  defaultValue,
  onEnter = blank,
  onChange,
  ...props
}: IAutocompleteProps) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const _data = useMemo(
    () => data || options?.map((el) => el.label),
    [options, data],
  );
  const [currentValue, setCurrentValue] = useState<string>("");

  const _onChange = useCallback(
    (value: string) => {
      onChange && onChange(value);
      setCurrentValue(value);
      if (_data?.includes(value)) {
        inputRef.current?.blur();
      }
    },
    [_data, onChange],
  );

  const enterHandler = useCallback(() => {
    onEnter.bind(null, currentValue)();
    inputRef.current?.blur();
  }, [currentValue, onEnter]);

  const _onEnter = useOnEnter(enterHandler);

  const onClear = useCallback(() => {
    _onChange("");
  }, [_onChange]);

  const clearIcon = useMemo(() => {
    return defaultValue || currentValue ? (
      <IconX onClick={onClear} size={14} />
    ) : undefined;
  }, [currentValue, defaultValue, onClear]);

  return (
    <MantineAutocomplete
      ref={inputRef}
      classNames={{
        input: "c-catering-truncate",
      }}
      defaultValue={defaultValue}
      value={defaultValue ? undefined : currentValue}
      leftSection={<IconFilter size={14} />}
      rightSection={clearIcon}
      data={_data}
      onKeyDown={_onEnter}
      onChange={_onChange}
      disabled={disabled ?? (_data?.length || 0) < 1}
      {...props}
    />
  );
};

export default Autocomplete;
