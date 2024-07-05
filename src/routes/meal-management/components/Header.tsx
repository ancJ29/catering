import useTranslation from "@/hooks/useTranslation";
import { TextAlign } from "@/types";
import { Table } from "@mantine/core";

const Header = () => {
  const t = useTranslation();
  const columns = [
    { width: "25%", content: t("Customer") },
    { width: "25%", content: t("Meal target audience") },
    { width: "10%", content: t("Meal shift"), textAlign: "center" },
    {
      width: "10%",
      content: t("Meal predicted qty"),
      textAlign: "right",
    },
    {
      width: "10%",
      content: t("Meal production order qty"),
      textAlign: "right",
    },
    {
      width: "10%",
      content: t("Meal employee qty"),
      textAlign: "right",
    },
    {
      width: "10%",
      content: t("Meal payment qty"),
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
