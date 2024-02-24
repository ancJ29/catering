import useTranslation from "@/hooks/useTranslation";
import {
  Flex,
  SegmentedControl,
  UnstyledButton,
} from "@mantine/core";
import {
  IconChevronLeft,
  IconChevronRight,
} from "@tabler/icons-react";
import { useCallback, useState } from "react";

export type DateControllProps = {
  mode: "W" | "M";
  onChangeMode: (value: "W" | "M") => void;
  onShift: (diff: 1 | -1) => void;
};

const DateControll = ({
  mode,
  onShift,
  onChangeMode,
}: DateControllProps) => {
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
    </Flex>
  );
};

export default DateControll;
