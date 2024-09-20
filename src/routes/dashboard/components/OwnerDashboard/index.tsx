import {
  getOwnerDashboard,
  OwnerDashboard as OwnerDashboardType,
} from "@/services/domain";
import { Stack } from "@mantine/core";
import { useEffect, useState } from "react";
import ImportantData from "./components/ImportantData";
import OtherData from "./components/OtherData";

const OwnerDashboard = () => {
  const [dashboard, setDashboard] = useState<OwnerDashboardType>();

  useEffect(() => {
    const fetchDashboard = async () => {
      const data = await getOwnerDashboard();
      setDashboard(data);
    };

    fetchDashboard();
  }, []);

  return (
    <Stack gap={20}>
      <ImportantData dashboard={dashboard} />
      <OtherData dashboard={dashboard} />
    </Stack>
  );
};

export default OwnerDashboard;
