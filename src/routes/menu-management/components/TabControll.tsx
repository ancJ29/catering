import useTranslation from "@/hooks/useTranslation";
import { Tabs } from "@mantine/core";
import {
  IconEditCircle,
  IconSettingsShare,
} from "@tabler/icons-react";
import { useCallback, useState } from "react";

const TabControll = ({
  tab = "detail",
  onChange,
}: {
  tab?: string;
  onChange: (tab: string) => void;
}) => {
  const t = useTranslation();
  const [activeTab, setActiveTab] = useState<string>(tab);
  const changeTab = useCallback(
    (tab: string | null) => {
      if (tab) {
        setActiveTab(tab);
        onChange(tab);
      }
    },
    [onChange],
  );
  return (
    <Tabs variant="pills" value={activeTab} onChange={changeTab}>
      <Tabs.List>
        <Tabs.Tab
          value="detail"
          leftSection={<IconSettingsShare size={12} />}
        >
          {t("Detail")}
        </Tabs.Tab>
        <Tabs.Tab
          value="modified"
          leftSection={<IconEditCircle size={12} />}
        >
          {t("Modified")}
        </Tabs.Tab>
      </Tabs.List>
    </Tabs>
  );
};
export default TabControll;
