import useTranslation from "@/hooks/useTranslation";
import { TextAlign } from "@/types";
import { Table } from "@mantine/core";

const Header = () => {
  const t = useTranslation();
  const columns = [
    { width: "5%", content: "" },
    { width: "25%", content: t("Material name") },
    { width: "10%", content: t("Expiry date"), textAlign: "center" },
    { width: "10%", content: t("Price"), textAlign: "right" },
    { width: "10%", content: t("Inventory"), textAlign: "right" },
    { width: "10%", content: t("Export"), textAlign: "right" },
    { width: "10%", content: t("Total amount"), textAlign: "right" },
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
