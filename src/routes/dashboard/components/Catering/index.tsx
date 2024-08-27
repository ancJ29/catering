import {
  CateringDashboard as CaterDashboard,
  getCateringDashboard,
} from "@/services/domain";
import useAuthStore from "@/stores/auth.store";
import useCustomerStore from "@/stores/customer.store";
import { Stack } from "@mantine/core";
import { useEffect, useState } from "react";
import DailyData from "./components/DailyData";
import DailyTask from "./components/DailyTask";

const CateringDashboard = () => {
  const [dashboard, setDashboard] = useState<CaterDashboard>();
  const { cateringId } = useAuthStore();
  const { customersByCateringId } = useCustomerStore();

  useEffect(() => {
    const fetchDashboard = async () => {
      const customers = customersByCateringId.get(cateringId || "");
      const data = await getCateringDashboard(
        customers?.map((customer) => customer.id) || [],
        cateringId,
      );
      setDashboard(data);
    };

    fetchDashboard();
  }, [cateringId, customersByCateringId]);

  return (
    <Stack gap={10} align="center">
      <DailyData dashboard={dashboard} />
      <DailyTask dashboard={dashboard} />
    </Stack>
  );
};

export default CateringDashboard;
