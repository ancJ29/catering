import { lazy } from "react";
import { Navigate, type RouteObject } from "react-router-dom";

const map = {
  Login: lazy(() => import("@/routes/login")),
};
const routes: RouteObject[] = [
  {
    path: "/login",
    element: <map.Login />,
  },
  {
    path: "/*",
    element: <Navigate to="/login" />,
  },
];

export default routes;
