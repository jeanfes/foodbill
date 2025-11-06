import ForgotPassword from "@/pages/public/forgotPassword/ForgotPassword";
import AuthLayout from "@/layouts/authLayout/AuthLayout";
import Register from "@/pages/public/register/Register";
import PublicRoute from "./validateRoutes/PublicRoute";
import { Navigate, useRoutes } from "react-router-dom";
import Login from "@/pages/public/login/Login";
import NotFound from "@/pages/public/notFound/NotFound";
import FullLayout from "../layouts/fullLayout/FullLayout";
import Home from "../pages/private/home/HomePage";

const AppRoutes = () => {
  const routes = useRoutes([
    {
      path: "/",
      element: <Navigate to="/login" />,
    },
    {
      element: (
        <PublicRoute>
          <AuthLayout />
        </PublicRoute>
      ),
      children: [
        {
          path: "/login",
          element: <Login />,
        },
        {
          path: "/register",
          element: <Register />,
        },
      ],
    },
    {
      path: "/forgot-password",
      element: (
        <PublicRoute>
          <ForgotPassword />
        </PublicRoute>
      ),
    },
    {
      element: <FullLayout title="Panel de control" />,
      children: [
        {
          path: "/home",
          element: <Home />,
        },
        {
          path: "/orders",
          element: <></>,
        },
        {
          path: "/calendar",
          element: <></>,
        },
        {
          path: "/menu",
          element: <></>,
        },
        {
          path: "/inventory",
          element: <></>,
        },
        {
          path: "/reviews",
          element: <></>,
        },
      ],
    },
    {
      path: "/not-found",
      element: <NotFound />,
    },
    {
      path: "*",
      element: <Navigate to="/not-found" />,
    },
  ]);

  return routes;
};

export default AppRoutes;
