import useTranslation from "@/hooks/useTranslation";
import {
  Button,
  Flex,
  SegmentedControl,
  UnstyledButton,
} from "@mantine/core";
import {
  IconChevronLeft,
  IconChevronRight,
} from "@tabler/icons-react";
import { useCallback, useState } from "react";

export type DateControlProps = {
  mode: "W" | "M";
  onChangeMode: (value: "W" | "M") => void;
  onShift: (diff: 1 | -1) => void;
  onResetDate: () => void;
};

const DateControl = ({
  mode,
  onShift,
  onChangeMode,
  onResetDate,
}: DateControlProps) => {
  const t = useTranslation();
  const [[W, M]] = useState([t("Weekly"), t("Monthly")]);
  const change = useCallback(
    (value: string | null) => {
      if (value === mode) {
        return;
      }
      if (value === W) {
        onChangeMode("W");
      } else if (value === M) {
        onChangeMode("M");
      }
    },
    [M, W, mode, onChangeMode],
  );
  return (
    <Flex justify="center" align="center">
      <UnstyledButton onClick={onShift.bind(null, -1)}>
        <IconChevronLeft className="c-catering-btn-icon" />
      </UnstyledButton>
      <SegmentedControl
        value={mode === "W" ? W : M}
        data={[W, M]}
        onChange={change}
      />
      <UnstyledButton onClick={onShift.bind(null, 1)}>
        <IconChevronRight className="c-catering-btn-icon" />
      </UnstyledButton>
      <Button onClick={onResetDate}>{t("This week")}</Button>
    </Flex>
  );
};

export default DateControl;
