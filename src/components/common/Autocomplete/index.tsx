import useOnEnter from "@/hooks/useOnEnter";
import { OptionProps } from "@/types";
import { blank } from "@/utils";
import {
  AutocompleteProps,
  Autocomplete as MantineAutocomplete,
} from "@mantine/core";
import { IconFilter } from "@tabler/icons-react";
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
    },
    [onChange],
  );

  const enterHandler = useCallback(() => {
    onEnter.bind(null, currentValue)();
    inputRef.current?.blur();
  }, [currentValue, onEnter]);

  const _onEnter = useOnEnter(enterHandler);

  return (
    <MantineAutocomplete
      ref={inputRef}
      classNames={{
        input: "c-catering-truncate",
      }}
      leftSection={<IconFilter size={14} />}
      data={_data}
      onKeyDown={_onEnter}
      onChange={_onChange}
      disabled={disabled ?? (_data?.length || 0) < 1}
      {...props}
    />
  );
};

export default Autocomplete;
