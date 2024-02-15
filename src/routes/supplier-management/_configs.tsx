import { Supplier } from "@/services/domain";
import { DataGridColumnProps } from "@/types";
import { stopMouseEvent } from "@/utils";
import { Badge, Flex, Text } from "@mantine/core";
import { modals } from "@mantine/modals";
import { IconShoppingCart } from "@tabler/icons-react";
import MaterialManagement from "./components/MaterialManagement";

export const configs = (
  t: (key: string) => string,
  reload: () => void,
): DataGridColumnProps[] => {
  return [
    {
      key: "name",
      header: t("Supplier name"),
      width: "30%",
    },
    {
      key: "code",
      header: t("Supplier code"),
      width: "10%",
    },
    {
      key: "contact",
      header: t("Supplier contact"),
      width: "10%",
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
              modals.open({
                title: supplier.name,
                classNames: {
                  title:
                    "c-catering-font-900 c-catering-fz-2rem c-catering-text-main",
                },
                fullScreen: true,
                children: (
                  <MaterialManagement
                    supplier={supplier}
                    onSuccess={reload}
                  />
                ),
              });
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
