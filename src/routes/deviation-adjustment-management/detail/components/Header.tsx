import useTranslation from "@/hooks/useTranslation";
import { TextAlign } from "@/types";
import { Table } from "@mantine/core";

const Header = () => {
  const t = useTranslation();

  const columns = [
    { width: "25%", content: t("Material name") },
    { width: "10%", content: t("Order amount"), textAlign: "right" },
    {
      width: "10%",
      content: t("Received amount"),
      textAlign: "right",
    },
    {
      width: "10%",
      content: t("Payment amount"),
      textAlign: "right",
    },
    { width: "10%", content: t("Price"), textAlign: "right" },
    { width: "5%", content: `${t("VAT")}(%)`, textAlign: "right" },
    { width: "15%", content: t("Supplier note") },
    { width: "15%", content: t("Internal note") },
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
