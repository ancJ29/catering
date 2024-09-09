import { Customer } from "@/services/domain";
import { DataGridColumnProps } from "@/types";
import { ActionIcon, Flex, Tooltip } from "@mantine/core";
import {
  IconToolsKitchen,
  IconUsersGroup,
} from "@tabler/icons-react";

export const configs = (
  t: (key: string) => string,
  onProductClick: (id: string) => void,
  onTargetAudienceClick: (id: string) => void,
): DataGridColumnProps[] => {
  return [
    {
      key: "name",
      sortable: true,
      header: t("Customer"),
      width: "20%",
      defaultVisible: true,
    },
    {
      key: "code",
      header: t("Customer code"),
      width: "15%",
      textAlign: "left",
      defaultVisible: true,
    },
    {
      key: "catering",
      header: t("Catering name"),
      width: "20%",
      textAlign: "left",
      renderCell: (_, row: Customer) => {
        return row.others?.cateringName || "-";
      },
    },
    {
      key: "type",
      header: t("Customer type"),
      width: "10%",
      textAlign: "left",
      renderCell: (_, row: Customer) => {
        return row.others?.type ? t(row.others?.type) : "-";
      },
    },
    {
      key: "action",
      header: t("Action"),
      width: "10%",
      textAlign: "center",
      renderCell: (_, row: Customer) => {
        return (
          <Flex gap={10} justify="center">
            <Tooltip label={t("Meal target audience")}>
              <ActionIcon
                variant="outline"
                onClick={() => onTargetAudienceClick(row.id)}
              >
                <IconUsersGroup strokeWidth="1.5" />
              </ActionIcon>
            </Tooltip>
            <Tooltip label={t("Dish")}>
              <ActionIcon
                variant="outline"
                onClick={() => onProductClick(row.id)}
              >
                <IconToolsKitchen strokeWidth="1.5" />
              </ActionIcon>
            </Tooltip>
          </Flex>
        );
      },
    },
  ];
};
