import useTranslation from "@/hooks/useTranslation";
import {
  DailyMenuStatus,
  dailyMenuStatusColor,
} from "@/services/domain";
import useMetaDataStore from "@/stores/meta-data.store";
import { Box, Table } from "@mantine/core";
import { notifications } from "@mantine/notifications";
import { useCallback } from "react";

type CellProps = {
  date?: string;
  status?: DailyMenuStatus;
  quantity: Map<string, number>;
  disabled?: boolean;
  onClick: () => void;
};

const Cell = ({
  status = "NEW",
  quantity,
  date,
  disabled = false,
  onClick,
}: CellProps) => {
  const t = useTranslation();
  const { productNameById } = useMetaDataStore();

  const _click = useCallback(() => {
    if (disabled) {
      // TODO: common
      notifications.show({
        title: t("Cannot edit data"),
        message: t("Data cannot be edited."),
        color: "red.5",
      });
      return;
    }
    onClick();
  }, [disabled, onClick, t]);

  return (
    <Table.Td
      onClick={_click}
      height={150}
      style={{
        position: "relative",
        cursor: disabled ? "not-allowed" : "pointer",
        verticalAlign: "top",
      }}
      bg={dailyMenuStatusColor(status, 1)}
    >
      <Box fz={16} fw={900} mb={5} w="100%" ta="right">
        {date}
      </Box>
      {Array.from(quantity.keys())
        .map((productId) => productNameById.get(productId))
        .filter(Boolean)
        .map((productName, idx) => (
          <Box
            key={idx}
            w="100%"
            fz={10}
            fw={900}
            c="white"
            pl={10}
            mt={5}
            bg={dailyMenuStatusColor(status, 9) || "primary.6"}
            style={{
              userSelect: "none",
              borderRadius: "5px",
            }}
          >
            {productName || "--"}
          </Box>
        ))}
    </Table.Td>
  );
};

export default Cell;
