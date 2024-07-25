import useTranslation from "@/hooks/useTranslation";
import { TextAlign } from "@/types";
import { Table } from "@mantine/core";

const Header = () => {
  const t = useTranslation();
  const columns = [
    { width: "5%", content: "" },
    { width: "10%", content: t("Time"), textAlign: "center" },
    {
      width: "10%",
      content: t("Warehouse receipt type"),
      textAlign: "center",
    },
    {
      width: "15%",
      content: t("Warehouse receipt receiving catering"),
      textAlign: "center",
    },
    {
      width: "15%",
      content: t("Warehouse receipt delivery catering"),
      textAlign: "center",
    },
    { width: "5%", content: t("Unit"), textAlign: "center" },

    {
      width: "10%",
      content: t("Beginning inventory"),
      textAlign: "right",
    },
    {
      width: "10%",
      content: t("Quantity"),
      textAlign: "right",
    },
    {
      width: "10%",
      content: t("Price"),
      textAlign: "right",
    },
    {
      width: "10%",
      content: t("Ending inventory"),
      textAlign: "right",
    },
  ];
  return (
    <>
      {columns.map((col, index) => (
        <Table.Th
          key={index}
          w={col.width}
          ta={(col.textAlign as TextAlign) || "left"}
        >
          {col.content}
        </Table.Th>
      ))}
    </>
  );
};

export default Header;
