import useOnEnter from "@/hooks/useOnEnter";
import { OptionProps } from "@/types";
import {
  Autocomplete as MantineAutocomplete,
  AutocompleteProps as MantineAutocompleteProps,
} from "@mantine/core";
import { IconFilter, IconX } from "@tabler/icons-react";
import { useCallback, useMemo, useRef, useState } from "react";

export interface AutocompleteProps extends MantineAutocompleteProps {
  data?: string[];
  options?: OptionProps[];
  disabled?: boolean;
  unFocusOnMatch?: boolean;
  onEnter?: (value: string) => void;
  onMatch?: (value: string) => void;
  onClear?: () => void;
}

const Autocomplete = ({
  data: _data,
  options,
  disabled,
  defaultValue,
  unFocusOnMatch = false,
  onEnter,
  onChange,
  onMatch,
  onClear,
  ...props
}: AutocompleteProps) => {
  const inputRef = useRef<HTMLInputElement>(null);

  const data = useMemo(() => {
    if (options) {
      return options.map((el) => el.label);
    }
    return _data || [];
  }, [_data, options]);

  const _optionMap = useMemo(() => {
    if (options) {
      return new Map(
        options.map((el) => [el.label, el.value.toString()]),
      );
    }
    return new Map<string, string>();
  }, [options]);

  const _dataMap = useMemo(() => {
    if (onMatch && data?.length) {
      return new Map<string, boolean>(
        data?.map((el) => [el, true]) || [],
      );
    }
    return new Map<string, boolean>();
  }, [data, onMatch]);

  const [currentValue, setCurrentValue] = useState<string>("");

  const _onChange = useCallback(
    (value: string) => {
      setCurrentValue(value);
      if (onChange || onMatch) {
        const _value = _optionMap.get(value) || value;
        onChange?.(_value);
        if (_dataMap.has(_value)) {
          onMatch?.(_value);
          inputRef.current?.blur();
        }
      }
    },
    [_dataMap, _optionMap, onChange, onMatch],
  );

  const enterHandler = useCallback(() => {
    if (onEnter) {
      onEnter(currentValue);
      setTimeout(() => {
        inputRef.current?.blur();
      }, 100);
    }
  }, [currentValue, onEnter]);

  const _onEnter = useOnEnter(enterHandler);

  const clear = useCallback(() => {
    onClear?.();
    _onChange("");
  }, [_onChange, onClear]);

  const clearIcon = useMemo(() => {
    return defaultValue || currentValue ? (
      <IconX onClick={clear} size={14} />
    ) : undefined;
  }, [currentValue, defaultValue, clear]);

  return (
    <MantineAutocomplete
      ref={unFocusOnMatch ? inputRef : undefined}
      classNames={{
        input: "c-catering-truncate",
      }}
      defaultValue={defaultValue}
      value={defaultValue ? undefined : currentValue}
      leftSection={<IconFilter size={14} />}
      rightSection={disabled ? undefined : clearIcon}
      data={data}
      onKeyDown={_onEnter}
      onChange={_onChange}
      disabled={disabled ?? (data?.length || 0) < 1}
      {...props}
    />
  );
};

export default Autocomplete;
