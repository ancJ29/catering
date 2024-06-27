import useTranslation from "@/hooks/useTranslation";
import { TextAlign } from "@/types";
import { Table } from "@mantine/core";

const Header = () => {
  const t = useTranslation();

  const columns = [
    { width: "18%", content: t("Material name") },
    {
      width: "7%",
      content: t("Approved quantity"),
      textAlign: "right",
    },
    {
      width: "15%",
      content: t("Order quantity"),
      textAlign: "center",
    },
    {
      width: "23%",
      content: t("Supplier name"),
      textAlign: "center",
    },
    { width: "7%", content: t("Price"), textAlign: "right" },
    { width: "10%", content: t("Supplier note") },
    { width: "10%", content: t("Internal note") },
    { width: "10%", content: "" },
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
