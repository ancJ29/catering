import { lazy } from "react";
import { Navigate, type RouteObject } from "react-router-dom";

const map = {
  Login: lazy(() => import("@/routes/login")),
  ForgotPassword: lazy(() => import("@/routes/forgot-password")),
};
const routes: RouteObject[] = [
  {
    path: "/login",
    element: <map.Login />,
  },
  {
    path: "/forgot-password",
    element: <map.ForgotPassword />,
  },
  {
    path: "/*",
    element: <Navigate to="/login" />,
  },
];

export default routes;
