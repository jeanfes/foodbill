import ForgotPassword from "@/pages/public/forgotPassword/ForgotPassword";
import AuthLayout from "@/layouts/authLayout/AuthLayout";
import Register from "@/pages/public/register/Register";
import PublicRoute from "./validateRoutes/PublicRoute";
import PrivateRoute from "./validateRoutes/PrivateRoute";
import PermissionRoute from "./validateRoutes/PermissionRoute";
import { Navigate, useRoutes } from "react-router-dom";
import Login from "@/pages/public/login/Login";
import NotFound from "@/pages/public/notFound/NotFound";
import FullLayout from "../layouts/fullLayout/FullLayout";
import Home from "@/pages/private/home/Home";
import { Permission } from "@/interfaces/role";
import ClientsPage from "@/pages/private/records/clients/ClientsPage.tsx";
import ProductsPage from "@/pages/private/records/products/ProductsPage.tsx";

const AppRoutes = () => {
  const routes = useRoutes([
    {
      path: "/",
      element: <Navigate to="/login" replace />,
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
      element: (
        <PrivateRoute>
          <FullLayout title="Panel de control" />
        </PrivateRoute>
      ),
      children: [
        {
          path: "/home",
          element: (
            <PermissionRoute requiredPermission={Permission.VIEW_DASHBOARD}>
              <Home />
            </PermissionRoute>
          ),
        },
        {
          path: "/records/clients",
          element: (
            <PermissionRoute requiredPermission={Permission.VIEW_CLIENTS}>
              <ClientsPage />
            </PermissionRoute>
          ),
        },
        {
          path: "/records/products",
          element: (
            <PermissionRoute requiredPermission={Permission.VIEW_PRODUCTS}>
              <ProductsPage />
            </PermissionRoute>
          ),
        },
        {
          path: "/orders",
          element: (
            <PermissionRoute requiredPermission={Permission.VIEW_ORDERS}>
              <div>Orders Page - En desarrollo</div>
            </PermissionRoute>
          ),
        },
        {
          path: "/calendar",
          element: (
            <PermissionRoute requiredPermission={Permission.VIEW_CALENDAR}>
              <div>Calendar Page - En desarrollo</div>
            </PermissionRoute>
          ),
        },
        {
          path: "/menu",
          element: (
            <PermissionRoute requiredPermission={Permission.VIEW_MENU}>
              <div>Menu Page - En desarrollo</div>
            </PermissionRoute>
          ),
        },
        {
          path: "/inventory",
          element: (
            <PermissionRoute requiredPermission={Permission.VIEW_INVENTORY}>
              <div>Inventory Page - En desarrollo</div>
            </PermissionRoute>
          ),
        },
        {
          path: "/reviews",
          element: (
            <PermissionRoute requiredPermission={Permission.VIEW_REVIEWS}>
              <div>Reviews Page - En desarrollo</div>
            </PermissionRoute>
          ),
        },
      ],
    },
    {
      path: "/not-found",
      element: <NotFound />,
    },
    {
      path: "/unauthorized",
      element: (
        <div className="min-h-screen flex items-center justify-center bg-background">
          <div className="text-center space-y-4">
            <h1 className="text-4xl font-bold text-destructive">Acceso Denegado</h1>
            <p className="text-muted-foreground">No tienes permisos para acceder a este recurso</p>
            <Navigate to="/home" />
          </div>
        </div>
      ),
    },
    {
      path: "*",
      element: <Navigate to="/not-found" replace />,
    },
  ]);

  return routes;
};

export default AppRoutes;
