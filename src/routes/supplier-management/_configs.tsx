import { Supplier } from "@/services/domain";
import { DataGridColumnProps } from "@/types";
import { stopMouseEvent } from "@/utils";
import { Badge, Flex, Text } from "@mantine/core";
import { IconBrandItch, IconShoppingCart } from "@tabler/icons-react";

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
      key: "pic",
      header: t("Supplier PIC"),
      width: "10%",
      renderCell: (_, row) => {
        return `${row.others?.contact || "-"}`;
      },
    },
    {
      key: "contact",
      header: t("Supplier contact"),
      width: "15%",
      renderCell: (_, row) => {
        const email = row.others?.email || "Email: N/A";
        const phone = row.others?.phone || "Phone: N/A";
        return (
          <>
            {email}
            <br />
            {phone}
          </>
        );
      },
    },
    {
      key: "catering",
      header: t("Supplier total catering"),
      width: "10%",
      renderCell: (_, supplier: Supplier) => {
        const total = Math.floor(Math.random() * 10) > 5 ? 1 : 0;
        return (
          <Badge
            color={total > 0 ? "orange.6" : "gray"}
            p={10}
            onClick={(e) => {
              stopMouseEvent(e);
              const url = `/supplier-management/catering/${supplier.id}`;
              navigate(url);
            }}
          >
            <Flex align="center" p={4}>
              <IconBrandItch size={20} />
              &nbsp;
              <Text fw={800} fz="1rem">
                ({total})
              </Text>
            </Flex>
          </Badge>
        );
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
              &nbsp;
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
