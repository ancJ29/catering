import useTranslation from "@/hooks/useTranslation";
import { TextAlign } from "@/types";
import { Checkbox, Table } from "@mantine/core";
import { useSyncExternalStore } from "react";
import store from "../../_inventory.store";

const Header = () => {
  const t = useTranslation();
  const { isSelectAll } = useSyncExternalStore(
    store.subscribe,
    store.getSnapshot,
  );

  const columns = [
    {
      width: "3%",
      content: (
        <Checkbox
          checked={isSelectAll}
          onChange={(event) =>
            store.setIsSelectAll(event.currentTarget.checked)
          }
        />
      ),
    },
    { width: "20%", content: t("Material name") },
    { width: "8%", content: t("Inventory"), textAlign: "right" },
    { width: "8%", content: t("Need to order"), textAlign: "right" },
    { width: "10%", content: t("Adjust"), textAlign: "right" },
    { width: "10%", content: t("Difference"), textAlign: "right" },
    { width: "8%", content: t("Unit"), textAlign: "center" },
    { width: "15%", content: t("Supplier note") },
    { width: "15%", content: t("Internal note") },
    { width: "5%", content: "" },
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
