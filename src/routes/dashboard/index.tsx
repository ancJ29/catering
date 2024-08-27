import useAuthStore from "@/stores/auth.store";
import { Navigate } from "react-router-dom";
import CateringDashboard from "./components/Catering";

const Dashboard = () => {
  const { user, isCatering } = useAuthStore();

  if (isCatering) {
    return <CateringDashboard />;
  }

  return <Navigate to={user?.dashboard || "/product-management"} />;
};

export default Dashboard;
