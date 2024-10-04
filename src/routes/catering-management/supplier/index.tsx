import useTranslation from "@/hooks/useTranslation";
import useCateringStore from "@/stores/catering.store";
import { Flex, Stack, Tabs, Text } from "@mantine/core";
import { IconCar, IconCoins } from "@tabler/icons-react";
import { ReactNode, useState } from "react";
import { useParams } from "react-router-dom";
import { Tab } from "./_configs";
import PriorityPrice from "./components/PriorityPrice";
import CateringSupplier from "./components/Supplier";

const tabs: [string, string, ReactNode][] = [
  [Tab.SUPPLIERS, "Suppliers", <IconCar key={1} size={16} />],
  [
    Tab.PRIORITY_PRICE,
    "Priority price",
    <IconCoins key={2} size={16} />,
  ],
];

const CateringSupplierManagement = () => {
  const { cateringId } = useParams();
  const { caterings } = useCateringStore();
  const t = useTranslation();
  const [activeTab, setActiveTab] = useState<Tab>(Tab.SUPPLIERS);

  return (
    <Stack gap={20}>
      <Flex w="100%" justify="center">
        <Text className="c-catering-font-bold" size="1.5rem">
          {caterings.get(cateringId || "")?.name || "-"} -{" "}
          {t("Suppliers")}
        </Text>
      </Flex>
      <Tabs
        variant="outline"
        value={activeTab}
        onChange={(tab) => tab && setActiveTab(tab as Tab)}
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
        <Tabs.Panel value={Tab.SUPPLIERS} pt={10}>
          <CateringSupplier cateringId={cateringId} />
        </Tabs.Panel>
        <Tabs.Panel value={Tab.PRIORITY_PRICE} pt={10}>
          <PriorityPrice cateringId={cateringId} />
        </Tabs.Panel>
      </Tabs>
    </Stack>
  );
};

export default CateringSupplierManagement;
