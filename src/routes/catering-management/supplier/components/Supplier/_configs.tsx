import Switch from "@/components/common/Switch";
import { Supplier } from "@/services/domain";
import { DataGridColumnProps } from "@/types";
import { Flex } from "@mantine/core";

export const configs = (
  t: (key: string) => string,
  actives: Map<string, boolean>,
  setActive: (key: string, active: boolean) => void,
): DataGridColumnProps[] => {
  return [
    {
      key: "name",
      header: t("Supplier name"),
      width: "30%",
      defaultVisible: true,
    },
    {
      key: "address",
      header: t("Supplier address"),
      width: "30%",
      defaultVisible: true,
      renderCell: (_, row) => {
        return <>{row.others?.address}</>;
      },
    },
    {
      key: "additionFee",
      header: t("Supplier catering addition fee"),
      width: "20%",
      defaultVisible: true,
      textAlign: "right",
      renderCell: () => {
        return 0;
      },
    },
    {
      key: "Served",
      header: t("Served"),
      width: "20%",
      textAlign: "center",
      renderCell: (_, row: Supplier) => {
        const key = row.id;
        const checked =
          actives.get(key) !== undefined
            ? actives.get(key)
            : row.others.active;
        return (
          <Flex justify="center">
            <Switch
              defaultChecked={checked || false}
              onChangeValue={(value) => setActive(key, value)}
            />
          </Flex>
        );
      },
    },
  ];
};
