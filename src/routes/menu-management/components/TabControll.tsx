import useTranslation from "@/hooks/useTranslation";
import { type DailyMenuDetailMode as Mode } from "@/services/domain";
import { Box, Tabs } from "@mantine/core";
import {
  IconEditCircle,
  IconSettingsShare,
} from "@tabler/icons-react";
import { useCallback, useState } from "react";

const TabControll = ({
  tab = "detail",
  onChange,
}: {
  tab?: Mode;
  onChange: (tab: Mode) => void;
}) => {
  const t = useTranslation();
  const [activeTab, setActiveTab] = useState<Mode>(tab);
  const changeTab = useCallback(
    (tab: string | null) => {
      if (["detail", "modified"].includes(tab || "")) {
        setActiveTab(tab as Mode);
        onChange(tab as Mode);
      }
    },
    [onChange],
  );
  const isDetail = activeTab === "detail";
  return (
    <Box ta="left">
      <Tabs
        mt={10}
        variant="outline"
        value={activeTab}
        onChange={changeTab}
      >
        <Tabs.List>
          <Tabs.Tab
            value="detail"
            leftSection={<IconSettingsShare size={12} />}
            fw={isDetail ? 700 : undefined}
            c={isDetail ? "primary" : ""}
          >
            {t("Detail")}
          </Tabs.Tab>
          <Tabs.Tab
            value="modified"
            leftSection={<IconEditCircle size={12} />}
            fw={!isDetail ? 700 : undefined}
            c={!isDetail ? "primary" : ""}
          >
            {t("Modified")}
          </Tabs.Tab>
        </Tabs.List>
      </Tabs>
    </Box>
  );
};
export default TabControll;
