import Select from "@/components/common/Select";
import useTranslation from "@/hooks/useTranslation";
import { Flex } from "@mantine/core";

type MonthYearPickerProps = {
  date: number;
  onChangeDate: (date: number) => void;
};

const MonthYearPicker = ({
  date,
  onChangeDate,
}: MonthYearPickerProps) => {
  const t = useTranslation();
  const monthList: string[] = Array.from({ length: 12 }, (_, i) =>
    (i + 1).toString(),
  );
  const currentYear = new Date().getFullYear();
  const yearList: string[] = Array.from({ length: 21 }, (_, i) =>
    (currentYear - 20 + i).toString(),
  );

  const onChangeMonth = (value: string | null) => {
    if (value !== null) {
      const year = new Date(date).getFullYear();
      const month = Number(value);
      const day = new Date(date).getDay();
      onChangeDate(new Date(year, month - 1, day).getTime());
    }
  };

  const onChangeYear = (value: string | null) => {
    if (value !== null) {
      const year = Number(value);
      const month = new Date(date).getMonth();
      const day = new Date(date).getDay();
      onChangeDate(new Date(year, month, day).getTime());
    }
  };

  return (
    <Flex gap={10} w="20vw">
      <Select
        value={(new Date(date).getMonth() + 1).toString()}
        label={t("Month")}
        data={monthList}
        onChange={onChangeMonth}
        allowDeselect={false}
        w="40%"
      />
      <Select
        value={new Date(date).getFullYear().toString()}
        label={t("Year")}
        data={yearList}
        onChange={onChangeYear}
        allowDeselect={false}
        w="60%"
      />
    </Flex>
  );
};

export default MonthYearPicker;
