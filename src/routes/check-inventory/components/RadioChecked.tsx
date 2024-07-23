import useTranslation from "@/hooks/useTranslation";
import { Group, Radio } from "@mantine/core";
import { CheckType, FilterType } from "../_configs";

type RadioCheckedProps = {
  condition?: FilterType;
  updateCondition: (
    key: string,
    _default: unknown,
    value: unknown,
    keyword?: string,
  ) => void;
};

const RadioChecked = ({
  condition,
  updateCondition,
}: RadioCheckedProps) => {
  return (
    <RadioGroup
      checkType={condition?.checkType || CheckType.ALL}
      onChange={updateCondition.bind(
        null,
        "checkType",
        CheckType.ALL,
      )}
    />
  );
};

export default RadioChecked;

function RadioGroup({
  checkType,
  onChange,
}: {
  checkType: CheckType;
  onChange: (value: CheckType) => void;
}) {
  const t = useTranslation();

  return (
    <Radio.Group
      value={checkType}
      onChange={(value) => onChange(value as CheckType)}
    >
      <Group>
        {Object.values(CheckType).map((el: CheckType, idx) => {
          return (
            <Radio
              h="2.2rem"
              pt=".8rem"
              key={idx}
              value={el}
              label={t(el)}
            />
          );
        })}
      </Group>
    </Radio.Group>
  );
}
