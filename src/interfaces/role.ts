export const UserRole = {
  ADMIN: "ADMIN",
  MANAGER: "MANAGER",
  CASHIER: "CASHIER",
  WAITER: "WAITER",
  KITCHEN: "KITCHEN",
  BAR: "BAR",
} as const;

export type UserRole = (typeof UserRole)[keyof typeof UserRole];

export const Permission = {
  // === DASHBOARD ===
  VIEW_DASHBOARD: "VIEW_DASHBOARD",

  // === MOVIMIENTOS / VENTAS ===
  VENTA_VIEW: "VENTA_VIEW", // POS
  VENTA_VIEW_KITCHEN: "VENTA_VIEW_KITCHEN", // Cocina
  VENTA_VIEW_BAR: "VENTA_VIEW_BAR", // Barra

  // === FACTURACIÓN ===
  FAC_VIEW: "FAC_VIEW",
  FAC_EDIT: "FAC_EDIT",

  // === FINANZAS ===
  FIN_CREDIT_NOTES_VIEW: "FIN_CREDIT_NOTES_VIEW", // Notas
  FIN_GASTOS_VIEW: "FIN_GASTOS_VIEW", // Gastos
  FIN_CAJA_VIEW: "FIN_CAJA_VIEW", // Caja
  CAJA_VIEW_SESIONES: "CAJA_VIEW_SESIONES", // Apertura/Cierre
  CAJA_VIEW_MOVIMIENTOS: "CAJA_VIEW_MOVIMIENTOS", // Movimientos de Caja

  // === INVENTARIO ===
  INV_VIEW: "INV_VIEW", // Stock
  INV_VIEW_MOVIMIENTOS: "INV_VIEW_MOVIMIENTOS", // Movimientos
  INV_UPDATE: "INV_UPDATE", // Editar inventario
  INV_AJUSTAR: "INV_AJUSTAR", // Ajustes
  INV_TRANSFERIR: "INV_TRANSFERIR", // Transferencias
  INV_IMPORT: "INV_IMPORT", // Importar
  INV_EXPORT: "INV_EXPORT", // Exportar

  // === CATÁLOGO ===
  CAT_PRODUCTOS_VIEW: "CAT_PRODUCTOS_VIEW", // Productos
  CAT_CATEGORIAS_VIEW: "CAT_CATEGORIAS_VIEW", // Categorías
  CAT_MENU_VIEW: "CAT_MENU_VIEW", // Menú
  CAT_CATEGORIAS_CREATE: "CAT_CATEGORIAS_CREATE", // Crear categorías
  CAT_CATEGORIAS_UPDATE: "CAT_CATEGORIAS_UPDATE", // Editar categorías
  CAT_CATEGORIAS_DELETE: "CAT_CATEGORIAS_DELETE", // Eliminar categorías

  // === MAESTROS ===
  MAE_CLIENTES_VIEW: "MAE_CLIENTES_VIEW", // Clientes
  MAE_CLIENTES_CREATE: "MAE_CLIENTES_CREATE", // Crear clientes
  MAE_CLIENTES_UPDATE: "MAE_CLIENTES_UPDATE", // Editar clientes
  MAE_CLIENTES_DELETE: "MAE_CLIENTES_DELETE", // Eliminar clientes
  MAE_PROVEEDORES_VIEW: "MAE_PROVEEDORES_VIEW", // Terceros
  MAE_MESAS_VIEW: "MAE_MESAS_VIEW", // Mesas
  MAE_MESAS_CREATE: "MAE_MESAS_CREATE", // Crear mesas
  MAE_MESAS_UPDATE: "MAE_MESAS_UPDATE", // Editar mesas
  MAE_BODEGAS_VIEW: "MAE_BODEGAS_VIEW", // Bodegas
  MAE_CAJAS_VIEW: "MAE_CAJAS_VIEW", // Cajas
  MAE_CAJAS_CREATE: "MAE_CAJAS_CREATE", // Crear cajas
  MAE_CAJAS_UPDATE: "MAE_CAJAS_UPDATE", // Editar cajas

  // === ADMINISTRACIÓN ===
  ADM_EMPRESA_VIEW: "ADM_EMPRESA_VIEW", // Empresa
  ADM_LOCALES_VIEW: "ADM_LOCALES_VIEW", // Locales
  ADM_SETTINGS_VIEW: "ADM_SETTINGS_VIEW", // Configuración
  ADM_ANULACIONES_VIEW: "ADM_ANULACIONES_VIEW", // Anulaciones

  // === SEGURIDAD ===
  SEG_USUARIOS_VIEW: "SEG_USUARIOS_VIEW", // Usuarios
  SEG_ROLES_VIEW: "SEG_ROLES_VIEW", // Roles
  SEG_AUDIT_VIEW: "SEG_AUDIT_VIEW", // Auditoría
  SEG_CHANGE_PASSWORD: "SEG_CHANGE_PASSWORD", // Cambiar Contraseña
  
  // === LEGACY (compatibilidad temporal) ===
  ADJUST_INVENTORY: "INV_AJUSTAR",
  TRANSFER_INVENTORY: "INV_TRANSFERIR",
  IMPORT_INVENTORY: "INV_IMPORT",
  EXPORT_INVENTORY: "INV_EXPORT",
  UPDATE_INVENTORY: "INV_UPDATE",
  CREATE_INVENTORY: "INV_UPDATE",
  CREATE_CATEGORIES: "CAT_CATEGORIAS_CREATE",
  UPDATE_CATEGORIES: "CAT_CATEGORIAS_UPDATE",
  DELETE_CATEGORIES: "CAT_CATEGORIAS_DELETE",
  CREATE_CLIENTS: "MAE_CLIENTES_CREATE",
  UPDATE_CLIENTS: "MAE_CLIENTES_UPDATE",
  DELETE_CLIENTS: "MAE_CLIENTES_DELETE",
  CREATE_TABLES: "MAE_MESAS_CREATE",
  UPDATE_TABLES: "MAE_MESAS_UPDATE",
  CREATE_CASHBOXES: "MAE_CAJAS_CREATE",
  UPDATE_CASHBOXES: "MAE_CAJAS_UPDATE",
  VIEW_CASHBOXES: "MAE_CAJAS_VIEW",
  VIEW_REPORTS: "VIEW_DASHBOARD",
} as const;

