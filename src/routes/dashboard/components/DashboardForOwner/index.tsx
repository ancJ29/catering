import useTranslation from "@/hooks/useTranslation";
import {
  addOwnerDashboard,
  getOwnerDashboard,
  OwnerDashboard as OwnerDashboardType,
} from "@/services/domain";
import { Button, Flex, Stack } from "@mantine/core";
import { IconReload } from "@tabler/icons-react";
import { useEffect, useState } from "react";
import ImportantData from "./components/ImportantData";
import OtherData from "./components/OtherData";

const DashboardForOwner = () => {
  const t = useTranslation();
  const [dashboard, setDashboard] = useState<OwnerDashboardType>();

  const fetchDashboard = async () => {
    const data = await getOwnerDashboard();
    setDashboard(data);
  };

  useEffect(() => {
    fetchDashboard();
  }, []);

  const reload = async () => {
    await addOwnerDashboard({ key: dashboard?.key || "" });
    await fetchDashboard();
  };

  return (
    <Stack gap={20}>
      <Flex justify="end">
        <Button
          leftSection={<IconReload size={14} />}
          onClick={reload}
        >
          {t("Reload")}
        </Button>
      </Flex>
      <ImportantData dashboard={dashboard} />
      <OtherData dashboard={dashboard} />
    </Stack>
  );
};

export default DashboardForOwner;
