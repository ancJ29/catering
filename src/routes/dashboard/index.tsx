import { ClientRoles } from "@/auto-generated/api-configs";
import useAuthStore from "@/stores/auth.store";
import { Navigate } from "react-router-dom";
import CateringDashboard from "./components/CateringDashboard";
import OwnerDashboard from "./components/OwnerDashboard";

const Dashboard = () => {
  const { user, isCatering, role } = useAuthStore();

  if (role === ClientRoles.OWNER) {
    return <OwnerDashboard />;
  }

  if (isCatering) {
    return <CateringDashboard />;
  }

  return <Navigate to={user?.dashboard || "/product-management"} />;
};

export default Dashboard;
