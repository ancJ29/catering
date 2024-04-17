import {
  Switch as SwitchMantine,
  SwitchProps as SwitchMantineProps,
} from "@mantine/core";
import { ChangeEvent, useCallback } from "react";

interface SwitchProps extends SwitchMantineProps {
  checked: boolean;
  onChangeValue: (_: boolean) => void;
}

const Switch = ({
  checked,
  onChangeValue,
  ...props
}: SwitchProps) => {
  const handleChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      onChangeValue(e.currentTarget.checked);
    },
    [onChangeValue],
  );

  return (
    <SwitchMantine
      checked={checked}
      onChange={handleChange}
      {...props}
    />
  );
};

export default Switch;
