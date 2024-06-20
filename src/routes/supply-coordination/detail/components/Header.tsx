import useTranslation from "@/hooks/useTranslation";
import { TextAlign } from "@/types";
import { Table } from "@mantine/core";

const Header = () => {
  const t = useTranslation();
  const columns = [
    { width: "3%", content: t("Purchase outside") },
    { width: "15%", content: t("Material name") },
    { width: "3%", content: t("Sup") },
    { width: "10%", content: t("Delivery catering") },
    { width: "6%", content: t("Order quantity"), textAlign: "right" },
    {
      width: "6%",
      content: t("Kitchen quantity"),
      textAlign: "right",
    },
    {
      width: "8%",
      content: t("Dispatch quantity"),
      textAlign: "right",
    },
    { width: "8%", content: t("Unit"), textAlign: "center" },
    { width: "15%", content: t("Supplier note") },
    { width: "15%", content: t("Internal note") },
    { width: "7%", content: "" },
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
