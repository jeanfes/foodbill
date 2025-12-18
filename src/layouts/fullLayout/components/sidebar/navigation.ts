import {
  Home,
  Users,
  Package,
  RefreshCw,
  Building2,
  Shield,
} from "lucide-react"
import { Permission } from "@/interfaces/role"

export interface NavigationChildItem {
  name: string
  href: string
  badge?: string | number
  requiredPermission?: Permission
}

export interface NavigationItem {
  name: string
  href: string
  icon: any
  hasDropdown?: boolean
  badge?: string | number
  requiredPermission?: Permission
  children?: NavigationChildItem[]
}

// Configuración centralizada de navegación del sidebar
export const navigationItems: NavigationItem[] = [
  // Inicio
  {
    name: "Inicio",
    href: "/home",
    icon: Home,
    requiredPermission: Permission.VIEW_DASHBOARD,
  },

  // Maestros (CRUD y catálogos)
  {
    name: "Maestros",
    href: "/masters/clients",
    icon: Users,
    hasDropdown: true,
    // Sin permiso padre: el grupo se muestra si hay al menos un hijo visible
    children: [
      { name: "Clientes", href: "/masters/clients", requiredPermission: Permission.MAE_CLIENTES_VIEW },
      { name: "Productos", href: "/masters/products", requiredPermission: Permission.CAT_PRODUCTOS_VIEW },
      { name: "Categorías", href: "/masters/categories", requiredPermission: Permission.CAT_CATEGORIAS_VIEW },
      { name: "Menú", href: "/masters/menu", requiredPermission: Permission.CAT_MENU_VIEW },
      { name: "Mesas", href: "/masters/tables", requiredPermission: Permission.MAE_MESAS_VIEW },
      { name: "Bodegas", href: "/masters/warehouses", requiredPermission: Permission.MAE_BODEGAS_VIEW },
      { name: "Cajas", href: "/masters/cashboxes", requiredPermission: Permission.MAE_CAJAS_VIEW },
      { name: "Terceros / Proveedores", href: "/masters/third-parties", requiredPermission: Permission.MAE_PROVEEDORES_VIEW },
    ],
  },

  // Inventario
  {
    name: "Inventario",
    href: "/inventory/stock",
    icon: Package,
    hasDropdown: true,
    children: [
      { name: "Stock", href: "/inventory/stock", requiredPermission: Permission.INV_VIEW },
      { name: "Movimientos", href: "/inventory/movements", requiredPermission: Permission.INV_VIEW_MOVIMIENTOS },
    ],
  },

  // Operación (antes Movimientos) – páginas planas
  {
    name: "Operación",
    href: "/operation/pos",
    icon: RefreshCw,
    hasDropdown: true,
    children: [
      { name: "POS / Ventas", href: "/operation/pos", requiredPermission: Permission.VENTA_VIEW },
      { name: "Cocina", href: "/operation/kitchen", requiredPermission: Permission.VENTA_VIEW_KITCHEN },
      { name: "Barra", href: "/operation/bar", requiredPermission: Permission.VENTA_VIEW_BAR },
      { name: "Caja", href: "/operation/cashbox", requiredPermission: Permission.FIN_CAJA_VIEW },
      { name: "Sesiones de caja", href: "/operation/cashbox-sessions", requiredPermission: Permission.CAJA_VIEW_SESIONES },
      { name: "Movimientos de caja", href: "/operation/cashbox-movements", requiredPermission: Permission.CAJA_VIEW_MOVIMIENTOS },
      { name: "Facturación", href: "/operation/invoices", requiredPermission: Permission.FAC_VIEW },
      { name: "Gastos", href: "/operation/expenses", requiredPermission: Permission.FIN_GASTOS_VIEW },
      { name: "Notas crédito / débito", href: "/operation/notes", requiredPermission: Permission.FIN_CREDIT_NOTES_VIEW },
    ],
  },

  // Administración
  {
    name: "Administración",
    href: "/administration/settings",
    icon: Building2,
    hasDropdown: true,
    children: [
      { name: "Configuración", href: "/administration/settings", requiredPermission: Permission.ADM_SETTINGS_VIEW },
      { name: "Empresa", href: "/administration/company", requiredPermission: Permission.ADM_EMPRESA_VIEW },
      { name: "Locales", href: "/administration/locations", requiredPermission: Permission.ADM_LOCALES_VIEW },
      { name: "Anulaciones", href: "/administration/cancellations", requiredPermission: Permission.ADM_ANULACIONES_VIEW },
    ],
  },

  // Seguridad
  {
    name: "Seguridad",
    href: "/security/users",
    icon: Shield,
    hasDropdown: true,
    children: [
      { name: "Usuarios", href: "/security/users", requiredPermission: Permission.SEG_USUARIOS_VIEW },
      { name: "Roles", href: "/security/roles", requiredPermission: Permission.SEG_ROLES_VIEW },
      { name: "Auditoría", href: "/security/audit", requiredPermission: Permission.SEG_AUDIT_VIEW },
      { name: "Cambiar contraseña", href: "/security/change-password", requiredPermission: Permission.SEG_CHANGE_PASSWORD },
    ],
  },
]

export default navigationItems
