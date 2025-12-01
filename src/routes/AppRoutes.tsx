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

// Masters
import CashBoxesPage from "@/pages/private/masters/cashboxes/CashBoxesPage";
import Clients from "@/pages/private/masters/clients/Clients";
import ThirdPartiesPage from "@/pages/private/masters/third-parties/ThirdPartiesPage";
import Tables from "@/pages/private/masters/tables/Tables";
import Warehouses from "@/pages/private/masters/warehouses/Warehouses";

// Inventory
import CategoriesPage from "@/pages/private/inventory/categories/CategoriesPage";
import MovementsPage from "@/pages/private/inventory/movements/MovementsPage";
import MenuPage from "@/pages/private/inventory/menu/MenuPage";
import Products from "@/pages/private/inventory/products/Products";
import Inventory from "@/pages/private/inventory/stock/Inventory";

// Sales
import PointOfSalePage from "@/pages/private/sales/pos/PointOfSalePage";
import InvoicesPage from "@/pages/private/sales/invoices/InvoicesPage";
import InvoiceFormPage from "@/pages/private/sales/invoices/InvoiceFormPage";
import KitchenPage from "@/pages/private/sales/kitchen/KitchenPage";
import BarPage from "@/pages/private/sales/bar/BarPage";
import ExpensesPage from "@/pages/private/sales/expenses/ExpensesPage";
import ReceivablesPage from "@/pages/private/sales/receivables/ReceivablesPage";
import CreditNotesPage from "@/pages/private/sales/credit-notes/CreditNotesPage";

// Reports
import SalesReportPage from "@/pages/private/reports/sales/SalesReportPage";
import InventoryReportPage from "@/pages/private/reports/inventory/InventoryReportPage";
import CashboxReportPage from "@/pages/private/reports/cashbox/CashboxReportPage";
import ExpensesReportPage from "@/pages/private/reports/expenses/ExpensesReportPage";

// Administration
import CompanyPage from "@/pages/private/administration/company/CompanyPage";
import LocationsPage from "@/pages/private/administration/locations/LocationsPage";
import SeriesPage from "@/pages/private/administration/series/SeriesPage";
import ConfigurationPage from "@/pages/private/administration/configuration/ConfigurationPage";

