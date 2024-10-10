import useTranslation from "@/hooks/useTranslation";
import {
  addCateringDashboard,
  CateringDashboard as CaterDashboard,
  getCateringDashboard,
} from "@/services/domain";
import { Button, Flex, Stack } from "@mantine/core";
import { IconReload } from "@tabler/icons-react";
import { useEffect, useState } from "react";
import DailyData from "./components/DailyData";
import DailyTask from "./components/DailyTask";

const DashboardForCatering = () => {
  const t = useTranslation();
  const [dashboard, setDashboard] = useState<CaterDashboard>();

  const fetchDashboard = async () => {
    const data = await getCateringDashboard();
    setDashboard(data);
  };

  useEffect(() => {
    fetchDashboard();
  }, []);

  const reload = async () => {
    await addCateringDashboard({ key: dashboard?.key || "" });
    await fetchDashboard();
  };

  return (
    <Stack gap={10} align="center">
      <Flex justify="end" w="100%">
        <Button
          leftSection={<IconReload size={14} />}
          onClick={reload}
        >
          {t("Reload")}
        </Button>
      </Flex>
      <DailyData dashboard={dashboard} />
      <DailyTask dashboard={dashboard} />
    </Stack>
  );
};

export default DashboardForCatering;
