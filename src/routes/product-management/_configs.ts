import { DataGridColumnProps } from "@/types";

const configs = (
  t: (key: string) => string,
): DataGridColumnProps[] => {
  return [
    {
      key: "name",
      header: t("Product Name"),
      width: "400px",
    },
  ];
};

export default configs;
