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
  // Dashboard y Analytics
  VIEW_DASHBOARD: "VIEW_DASHBOARD",
  VIEW_ANALYTICS: "VIEW_ANALYTICS",

  // === VENTAS (dbo.ventas, dbo.detalles_venta) ===
  VENTA_VIEW: "VENTA_VIEW",
  VENTA_FLUJO: "VENTA_FLUJO", // Crear/gestionar pedidos (flujo operativo)
  VENTA_FACTURAR: "VENTA_FACTURAR", // Emitir facturas
  VENTA_UPDATE: "VENTA_UPDATE",
  VENTA_DELETE: "VENTA_DELETE",
  VENTA_ANULAR: "VENTA_ANULAR", // Anulaciones
  VENTA_VIEW_KITCHEN: "VENTA_VIEW_KITCHEN", // Pantalla cocina
  VENTA_VIEW_BAR: "VENTA_VIEW_BAR", // Pantalla bar

  // === PAGOS (dbo.pagos) ===
  PAGO_VIEW: "PAGO_VIEW",
  PAGO_REGISTRAR: "PAGO_REGISTRAR",
  PAGO_UPDATE: "PAGO_UPDATE",
  PAGO_DELETE: "PAGO_DELETE",

  // === CAJA - Sesiones (dbo.movimientos_caja) ===
  CAJA_VIEW_SESIONES: "CAJA_VIEW_SESIONES",
  CAJA_ABRIR_SESION: "CAJA_ABRIR_SESION",
  CAJA_CERRAR_SESION: "CAJA_CERRAR_SESION",
  CAJA_VIEW_MOVIMIENTOS: "CAJA_VIEW_MOVIMIENTOS",
  CAJA_CREATE_MOVIMIENTO: "CAJA_CREATE_MOVIMIENTO",
  CAJA_ARQUEO: "CAJA_ARQUEO",

  // === FINANZAS ===
  // Gastos (dbo.gastos)
  FIN_GASTOS_VIEW: "FIN_GASTOS_VIEW",
  FIN_GASTOS_CREATE: "FIN_GASTOS_CREATE",
  FIN_GASTOS_UPDATE: "FIN_GASTOS_UPDATE",
  FIN_GASTOS_DELETE: "FIN_GASTOS_DELETE",
  // Cuentas por Cobrar
  FIN_RECEIVABLES_VIEW: "FIN_RECEIVABLES_VIEW",
  FIN_RECEIVABLES_MANAGE: "FIN_RECEIVABLES_MANAGE",
  // Notas de Crédito
  FIN_CREDIT_NOTES_VIEW: "FIN_CREDIT_NOTES_VIEW",
  FIN_CREDIT_NOTES_CREATE: "FIN_CREDIT_NOTES_CREATE",
  // Reportes Financieros
  FIN_VIEW: "FIN_VIEW",
  FIN_EXPORT: "FIN_EXPORT",

  // === INVENTARIO (dbo.inventario, dbo.movimientos_inventario) ===
  INV_VIEW: "INV_VIEW",
  INV_CREATE: "INV_CREATE",
  INV_UPDATE: "INV_UPDATE",
  INV_DELETE: "INV_DELETE",
  INV_AJUSTAR: "INV_AJUSTAR",
  INV_TRANSFERIR: "INV_TRANSFERIR",
  INV_IMPORT: "INV_IMPORT",
  INV_EXPORT: "INV_EXPORT",
  INV_CONTEO: "INV_CONTEO", // Toma física
  INV_VIEW_MOVIMIENTOS: "INV_VIEW_MOVIMIENTOS",

  // === CATÁLOGO ===
  // Productos (dbo.productos)
  CAT_PRODUCTOS_VIEW: "CAT_PRODUCTOS_VIEW",
  CAT_PRODUCTOS_CREATE: "CAT_PRODUCTOS_CREATE",
  CAT_PRODUCTOS_UPDATE: "CAT_PRODUCTOS_UPDATE",
  CAT_PRODUCTOS_DELETE: "CAT_PRODUCTOS_DELETE",
  // Categorías
  CAT_CATEGORIAS_VIEW: "CAT_CATEGORIAS_VIEW",
  CAT_CATEGORIAS_CREATE: "CAT_CATEGORIAS_CREATE",
  CAT_CATEGORIAS_UPDATE: "CAT_CATEGORIAS_UPDATE",
  CAT_CATEGORIAS_DELETE: "CAT_CATEGORIAS_DELETE",
  // Menú
  CAT_MENU_VIEW: "CAT_MENU_VIEW",
  CAT_MENU_CREATE: "CAT_MENU_CREATE",
  CAT_MENU_UPDATE: "CAT_MENU_UPDATE",
  CAT_MENU_DELETE: "CAT_MENU_DELETE",

  // === MAESTROS ===
  // Clientes (dbo.clientes)
  MAE_CLIENTES_VIEW: "MAE_CLIENTES_VIEW",
  MAE_CLIENTES_CREATE: "MAE_CLIENTES_CREATE",
  MAE_CLIENTES_UPDATE: "MAE_CLIENTES_UPDATE",
  MAE_CLIENTES_DELETE: "MAE_CLIENTES_DELETE",
  // Terceros (dbo.tercero - proveedores)
  MAE_PROVEEDORES_VIEW: "MAE_PROVEEDORES_VIEW",
  MAE_PROVEEDORES_CREATE: "MAE_PROVEEDORES_CREATE",
  MAE_PROVEEDORES_UPDATE: "MAE_PROVEEDORES_UPDATE",
  MAE_PROVEEDORES_DELETE: "MAE_PROVEEDORES_DELETE",
  // Mesas (dbo.mesas)
  MAE_MESAS_VIEW: "MAE_MESAS_VIEW",
  MAE_MESAS_CREATE: "MAE_MESAS_CREATE",
  MAE_MESAS_UPDATE: "MAE_MESAS_UPDATE",
  MAE_MESAS_DELETE: "MAE_MESAS_DELETE",
  // Bodegas/Almacenes
  MAE_BODEGAS_VIEW: "MAE_BODEGAS_VIEW",
  MAE_BODEGAS_CREATE: "MAE_BODEGAS_CREATE",
  MAE_BODEGAS_UPDATE: "MAE_BODEGAS_UPDATE",
  MAE_BODEGAS_DELETE: "MAE_BODEGAS_DELETE",
  // Cajas
  MAE_CAJAS_VIEW: "MAE_CAJAS_VIEW",
  MAE_CAJAS_CREATE: "MAE_CAJAS_CREATE",
  MAE_CAJAS_UPDATE: "MAE_CAJAS_UPDATE",
  MAE_CAJAS_DELETE: "MAE_CAJAS_DELETE",

  // === ADMINISTRACIÓN ===
  // Empresa (dbo.Company)
  ADM_EMPRESA_VIEW: "ADM_EMPRESA_VIEW",
  ADM_EMPRESA_UPDATE: "ADM_EMPRESA_UPDATE",
  // Locales (dbo.locales)
  ADM_LOCALES_VIEW: "ADM_LOCALES_VIEW",
  ADM_LOCALES_CREATE: "ADM_LOCALES_CREATE",
  ADM_LOCALES_UPDATE: "ADM_LOCALES_UPDATE",
  ADM_LOCALES_DELETE: "ADM_LOCALES_DELETE",
  // Configuración general
  ADM_SETTINGS_VIEW: "ADM_SETTINGS_VIEW",
  ADM_SETTINGS_UPDATE: "ADM_SETTINGS_UPDATE",

  // === SEGURIDAD ===
  // Usuarios (dbo.usuarios)
  SEG_USUARIOS_VIEW: "SEG_USUARIOS_VIEW",
  SEG_USUARIOS_CREATE: "SEG_USUARIOS_CREATE",
  SEG_USUARIOS_UPDATE: "SEG_USUARIOS_UPDATE",
  SEG_USUARIOS_DELETE: "SEG_USUARIOS_DELETE",
  // Roles (dbo.roles)
  SEG_ROLES_VIEW: "SEG_ROLES_VIEW",
  SEG_ROLES_MANAGE: "SEG_ROLES_MANAGE",
  // Auditoría
  SEG_AUDIT_VIEW: "SEG_AUDIT_VIEW",
  SEG_AUDIT_EXPORT: "SEG_AUDIT_EXPORT",
  // Cambio contraseña
  SEG_CHANGE_PASSWORD: "SEG_CHANGE_PASSWORD",

  // === REPORTES ===
  REP_VENTAS: "REP_VENTAS",
  REP_INVENTARIO: "REP_INVENTARIO",
  REP_CAJA: "REP_CAJA",
  REP_GASTOS: "REP_GASTOS",
  REP_RECEIVABLES: "REP_RECEIVABLES",
  REP_EXPORT: "REP_EXPORT",

  // === HERRAMIENTAS ===
  TOOL_IMPORT: "TOOL_IMPORT",
  TOOL_EXPORT: "TOOL_EXPORT",
  TOOL_BACKUP: "TOOL_BACKUP",

  // Legacy (mantener compatibilidad)
  VIEW_ORDERS: "VIEW_ORDERS",
  CREATE_ORDERS: "CREATE_ORDERS",
  UPDATE_ORDERS: "UPDATE_ORDERS",
  DELETE_ORDERS: "DELETE_ORDERS",
  VIEW_MENU: "VIEW_MENU",
  CREATE_MENU: "CREATE_MENU",
  UPDATE_MENU: "UPDATE_MENU",
  DELETE_MENU: "DELETE_MENU",
  VIEW_INVENTORY: "VIEW_INVENTORY",
  CREATE_INVENTORY: "CREATE_INVENTORY",
  UPDATE_INVENTORY: "UPDATE_INVENTORY",
  DELETE_INVENTORY: "DELETE_INVENTORY",
  ADJUST_INVENTORY: "ADJUST_INVENTORY",
  TRANSFER_INVENTORY: "TRANSFER_INVENTORY",
  IMPORT_INVENTORY: "IMPORT_INVENTORY",
  EXPORT_INVENTORY: "EXPORT_INVENTORY",
  VIEW_PRODUCTS: "VIEW_PRODUCTS",
  CREATE_PRODUCTS: "CREATE_PRODUCTS",
  UPDATE_PRODUCTS: "UPDATE_PRODUCTS",
  DELETE_PRODUCTS: "DELETE_PRODUCTS",
  VIEW_CATEGORIES: "VIEW_CATEGORIES",
  CREATE_CATEGORIES: "CREATE_CATEGORIES",
  UPDATE_CATEGORIES: "UPDATE_CATEGORIES",
  DELETE_CATEGORIES: "DELETE_CATEGORIES",
  VIEW_CLIENTS: "VIEW_CLIENTS",
  CREATE_CLIENTS: "CREATE_CLIENTS",
  UPDATE_CLIENTS: "UPDATE_CLIENTS",
  DELETE_CLIENTS: "DELETE_CLIENTS",
  VIEW_REVIEWS: "VIEW_REVIEWS",
  RESPOND_REVIEWS: "RESPOND_REVIEWS",
  DELETE_REVIEWS: "DELETE_REVIEWS",
  VIEW_CALENDAR: "VIEW_CALENDAR",
  CREATE_EVENTS: "CREATE_EVENTS",
  UPDATE_EVENTS: "UPDATE_EVENTS",
  DELETE_EVENTS: "DELETE_EVENTS",
  VIEW_USERS: "VIEW_USERS",
  CREATE_USERS: "CREATE_USERS",
  UPDATE_USERS: "UPDATE_USERS",
  DELETE_USERS: "DELETE_USERS",
  VIEW_SETTINGS: "VIEW_SETTINGS",
  UPDATE_SETTINGS: "UPDATE_SETTINGS",
  VIEW_REPORTS: "VIEW_REPORTS",
  EXPORT_REPORTS: "EXPORT_REPORTS",
  VIEW_CASHBOXES: "VIEW_CASHBOXES",
  CREATE_CASHBOXES: "CREATE_CASHBOXES",
  UPDATE_CASHBOXES: "UPDATE_CASHBOXES",
  DELETE_CASHBOXES: "DELETE_CASHBOXES",
  VIEW_TABLES: "VIEW_TABLES",
  CREATE_TABLES: "CREATE_TABLES",
  UPDATE_TABLES: "UPDATE_TABLES",
  DELETE_TABLES: "DELETE_TABLES",
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
      // Dashboard
      Permission.VIEW_DASHBOARD,
      Permission.VIEW_ANALYTICS,
      
      // Ventas
      Permission.VENTA_VIEW,
      Permission.VENTA_FLUJO,
      Permission.VENTA_FACTURAR,
      Permission.VENTA_UPDATE,
      Permission.VENTA_ANULAR,
      
      // Pagos
      Permission.PAGO_VIEW,
      Permission.PAGO_REGISTRAR,
      Permission.PAGO_UPDATE,
      
      // Caja
      Permission.CAJA_VIEW_SESIONES,
      Permission.CAJA_ABRIR_SESION,
      Permission.CAJA_CERRAR_SESION,
      Permission.CAJA_VIEW_MOVIMIENTOS,
      Permission.CAJA_CREATE_MOVIMIENTO,
      Permission.CAJA_ARQUEO,
      
      // Finanzas
      Permission.FIN_GASTOS_VIEW,
      Permission.FIN_GASTOS_CREATE,
      Permission.FIN_GASTOS_UPDATE,
      Permission.FIN_GASTOS_DELETE,
      Permission.FIN_RECEIVABLES_VIEW,
      Permission.FIN_RECEIVABLES_MANAGE,
      Permission.FIN_CREDIT_NOTES_VIEW,
      Permission.FIN_CREDIT_NOTES_CREATE,
      Permission.FIN_VIEW,
      Permission.FIN_EXPORT,
      
      // Inventario
      Permission.INV_VIEW,
      Permission.INV_UPDATE,
      Permission.INV_AJUSTAR,
      Permission.INV_TRANSFERIR,
      Permission.INV_IMPORT,
      Permission.INV_EXPORT,
      Permission.INV_CONTEO,
      Permission.INV_VIEW_MOVIMIENTOS,
      
      // Catálogo
      Permission.CAT_PRODUCTOS_VIEW,
      Permission.CAT_PRODUCTOS_CREATE,
      Permission.CAT_PRODUCTOS_UPDATE,
      Permission.CAT_CATEGORIAS_VIEW,
      Permission.CAT_CATEGORIAS_CREATE,
      Permission.CAT_CATEGORIAS_UPDATE,
      Permission.CAT_CATEGORIAS_DELETE,
      Permission.CAT_MENU_VIEW,
      Permission.CAT_MENU_CREATE,
      Permission.CAT_MENU_UPDATE,
      Permission.CAT_MENU_DELETE,
      
      // Maestros
      Permission.MAE_CLIENTES_VIEW,
      Permission.MAE_CLIENTES_CREATE,
      Permission.MAE_CLIENTES_UPDATE,
      Permission.MAE_CLIENTES_DELETE,
      Permission.MAE_PROVEEDORES_VIEW,
      Permission.MAE_PROVEEDORES_CREATE,
      Permission.MAE_PROVEEDORES_UPDATE,
      Permission.MAE_MESAS_VIEW,
      Permission.MAE_MESAS_CREATE,
      Permission.MAE_MESAS_UPDATE,
      Permission.MAE_BODEGAS_VIEW,
      Permission.MAE_BODEGAS_CREATE,
      Permission.MAE_BODEGAS_UPDATE,
      Permission.MAE_CAJAS_VIEW,
      Permission.MAE_CAJAS_CREATE,
      Permission.MAE_CAJAS_UPDATE,
      
      // Administración
      Permission.ADM_EMPRESA_VIEW,
      Permission.ADM_LOCALES_VIEW,
      Permission.ADM_SETTINGS_VIEW,
      Permission.ADM_SETTINGS_UPDATE,
      
      // Seguridad
      Permission.SEG_USUARIOS_VIEW,
      Permission.SEG_ROLES_VIEW,
      Permission.SEG_CHANGE_PASSWORD,
      
      // Reportes
      Permission.REP_VENTAS,
      Permission.REP_INVENTARIO,
      Permission.REP_CAJA,
      Permission.REP_GASTOS,
      Permission.REP_RECEIVABLES,
      Permission.REP_EXPORT,
      
      // Legacy
      Permission.VIEW_ORDERS,
      Permission.CREATE_ORDERS,
      Permission.UPDATE_ORDERS,
      Permission.VIEW_MENU,
      Permission.VIEW_INVENTORY,
      Permission.VIEW_PRODUCTS,
      Permission.VIEW_CATEGORIES,
      Permission.VIEW_CLIENTS,
      Permission.VIEW_REVIEWS,
      Permission.RESPOND_REVIEWS,
      Permission.VIEW_CALENDAR,
      Permission.CREATE_EVENTS,
      Permission.UPDATE_EVENTS,
      Permission.VIEW_REPORTS,
      Permission.EXPORT_REPORTS,
      Permission.VIEW_SETTINGS,
      Permission.VIEW_CASHBOXES,
      Permission.VIEW_TABLES,
    ],
  },
  {
    role: UserRole.CASHIER,
    permissions: [
      // Dashboard
      Permission.VIEW_DASHBOARD,
      
      // Ventas
      Permission.VENTA_VIEW,
      Permission.VENTA_FLUJO,
      Permission.VENTA_FACTURAR,
      
      // Pagos
      Permission.PAGO_VIEW,
      Permission.PAGO_REGISTRAR,
      
      // Caja
      Permission.CAJA_VIEW_SESIONES,
      Permission.CAJA_ABRIR_SESION,
      Permission.CAJA_CERRAR_SESION,
      Permission.CAJA_VIEW_MOVIMIENTOS,
      Permission.CAJA_CREATE_MOVIMIENTO,
      Permission.CAJA_ARQUEO,
      
      // Inventario (solo visualización)
      Permission.INV_VIEW,
      Permission.INV_VIEW_MOVIMIENTOS,
      
      // Catálogo
      Permission.CAT_PRODUCTOS_VIEW,
      Permission.CAT_CATEGORIAS_VIEW,
      Permission.CAT_MENU_VIEW,
      
      // Maestros
      Permission.MAE_CLIENTES_VIEW,
      Permission.MAE_CLIENTES_CREATE,
      Permission.MAE_MESAS_VIEW,
      Permission.MAE_MESAS_UPDATE,
      Permission.MAE_CAJAS_VIEW,
      
      // Seguridad
      Permission.SEG_CHANGE_PASSWORD,
      
      // Legacy
      Permission.VIEW_ORDERS,
      Permission.CREATE_ORDERS,
      Permission.UPDATE_ORDERS,
      Permission.VIEW_MENU,
      Permission.VIEW_INVENTORY,
      Permission.VIEW_PRODUCTS,
      Permission.VIEW_CATEGORIES,
      Permission.VIEW_CLIENTS,
      Permission.CREATE_CLIENTS,
      Permission.VIEW_REVIEWS,
      Permission.VIEW_CASHBOXES,
      Permission.VIEW_TABLES,
      Permission.UPDATE_TABLES,
    ],
  },
  {
    role: UserRole.WAITER,
    permissions: [
      // Ventas (solo flujo operativo)
      Permission.VENTA_VIEW,
      Permission.VENTA_FLUJO,
      
      // Catálogo
      Permission.CAT_MENU_VIEW,
      
      // Maestros
      Permission.MAE_CLIENTES_VIEW,
      Permission.MAE_MESAS_VIEW,
      Permission.MAE_MESAS_UPDATE,
      
      // Seguridad
      Permission.SEG_CHANGE_PASSWORD,
      
      // Legacy
      Permission.VIEW_ORDERS,
      Permission.CREATE_ORDERS,
      Permission.UPDATE_ORDERS,
      Permission.VIEW_MENU,
      Permission.VIEW_CALENDAR,
      Permission.VIEW_TABLES,
      Permission.UPDATE_TABLES,
    ],
  },
  {
    role: UserRole.KITCHEN,
    permissions: [
      // Ventas (solo vista cocina)
      Permission.VENTA_VIEW,
      Permission.VENTA_VIEW_KITCHEN,
      Permission.VENTA_UPDATE,
      
      // Catálogo
      Permission.CAT_MENU_VIEW,
      
      // Inventario (solo vista)
      Permission.INV_VIEW,
      
      // Seguridad
      Permission.SEG_CHANGE_PASSWORD,
      
      // Legacy
      Permission.VIEW_ORDERS,
      Permission.UPDATE_ORDERS,
      Permission.VIEW_MENU,
      Permission.VIEW_INVENTORY,
    ],
  },
  {
    role: UserRole.BAR,
    permissions: [
      // Ventas (solo vista bar)
      Permission.VENTA_VIEW,
      Permission.VENTA_VIEW_BAR,
      Permission.VENTA_UPDATE,
      
      // Catálogo
      Permission.CAT_MENU_VIEW,
      
      // Inventario (solo vista)
      Permission.INV_VIEW,
      
      // Seguridad
      Permission.SEG_CHANGE_PASSWORD,
      
      // Legacy
      Permission.VIEW_ORDERS,
      Permission.UPDATE_ORDERS,
      Permission.VIEW_MENU,
      Permission.VIEW_INVENTORY,
    ],
  },
];
