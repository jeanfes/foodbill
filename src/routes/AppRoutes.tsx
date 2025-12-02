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

import CategoriesPage from "@/pages/private/inventory/categories/CategoriesPage";
import MovementsPage from "@/pages/private/inventory/movements/MovementsPage";
import MenuPage from "@/pages/private/masters/menu/MenuPage";
import Products from "@/pages/private/inventory/products/Products";
import Inventory from "@/pages/private/inventory/stock/Inventory";

import PointOfSalePage from "@/pages/private/movements/pos/PointOfSalePage";
import KitchenPage from "@/pages/private/movements/kitchen/KitchenPage";
import BarPage from "@/pages/private/movements/bar/BarPage";
import CashboxPage from "@/pages/private/movements/cashbox/CashboxPage";
import ExpensesPage from "@/pages/private/movements/expenses/ExpensesPage";
import InvoicesPage from "@/pages/private/movements/invoices/InvoicesPage";
import InvoiceFormPage from "@/pages/private/movements/invoices/InvoiceFormPage";

import CompanyPage from "@/pages/private/administration/company/CompanyPage";
import LocationsPage from "@/pages/private/administration/locations/LocationsPage";
import ConfigurationPage from "@/pages/private/administration/configuration/ConfigurationPage";

import UsersPage from "@/pages/private/security/users/UsersPage";
import RolesPage from "@/pages/private/security/roles/RolesPage";
import AuditPage from "@/pages/private/security/audit/AuditPage";
import ChangePasswordPage from "@/pages/private/security/change-password/ChangePasswordPage";
import CancelationsPage from "@/pages/private/administration/cancellations/CancelationsPage";
import NotesPage from "@/pages/private/movements/notes/NotesPage";

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
          path: "/movimientos/pos",
          element: (
            <PermissionRoute requiredPermission={Permission.VENTA_VIEW}>
              <PointOfSalePage />
            </PermissionRoute>
          ),
        },
        {
          path: "/movimientos/cocina",
          element: (
            <PermissionRoute requiredPermission={Permission.VENTA_VIEW_KITCHEN}>
              <KitchenPage />
            </PermissionRoute>
          ),
        },
        {
          path: "/movimientos/bar",
          element: (
            <PermissionRoute requiredPermission={Permission.VENTA_VIEW_BAR}>
              <BarPage />
            </PermissionRoute>
          ),
        },
        {
          path: "/movimientos/caja",
          element: (
            <PermissionRoute requiredPermission={Permission.FIN_CAJA_VIEW}>
              <CashboxPage />
            </PermissionRoute>
          ),
        },
        {
          path: "/movimientos/caja/apertura-cierre",
          element: (
            <PermissionRoute requiredPermission={Permission.CAJA_VIEW_SESIONES}>
              <div className="p-6"><h1 className="text-2xl font-bold mb-2">Apertura y cierre de caja</h1><p className="text-muted-foreground">Gestiona sesiones de caja: abrir, cerrar, arqueo.</p></div>
            </PermissionRoute>
          ),
        },
        {
          path: "/movimientos/caja/movimientos",
          element: (
            <PermissionRoute requiredPermission={Permission.CAJA_VIEW_MOVIMIENTOS}>
              <div className="p-6"><h1 className="text-2xl font-bold mb-2">Movimientos de caja</h1><p className="text-muted-foreground">Ingresos/Egresos, transferencias, ajustes.</p></div>
            </PermissionRoute>
          ),
        },
        {
          path: "/movimientos/gastos",
          element: (
            <PermissionRoute requiredPermission={Permission.FIN_GASTOS_VIEW}>
              <ExpensesPage />
            </PermissionRoute>
          ),
        },

        {
          path: "/movimientos/facturacion",
          element: (
            <PermissionRoute requiredPermission={Permission.FAC_VIEW}>
              <InvoicesPage />
            </PermissionRoute>
          ),
        },
        {
          path: "/movimientos/facturacion/nueva",
          element: (
            <PermissionRoute requiredPermission={Permission.FAC_EDIT}>
              <InvoiceFormPage />
            </PermissionRoute>
          ),
        },
        {
          path: "/movimientos/facturacion/:id/editar",
          element: (
            <PermissionRoute requiredPermission={Permission.FAC_EDIT}>
              <InvoiceFormPage />
            </PermissionRoute>
          ),
        },

        {
          path: "/inventario/stock",
          element: (
            <PermissionRoute requiredPermission={Permission.INV_VIEW}>
              <Inventory />
            </PermissionRoute>
          ),
        },
        {
          path: "/inventario/movimientos",
          element: (
            <PermissionRoute requiredPermission={Permission.INV_VIEW_MOVIMIENTOS}>
              <MovementsPage />
            </PermissionRoute>
          ),
        },
        {
          path: "/inventario/productos",
          element: (
            <PermissionRoute requiredPermission={Permission.CAT_PRODUCTOS_VIEW}>
              <Products />
            </PermissionRoute>
          ),
        },
        {
          path: "/inventario/categorias",
          element: (
            <PermissionRoute requiredPermission={Permission.CAT_CATEGORIAS_VIEW}>
              <CategoriesPage />
            </PermissionRoute>
          ),
        },
        {
          path: "/maestros/menu",
          element: (
            <PermissionRoute requiredPermission={Permission.CAT_MENU_VIEW}>
              <MenuPage />
            </PermissionRoute>
          ),
        },

        {
          path: "/maestros/clientes",
          element: (
            <PermissionRoute requiredPermission={Permission.MAE_CLIENTES_VIEW}>
              <Clients />
            </PermissionRoute>
          ),
        },
        {
          path: "/maestros/terceros",
          element: (
            <PermissionRoute requiredPermission={Permission.MAE_PROVEEDORES_VIEW}>
              <ThirdPartiesPage />
            </PermissionRoute>
          ),
        },
        {
          path: "/maestros/mesas",
          element: (
            <PermissionRoute requiredPermission={Permission.MAE_MESAS_VIEW}>
              <Tables />
            </PermissionRoute>
          ),
        },
        {
          path: "/maestros/bodegas",
          element: (
            <PermissionRoute requiredPermission={Permission.MAE_BODEGAS_VIEW}>
              <Warehouses />
            </PermissionRoute>
          ),
        },
        {
          path: "/maestros/cajas",
          element: (
            <PermissionRoute requiredPermission={Permission.MAE_CAJAS_VIEW}>
              <CashBoxesPage />
            </PermissionRoute>
          ),
        },

        {
          path: "/administracion/empresa",
          element: (
            <PermissionRoute requiredPermission={Permission.ADM_EMPRESA_VIEW}>
              <CompanyPage />
            </PermissionRoute>
          ),
        },
        {
          path: "/administracion/locales",
          element: (
            <PermissionRoute requiredPermission={Permission.ADM_LOCALES_VIEW}>
              <LocationsPage />
            </PermissionRoute>
          ),
        },
        {
          path: "/administracion/configuracion",
          element: (
            <PermissionRoute requiredPermission={Permission.ADM_SETTINGS_VIEW}>
              <ConfigurationPage />
            </PermissionRoute>
          ),
        },

        {
          path: "/seguridad/usuarios",
          element: (
            <PermissionRoute requiredPermission={Permission.SEG_USUARIOS_VIEW}>
              <UsersPage />
            </PermissionRoute>
          ),
        },
        {
          path: "/seguridad/roles",
          element: (
            <PermissionRoute requiredPermission={Permission.SEG_ROLES_VIEW}>
              <RolesPage />
            </PermissionRoute>
          ),
        },
        {
          path: "/seguridad/auditoria",
          element: (
            <PermissionRoute requiredPermission={Permission.SEG_AUDIT_VIEW}>
              <AuditPage />
            </PermissionRoute>
          ),
        },
        {
          path: "/seguridad/cambiar-contrasena",
          element: (
            <PermissionRoute requiredPermission={Permission.SEG_CHANGE_PASSWORD}>
              <ChangePasswordPage />
            </PermissionRoute>
          ),
        },
        {
          path: "/movimientos/notas",
          element: (
            <PermissionRoute requiredPermission={Permission.FIN_CREDIT_NOTES_VIEW}>
              <NotesPage />
            </PermissionRoute>
          ),
        },
        {
          path: "/administracion/anulaciones",
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
