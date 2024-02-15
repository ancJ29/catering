import { Supplier } from "@/services/domain";
import { DataGridColumnProps } from "@/types";
import { stopMouseEvent } from "@/utils";
import { Badge, Flex, Text } from "@mantine/core";
import { IconShoppingCart } from "@tabler/icons-react";

export const configs = (
  t: (key: string) => string,
  navigate: (to: string) => void,
): DataGridColumnProps[] => {
  return [
    {
      key: "name",
      header: t("Supplier name"),
      width: "20%",
    },
    {
      key: "code",
      header: t("Supplier code"),
      width: "10%",
    },
    {
      key: "contact",
      header: t("Supplier contact"),
      width: "20%",
      renderCell: (_, row) => {
        const email = row.others?.email;
        const phone = row.others?.phone;
        return `${row.others?.contact || "-"} ${email || ""}${
          email && phone ? " " : ""
        }${phone || ""}`;
      },
    },
    {
      key: "material",
      header: t("Supplier material"),
      width: "10%",
      renderCell: (_, supplier: Supplier) => {
        const total = supplier.supplierMaterials.length;
        return (
          <Badge
            color={total > 0 ? "orange.6" : "gray"}
            p={10}
            onClick={(e) => {
              stopMouseEvent(e);
              const url = `/supplier-management/material/${supplier.id}`;
              navigate(url);
            }}
          >
            <Flex align="center" p={4}>
              <IconShoppingCart size={20} />
              <Text fw={800} fz="1rem">
                ({total})
              </Text>
            </Flex>
          </Badge>
        );
      },
    },
  ];
};
