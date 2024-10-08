import { ClientRoles } from "@/auto-generated/api-configs";
import useAuthStore from "@/stores/auth.store";
import { Navigate } from "react-router-dom";
import DashboardForCatering from "./components/DashboardForCatering";
import DashboardForOwner from "./components/DashboardForOwner";

const Dashboard = () => {
  const { user, isCatering, role } = useAuthStore();

  if (role === ClientRoles.OWNER) {
    return <DashboardForOwner />;
  }

  if (isCatering) {
    return <DashboardForCatering />;
  }

  return <Navigate to={user?.dashboard || "/product-management"} />;
};

export default Dashboard;
