import useTranslation from "@/hooks/useTranslation";
import { Tabs } from "@mantine/core";
import { IconComponents, IconReceipt } from "@tabler/icons-react";
import { ReactNode, useSyncExternalStore } from "react";
import { Tab, typeSchema } from "../_configs";
import store from "../_export.store";
import ExportReceipt from "./ExportReceipt";
import IOList from "./IOList";
import MaterialList from "./MaterialList";
import Menu from "./Menu";

const tabs: [string, string, ReactNode][] = [
  [
    Tab.STANDARD,
    "Material name",
    <IconComponents key={1} size={16} />,
  ],
  [Tab.EXPORT, "Export receipt", <IconReceipt key={2} size={16} />],
];

const TabController = () => {
  const t = useTranslation();
  const { activeTab, form } = useSyncExternalStore(
    store.subscribe,
    store.getSnapshot,
  );

  return (
    <Tabs
      mt={10}
      variant="outline"
      value={activeTab}
      onChange={(tab) => tab && store.setActiveTab(tab as Tab)}
    >
      <Tabs.List>
        {tabs.map(([tab, label, icon]) => {
          return (
            <Tabs.Tab
              key={tab}
              value={tab}
              c={activeTab === tab ? "primary" : ""}
              fw={activeTab === tab ? 700 : undefined}
              leftSection={icon}
            >
              {t(label)}
            </Tabs.Tab>
          );
        })}
      </Tabs.List>
      <Tabs.Panel value={Tab.STANDARD} pt={10}>
        {form.type === typeSchema.Values["Manual export"] && (
          <MaterialList />
        )}
        {form.type === typeSchema.Values["Quantitative export"] && (
          <Menu />
        )}
        {form.type === typeSchema.Values["Export on demand"] && (
          <IOList />
        )}
      </Tabs.Panel>
      <Tabs.Panel value={Tab.EXPORT} pt={10}>
        <ExportReceipt />
      </Tabs.Panel>
    </Tabs>
  );
};

export default TabController;
