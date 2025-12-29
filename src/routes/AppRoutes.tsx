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

import CashBoxesPage from "@/pages/private/masters/cashboxes/CashBoxesPage";
import Clients from "@/pages/private/masters/clients/Clients";
import ThirdPartiesPage from "@/pages/private/masters/third-parties/ThirdPartiesPage";
import Tables from "@/pages/private/masters/tables/Tables";
import Warehouses from "@/pages/private/masters/warehouses/Warehouses";

import CategoriesPage from "@/pages/private/masters/categories/CategoriesPage";
import MovementsPage from "@/pages/private/inventory/movements/MovementsPage";
import MenuPage from "@/pages/private/masters/menu/MenuPage";
import Products from "@/pages/private/masters/products/Products";
import Inventory from "@/pages/private/inventory/stock/Inventory";

import PointOfSalePage from "@/pages/private/operation/pos/PointOfSalePage";
import KitchenPage from "@/pages/private/operation/kitchen/KitchenPage";
import BarPage from "@/pages/private/operation/bar/BarPage";
import CashboxPage from "@/pages/private/operation/cashbox/CashboxPage";
import ExpensesPage from "@/pages/private/operation/expenses/ExpensesPage";
import InvoicesPage from "@/pages/private/operation/invoices/InvoicesPage";
import InvoiceFormPage from "@/pages/private/operation/invoices-new/InvoiceFormPage";
import NotesPage from "@/pages/private/operation/notes/NotesPage";
import CashboxSessionsPage from "@/pages/private/operation/cashbox-sessions/CashboxSessionsPage";
import CashboxMovementsPage from "@/pages/private/operation/cashbox-movements/CashboxMovementsPage";
import OrdersBoard from "@/pages/private/operation/orders/OrdersBoard";
import CompanyPage from "@/pages/private/administration/company/CompanyPage";
import LocationsPage from "@/pages/private/administration/locations/LocationsPage";
import ConfigurationPage from "@/pages/private/administration/configuration/ConfigurationPage";
import UsersPage from "@/pages/private/security/users/UsersPage";
import RolesPage from "@/pages/private/security/roles/RolesPage";
import AuditPage from "@/pages/private/security/audit/AuditPage";
import ChangePasswordPage from "@/pages/private/security/change-password/ChangePasswordPage";
import CancelationsPage from "@/pages/private/administration/cancellations/CancelationsPage";

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
          path: "/operation/orders",
          element: (
            <PermissionRoute requiredPermission={Permission.VENTA_VIEW}>
              <OrdersBoard />
            </PermissionRoute>
          ),
        },
        {
          path: "/operation/pos",
          element: (
            <PermissionRoute requiredPermission={Permission.VENTA_VIEW}>
              <PointOfSalePage />
            </PermissionRoute>
          ),
        },
        {
          path: "/operation/kitchen",
          element: (
            <PermissionRoute requiredPermission={Permission.VENTA_VIEW_KITCHEN}>
              <KitchenPage />
            </PermissionRoute>
          ),
        },
        {
          path: "/operation/bar",
          element: (
            <PermissionRoute requiredPermission={Permission.VENTA_VIEW_BAR}>
              <BarPage />
            </PermissionRoute>
          ),
        },
        {
          path: "/operation/cashbox",
          element: (
            <PermissionRoute requiredPermission={Permission.FIN_CAJA_VIEW}>
              <CashboxPage />
            </PermissionRoute>
          ),
        },
        {
          path: "/operation/cashbox-sessions",
          element: (
            <PermissionRoute requiredPermission={Permission.CAJA_VIEW_SESIONES}>
              <CashboxSessionsPage />
            </PermissionRoute>
          ),
        },
        {
          path: "/operation/cashbox-movements",
          element: (
            <PermissionRoute requiredPermission={Permission.CAJA_VIEW_MOVIMIENTOS}>
              <CashboxMovementsPage />
            </PermissionRoute>
          ),
        },
        {
          path: "/operation/expenses",
          element: (
            <PermissionRoute requiredPermission={Permission.FIN_GASTOS_VIEW}>
              <ExpensesPage />
            </PermissionRoute>
          ),
        },

        {
          path: "/operation/invoices",
          element: (
            <PermissionRoute requiredPermission={Permission.FAC_VIEW}>
              <InvoicesPage />
            </PermissionRoute>
          ),
        },
        {
          path: "/operation/invoices/new",
          element: (
            <PermissionRoute requiredPermission={Permission.FAC_EDIT}>
              <InvoiceFormPage />
            </PermissionRoute>
          ),
        },
        {
          path: "/operation/invoices/:id/edit",
          element: (
            <PermissionRoute requiredPermission={Permission.FAC_EDIT}>
              <InvoiceFormPage />
            </PermissionRoute>
          ),
        },

        {
          path: "/inventory/stock",
          element: (
            <PermissionRoute requiredPermission={Permission.INV_VIEW}>
              <Inventory />
            </PermissionRoute>
          ),
        },
        {
          path: "/inventory/movements",
          element: (
            <PermissionRoute requiredPermission={Permission.INV_VIEW_MOVIMIENTOS}>
              <MovementsPage />
            </PermissionRoute>
          ),
        },
        {
          path: "/masters/products",
          element: (
            <PermissionRoute requiredPermission={Permission.CAT_PRODUCTOS_VIEW}>
              <Products />
            </PermissionRoute>
          ),
        },
        {
          path: "/masters/categories",
          element: (
            <PermissionRoute requiredPermission={Permission.CAT_CATEGORIAS_VIEW}>
              <CategoriesPage />
            </PermissionRoute>
          ),
        },
        {
          path: "/masters/menu",
          element: (
            <PermissionRoute requiredPermission={Permission.CAT_MENU_VIEW}>
              <MenuPage />
            </PermissionRoute>
          ),
        },

        {
          path: "/masters/clients",
          element: (
            <PermissionRoute requiredPermission={Permission.MAE_CLIENTES_VIEW}>
              <Clients />
            </PermissionRoute>
          ),
        },
        {
          path: "/masters/third-parties",
          element: (
            <PermissionRoute requiredPermission={Permission.MAE_PROVEEDORES_VIEW}>
              <ThirdPartiesPage />
            </PermissionRoute>
          ),
        },
        {
          path: "/masters/tables",
          element: (
            <PermissionRoute requiredPermission={Permission.MAE_MESAS_VIEW}>
              <Tables />
            </PermissionRoute>
          ),
        },
        {
          path: "/masters/warehouses",
          element: (
            <PermissionRoute requiredPermission={Permission.MAE_BODEGAS_VIEW}>
              <Warehouses />
            </PermissionRoute>
          ),
        },
        {
          path: "/masters/cashboxes",
          element: (
            <PermissionRoute requiredPermission={Permission.MAE_CAJAS_VIEW}>
              <CashBoxesPage />
            </PermissionRoute>
          ),
        },

        {
          path: "/administration/company",
          element: (
            <PermissionRoute requiredPermission={Permission.ADM_EMPRESA_VIEW}>
              <CompanyPage />
            </PermissionRoute>
          ),
        },
        {
          path: "/administration/locations",
          element: (
            <PermissionRoute requiredPermission={Permission.ADM_LOCALES_VIEW}>
              <LocationsPage />
            </PermissionRoute>
          ),
        },
        {
          path: "/administration/settings",
          element: (
            <PermissionRoute requiredPermission={Permission.ADM_SETTINGS_VIEW}>
              <ConfigurationPage />
            </PermissionRoute>
          ),
        },

        {
          path: "/security/users",
          element: (
            <PermissionRoute requiredPermission={Permission.SEG_USUARIOS_VIEW}>
              <UsersPage />
            </PermissionRoute>
          ),
        },
        {
          path: "/security/roles",
          element: (
            <PermissionRoute requiredPermission={Permission.SEG_ROLES_VIEW}>
              <RolesPage />
            </PermissionRoute>
          ),
        },
        {
          path: "/security/audit",
          element: (
            <PermissionRoute requiredPermission={Permission.SEG_AUDIT_VIEW}>
              <AuditPage />
            </PermissionRoute>
          ),
        },
        {
          path: "/security/change-password",
          element: (
            <PermissionRoute requiredPermission={Permission.SEG_CHANGE_PASSWORD}>
              <ChangePasswordPage />
            </PermissionRoute>
          ),
        },
        {
          path: "/operation/notes",
          element: (
            <PermissionRoute requiredPermission={Permission.FIN_CREDIT_NOTES_VIEW}>
              <NotesPage />
            </PermissionRoute>
          ),
        },
        {
          path: "/administration/cancellations",
          element: (
            <PermissionRoute requiredPermission={Permission.ADM_ANULACIONES_VIEW}>
              <CancelationsPage />
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
            <h1 className="text-4xl font-bold text-destructive">Access Denied</h1>
            <p className="text-muted-foreground">
              You don't have the required permissions to access this resource.
            </p>
            <p className="text-sm text-muted-foreground">
              If you believe you should have access, contact your system administrator.
            </p>
            <div className="pt-4">
              <a
                href="/home"
                className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2"
              >
                Back to Home
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
