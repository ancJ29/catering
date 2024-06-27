import useTranslation from "@/hooks/useTranslation";
import { TextAlign } from "@/types";
import { Table } from "@mantine/core";

const Header = () => {
  const t = useTranslation();
  const columns = [
    { width: "30%", content: t("Material name") },
    { width: "10%", content: t("Unit"), textAlign: "center" },
    { width: "10vw", content: t("Quantity") },
    { width: "20%", content: t("Kitchen delivery note") },
    { width: "20%", content: t("Internal note") },
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