// Security
import UsersPage from "@/pages/private/security/users/UsersPage";
import RolesPage from "@/pages/private/security/roles/RolesPage";
import AuditPage from "@/pages/private/security/audit/AuditPage";
import ChangePasswordPage from "@/pages/private/security/change-password/ChangePasswordPage";

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

        // === VENTAS ===
        {
          path: "/ventas/puntos-de-ventas",
          element: (
            <PermissionRoute requiredPermission={Permission.VENTA_VIEW}>
              <PointOfSalePage />
            </PermissionRoute>
          ),
        },
        {
          path: "/ventas/cocina",
          element: (
            <PermissionRoute requiredPermission={Permission.VENTA_VIEW_KITCHEN}>
              <KitchenPage />
            </PermissionRoute>
          ),
        },
        {
          path: "/ventas/bar",
          element: (
            <PermissionRoute requiredPermission={Permission.VENTA_VIEW_BAR}>
              <BarPage />
            </PermissionRoute>
          ),
        },
        {
          path: "/ventas/facturas",
          element: (
            <PermissionRoute requiredPermission={Permission.VENTA_FACTURAR}>
              <InvoicesPage />
            </PermissionRoute>
          ),
        },
        {
          path: "/ventas/facturas/nueva",
          element: (
            <PermissionRoute requiredPermission={Permission.VENTA_FACTURAR}>
              <InvoiceFormPage />
            </PermissionRoute>
          ),
        },
        {
          path: "/ventas/facturas/:id/editar",
          element: (
            <PermissionRoute requiredPermission={Permission.VENTA_FACTURAR}>
              <InvoiceFormPage />
            </PermissionRoute>
          ),
        },

        // === VENTAS - FINANZAS ===
        {
          path: "/ventas/gastos",
          element: (
            <PermissionRoute requiredPermission={Permission.FIN_GASTOS_VIEW}>
              <ExpensesPage />
            </PermissionRoute>
          ),
        },
        {
          path: "/ventas/cuentas-por-cobrar",
          element: (
            <PermissionRoute requiredPermission={Permission.FIN_RECEIVABLES_VIEW}>
              <ReceivablesPage />
            </PermissionRoute>
          ),
        },
        {
          path: "/ventas/notas-credito",
          element: (
            <PermissionRoute requiredPermission={Permission.FIN_CREDIT_NOTES_VIEW}>
              <CreditNotesPage />
            </PermissionRoute>
          ),
        },

        // === INVENTARIO ===
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
          path: "/inventario/menu",
          element: (
            <PermissionRoute requiredPermission={Permission.CAT_MENU_VIEW}>
              <MenuPage />
            </PermissionRoute>
          ),
        },

        // === MAESTROS ===
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

        // === ADMINISTRACIÓN ===
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
          path: "/administracion/series",
          element: (
            <PermissionRoute requiredPermission={Permission.ADM_SERIES_VIEW}>
              <SeriesPage />
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

        // === SEGURIDAD ===
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

        // === REPORTES ===
        {
          path: "/reportes/ventas",
          element: (
            <PermissionRoute requiredPermission={Permission.REP_VENTAS}>
              <SalesReportPage />
            </PermissionRoute>
          ),
        },
        {
          path: "/reportes/inventario",
          element: (
            <PermissionRoute requiredPermission={Permission.REP_INVENTARIO}>
              <InventoryReportPage />
            </PermissionRoute>
          ),
        },
        {
          path: "/reportes/caja",
          element: (
            <PermissionRoute requiredPermission={Permission.REP_CAJA}>
              <CashboxReportPage />
            </PermissionRoute>
          ),
        },
        {
          path: "/reportes/gastos",
          element: (
            <PermissionRoute requiredPermission={Permission.REP_GASTOS}>
              <ExpensesReportPage />
            </PermissionRoute>
          ),
        },




        // === LEGACY (mantener compatibilidad temporal) ===
        {
          path: "/records/clients",
          element: <Navigate to="/maestros/clientes" replace />,
        },
        {
          path: "/records/products",
          element: <Navigate to="/inventario/productos" replace />,
        },
        {
          path: "/records/categories",
          element: <Navigate to="/inventario/categorias" replace />,
        },
        {
          path: "/records/warehouses",
          element: <Navigate to="/maestros/bodegas" replace />,
        },
        // Redirects desde Catálogo a Inventario
        {
          path: "/catalogo/productos",
          element: <Navigate to="/inventario/productos" replace />,
        },
        {
          path: "/catalogo/categorias",
          element: <Navigate to="/inventario/categorias" replace />,
        },
        {
          path: "/catalogo/menu",
          element: <Navigate to="/inventario/menu" replace />,
        },
        {
          path: "/records/cashboxes",
          element: <Navigate to="/maestros/cajas" replace />,
        },
        // Redirects desde Finanzas a Ventas (fusión)
        {
          path: "/finanzas/gastos",
          element: <Navigate to="/ventas/gastos" replace />,
        },
        {
          path: "/finanzas/cuentas-por-cobrar",
          element: <Navigate to="/ventas/cuentas-por-cobrar" replace />,
        },
        {
          path: "/finanzas/notas-credito",
          element: <Navigate to="/ventas/notas-credito" replace />,
        },
        {
          path: "/mesas",
          element: <Navigate to="/maestros/mesas" replace />,
        },
        {
          path: "/movements/inventory",
          element: <Navigate to="/inventario" replace />,
        },
        {
          path: "/movements/invoices",
          element: <Navigate to="/ventas/facturas" replace />,
        },
        {
          path: "/movements/invoices/new",
          element: <Navigate to="/ventas/facturas/nueva" replace />,
        },
        {
          path: "/movements/invoices/:id/edit",
          element: <Navigate to="/ventas/facturas/:id/editar" replace />,
        },

        // Placeholders legacy
        {
          path: "/orders",
          element: (
            <PermissionRoute requiredPermission={Permission.VIEW_ORDERS}>
              <div>Pedidos - En desarrollo</div>
            </PermissionRoute>
          ),
        },
        {
          path: "/calendar",
          element: (
            <PermissionRoute requiredPermission={Permission.VIEW_CALENDAR}>
              <div>Calendario - En desarrollo</div>
            </PermissionRoute>
          ),
        },
        {
          path: "/reviews",
          element: (
            <PermissionRoute requiredPermission={Permission.VIEW_REVIEWS}>
              <div>Reseñas - En desarrollo</div>
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
