import useTranslation from "@/hooks/useTranslation";
import { TextAlign } from "@/types";
import { Table } from "@mantine/core";

const Header = () => {
  const t = useTranslation();
  const columns = [
    { width: "3%", content: "" },
    { width: "5%", content: t("Material code") },
    { width: "25%", content: t("Material name") },
    { width: "10%", content: t("Material unit") },
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
      content: t("Total amount"),
      textAlign: "right",
    },
    {
      width: "20%",
      content: t("Memo"),
      textAlign: "center",
    },
  ];

  return (
    <>
      {columns.map((col, index) => (
        <Table.Th
          key={index}
          w={col.width}
          ta={(col.textAlign as TextAlign) || "center"}
        >
          {col.content}
        </Table.Th>
      ))}
    </>
  );
};

export default Header;
