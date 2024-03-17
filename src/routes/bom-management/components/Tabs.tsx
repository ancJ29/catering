import useTranslation from "@/hooks/useTranslation";
import { Tabs as MantineTabs } from "@mantine/core";
import {
  IconAdjustmentsBolt,
  IconComponents,
} from "@tabler/icons-react";
import { ReactNode } from "react";
import { Tab } from "../_config";

const tabs: [string, string, ReactNode][] = [
  [
    Tab.STANDARD,
    "Standard BOM",
    <IconComponents key={1} size={16} />,
  ],
  [
    Tab.CUSTOMIZED,
    "Customized BOM",
    <IconAdjustmentsBolt key={2} size={16} />,
  ],
];

const Tabs = ({
  activeTab,
  setActiveTab,
}: {
  activeTab: string;
  setActiveTab: (tab: Tab) => void;
}) => {
  const t = useTranslation();

  return (
    <MantineTabs
      mt={10}
      variant="outline"
      value={activeTab}
      onChange={(tab) => tab && setActiveTab(tab as Tab)}
    >
      <MantineTabs.List>
        {tabs.map(([tab, label, icon]) => {
          return (
            <MantineTabs.Tab
              key={tab}
              value={tab}
              c={activeTab === tab ? "primary" : ""}
              fw={activeTab === tab ? 700 : undefined}
              leftSection={icon}
            >
              {t(label)}
            </MantineTabs.Tab>
          );
        })}
      </MantineTabs.List>
    </MantineTabs>
  );
};

export default Tabs;
