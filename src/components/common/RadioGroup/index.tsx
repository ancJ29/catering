import useTranslation from "@/hooks/useTranslation";
import { OptionProps } from "@/types";
import { Group, Radio } from "@mantine/core";
import { useMemo } from "react";
import classes from "./RadioGroup.module.scss";
interface IRadioGroupProps {
  withAsterisk?: boolean;
  options?: OptionProps[];
  data?: string[];
  label?: string;
  description?: string;
  value?: string;
  onChange?: (value: string) => void;
  classNameBox?: string;
  children?: React.ReactNode;
  disabled?: boolean;
  w?: string | number;
}

const RadioGroup = ({
  withAsterisk = false,
  options,
  data: _data,
  description,
  label,
  value,
  onChange,
  classNameBox,
  disabled = false,
  w,
}: IRadioGroupProps) => {
  const t = useTranslation();
  const data = useMemo(() => {
    if (_data) {
      return _data.map((el, idx) => ({
        value: el,
        label: t(el),
        isLastOption: idx === _data?.length - 1,
      }));
    }
    return options?.map(({ value, label }, idx) => ({
      value: value.toString(),
      label,
      isLastOption: idx === options?.length - 1,
    }));
  }, [_data, options, t]);

  return (
    <Radio.Group
      withAsterisk={withAsterisk}
      value={value}
      label={label}
      description={description && t(description)}
      onChange={(newValue: string) => {
        onChange?.(newValue);
      }}
      classNames={{ label: classes.label }}
      w={w}
    >
      <Group className={classNameBox} mt="xs">
        {data?.map(({ label, value }, idx) => (
          <Radio
            key={idx}
            label={label}
            value={value}
            classNames={{
              label: classes.label,
            }}
            disabled={disabled}
          />
        ))}
      </Group>
    </Radio.Group>
  );
};

export default RadioGroup;
