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
import CategoriesPage from "@/pages/private/records/categories/CategoriesPage.tsx";
import WarehousesPage from "@/pages/private/records/warehouses/WarehousesPage.tsx";
import CashBoxesPage from "@/pages/private/records/cashboxes/CashBoxesPageNew.tsx";
import Inventory from "@/pages/private/movements/inventory/Inventory";
import Tables from "@/pages/private/records/tables/Tables";
import Products from "@/pages/private/records/products/Products";
import Clients from "@/pages/private/records/clients/Clients";
import InvoicesPage from "@/pages/private/movements/invoices/InvoicesPage";
import InvoiceFormPage from "@/pages/private/movements/invoices/InvoiceFormPage";

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
              <Clients />
            </PermissionRoute>
          ),
        },
        {
          path: "/records/products",
          element: (
            <PermissionRoute requiredPermission={Permission.VIEW_PRODUCTS}>
              <Products />
            </PermissionRoute>
          ),
        },
        {
          path: "/records/categories",
          element: (
            <PermissionRoute requiredPermission={Permission.VIEW_CATEGORIES}>
              <CategoriesPage />
            </PermissionRoute>
          ),
        },
        {
          path: "/records/warehouses",
          element: (
            <PermissionRoute requiredPermission={Permission.VIEW_INVENTORY}>
              <WarehousesPage />
            </PermissionRoute>
          ),
        },
        {
          path: "/records/cashboxes",
          element: (
            <PermissionRoute requiredPermission={Permission.VIEW_CASHBOXES}>
              <CashBoxesPage />
            </PermissionRoute>
          ),
        },
        {
          path: "/mesas",
          element: (
            <PermissionRoute requiredPermission={Permission.VIEW_TABLES}>
              <Tables />
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
          path: "/movements/inventory",
          element: (
            <PermissionRoute requiredPermission={Permission.VIEW_INVENTORY}>
              <Inventory />
            </PermissionRoute>
          ),
        },
        {
          path: "/movements/invoices",
          element: (
            <PermissionRoute requiredPermission={Permission.VIEW_CASHBOXES}>
              <InvoicesPage />
            </PermissionRoute>
          ),
        },
        {
          path: "/movements/invoices/new",
          element: (
            <PermissionRoute requiredPermission={Permission.VIEW_CASHBOXES}>
              <InvoiceFormPage />
            </PermissionRoute>
          ),
        },
        {
          path: "/movements/invoices/:id/edit",
          element: (
            <PermissionRoute requiredPermission={Permission.VIEW_CASHBOXES}>
              <InvoiceFormPage />
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
          <div className="text-center space-y-4 max-w-md mx-auto p-6">
            <h1 className="text-4xl font-bold text-destructive">Acceso Denegado</h1>
            <p className="text-muted-foreground">
              No tienes los permisos necesarios para acceder a este recurso.
            </p>
            <p className="text-sm text-muted-foreground">
              Si crees que deberías tener acceso, contacta con el administrador del sistema.
            </p>
            <div className="pt-4">
              <a
                href="/home"
                className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2"
              >
                Volver al inicio
              </a>
            </div>
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
