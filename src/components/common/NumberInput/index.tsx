import {
  NumberInput as MantineNumberInput,
  NumberInputProps as MantineNumberInputProps,
} from "@mantine/core";
import { useCallback, useState } from "react";

// prettier-ignore
type NumberInputProps = Omit<MantineNumberInputProps, "onChange"> & {
  onChange?: (value: number) => void;
  onBlurWithValue?: (value: number) => void;
  isInteger?: boolean;
  isPositive?: boolean;
};

const NumberInput = ({
  defaultValue,
  value: externalValue,
  isInteger = true,
  isPositive = true,
  onChange,
  onBlur,
  onBlurWithValue,
  ...props
}: NumberInputProps) => {
  const [value, setValue] = useState<number>(
    _parse(defaultValue || externalValue || 0, isPositive, isInteger),
  );

  const blur = useCallback(
    (e: React.FocusEvent<HTMLInputElement, Element>) => {
      onBlurWithValue?.(value);
      onBlur?.(e);
    },
    [onBlur, onBlurWithValue, value],
  );

  const change = useCallback(
    (value: string | number) => {
      const quantity = _parse(value, isPositive, isInteger);
      setValue(quantity);
      onChange?.(quantity);
    },
    [isPositive, isInteger, onChange],
  );

  return (
    <MantineNumberInput
      {...props}
      value={value}
      thousandSeparator="."
      decimalSeparator=","
      onChange={change}
      onBlur={blur}
    />
  );
};

export default NumberInput;

function _parse(
  value: string | number,
  isPositive: boolean,
  isInteger: boolean,
) {
  let quantity = parseInt(value.toString());
  if (isNaN(quantity)) {
    quantity = 0;
  }
  if (isPositive) {
    quantity = Math.max(0, quantity);
  }
  if (isInteger) {
    quantity = Math.round(quantity);
  }
  return quantity;
}
