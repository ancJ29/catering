import useAuthStore from "@/stores/auth.store";
import { Navigate } from "react-router-dom";

const Dashboard = () => {
  const { user } = useAuthStore();
  return <Navigate to={user?.dashboard || "/product-management"} />;
};

export default Dashboard;
