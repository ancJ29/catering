import useTranslation from "@/hooks/useTranslation";
import { OptionProps } from "@/types";
import { Group, Radio } from "@mantine/core";
import classes from "./RadioGroup.module.scss";
interface IRadioGroupProps {
  withAsterisk?: boolean;
  options: OptionProps[];
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
  description,
  label,
  value,
  onChange,
  classNameBox,
  disabled = false,
  w,
}: IRadioGroupProps) => {
  const t = useTranslation();

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
        {options.map(({ label, value }, idx) => (
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