export type Permission = (typeof Permission)[keyof typeof Permission];

export interface RolePermissions {
  role: UserRole;
  permissions: Permission[];
}

export const rolePermissionsConfig: RolePermissions[] = [
  {
    role: UserRole.ADMIN,
    permissions: Object.values(Permission),
  },
  {
    role: UserRole.MANAGER,
    permissions: [
      Permission.VIEW_DASHBOARD,
      Permission.VENTA_VIEW,
      Permission.VENTA_VIEW_KITCHEN,
      Permission.VENTA_VIEW_BAR,
      Permission.FAC_VIEW,
      Permission.FAC_EDIT,
      Permission.FIN_CREDIT_NOTES_VIEW,
      Permission.FIN_GASTOS_VIEW,
      Permission.FIN_CAJA_VIEW,
      Permission.CAJA_VIEW_SESIONES,
      Permission.CAJA_VIEW_MOVIMIENTOS,
      Permission.INV_VIEW,
      Permission.INV_VIEW_MOVIMIENTOS,
      Permission.INV_UPDATE,
      Permission.INV_AJUSTAR,
      Permission.INV_TRANSFERIR,
      Permission.INV_IMPORT,
      Permission.INV_EXPORT,
      Permission.CAT_PRODUCTOS_VIEW,
      Permission.CAT_CATEGORIAS_VIEW,
      Permission.CAT_CATEGORIAS_CREATE,
      Permission.CAT_CATEGORIAS_UPDATE,
      Permission.CAT_CATEGORIAS_DELETE,
      Permission.CAT_MENU_VIEW,
      Permission.MAE_CLIENTES_VIEW,
      Permission.MAE_CLIENTES_CREATE,
      Permission.MAE_CLIENTES_UPDATE,
      Permission.MAE_CLIENTES_DELETE,
      Permission.MAE_PROVEEDORES_VIEW,
      Permission.MAE_MESAS_VIEW,
      Permission.MAE_MESAS_CREATE,
      Permission.MAE_MESAS_UPDATE,
      Permission.MAE_BODEGAS_VIEW,
      Permission.MAE_CAJAS_VIEW,
      Permission.MAE_CAJAS_CREATE,
      Permission.MAE_CAJAS_UPDATE,
      Permission.ADM_EMPRESA_VIEW,
      Permission.ADM_LOCALES_VIEW,
      Permission.ADM_SETTINGS_VIEW,
      Permission.ADM_ANULACIONES_VIEW,
      Permission.SEG_USUARIOS_VIEW,
      Permission.SEG_ROLES_VIEW,
      Permission.SEG_AUDIT_VIEW,
      Permission.SEG_CHANGE_PASSWORD,
    ],
  },
  {
    role: UserRole.CASHIER,
    permissions: [
      Permission.VIEW_DASHBOARD,
      Permission.VENTA_VIEW,
      Permission.FAC_VIEW,
      Permission.FAC_EDIT,
      Permission.FIN_GASTOS_VIEW,
      Permission.FIN_CAJA_VIEW,
      Permission.CAJA_VIEW_SESIONES,
      Permission.CAJA_VIEW_MOVIMIENTOS,
      Permission.INV_VIEW,
      Permission.INV_VIEW_MOVIMIENTOS,
      Permission.CAT_PRODUCTOS_VIEW,
      Permission.CAT_CATEGORIAS_VIEW,
      Permission.CAT_MENU_VIEW,
      Permission.MAE_CLIENTES_VIEW,
      Permission.MAE_CLIENTES_CREATE,
      Permission.MAE_MESAS_VIEW,
      Permission.MAE_MESAS_UPDATE,
      Permission.MAE_CAJAS_VIEW,
      Permission.SEG_CHANGE_PASSWORD,
    ],
  },
  {
    role: UserRole.WAITER,
    permissions: [
      Permission.VENTA_VIEW,
      Permission.CAT_MENU_VIEW,
      Permission.MAE_CLIENTES_VIEW,
      Permission.MAE_MESAS_VIEW,
      Permission.SEG_CHANGE_PASSWORD,
    ],
  },
  {
    role: UserRole.KITCHEN,
    permissions: [
      Permission.VENTA_VIEW,
      Permission.VENTA_VIEW_KITCHEN,
      Permission.CAT_MENU_VIEW,
      Permission.INV_VIEW,
      Permission.SEG_CHANGE_PASSWORD,
    ],
  },
  {
    role: UserRole.BAR,
    permissions: [
      Permission.VENTA_VIEW,
      Permission.VENTA_VIEW_BAR,
      Permission.CAT_MENU_VIEW,
      Permission.INV_VIEW,
      Permission.SEG_CHANGE_PASSWORD,
    ],
  },
];
