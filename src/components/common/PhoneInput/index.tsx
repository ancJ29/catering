import { formatPhoneNumber } from "@/utils";
import { TextInput, TextInputProps } from "@mantine/core";
import { ChangeEvent, useCallback, useMemo } from "react";

interface PhoneInputProps extends TextInputProps {
  value: string;
  onChangeValue: (_: string) => void;
}

const PhoneInput = ({
  value = "",
  onChangeValue,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  onChange,
  ...props
}: PhoneInputProps) => {
  const handleChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      const value = formatPhoneNumber(
        e?.target.value.replace(/\D/g, ""),
      );
      onChangeValue?.(value);
    },
    [onChangeValue],
  );

  const _value = useMemo(
    () => formatPhoneNumber(value || ""),
    [value],
  );

  return (
    <TextInput
      value={_value || ""}
      onChange={handleChange}
      {...props}
    />
  );
};

export default PhoneInput;
