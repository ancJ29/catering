import useTranslation from "@/hooks/useTranslation";
import { Group, Radio } from "@mantine/core";

export type RadioGroupProps = {
  shift: string;
  shifts: string[];
  setShift: (shift: string) => void;
};

const RadioGroup = ({ shifts, shift, setShift }: RadioGroupProps) => {
  const t = useTranslation();
  return (
    <Radio.Group
      label={t("shifts")}
      value={shift}
      onChange={setShift}
    >
      <Group>
        {shifts.map((shift, idx) => {
          return (
            <Radio
              disabled={shifts.length === 1}
              h="2.2rem"
              pt=".8rem"
              key={idx}
              value={shift}
              label={shift}
            />
          );
        })}
      </Group>
    </Radio.Group>
  );
};

export default RadioGroup;
