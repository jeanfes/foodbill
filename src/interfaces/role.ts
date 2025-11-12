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
  VIEW_DASHBOARD: "VIEW_DASHBOARD",
  VIEW_ANALYTICS: "VIEW_ANALYTICS",
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
  VIEW_PRODUCTS: "VIEW_PRODUCTS",
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
      Permission.VIEW_ANALYTICS,
      Permission.VIEW_ORDERS,
      Permission.CREATE_ORDERS,
      Permission.UPDATE_ORDERS,
      Permission.VIEW_MENU,
      Permission.CREATE_MENU,
      Permission.UPDATE_MENU,
      Permission.DELETE_MENU,
      Permission.VIEW_INVENTORY,
      Permission.UPDATE_INVENTORY,
      Permission.VIEW_PRODUCTS,
      // Clients
      Permission.VIEW_CLIENTS,
      Permission.CREATE_CLIENTS,
      Permission.UPDATE_CLIENTS,
      Permission.DELETE_CLIENTS,
      Permission.VIEW_REVIEWS,
      Permission.RESPOND_REVIEWS,
      Permission.VIEW_CALENDAR,
      Permission.CREATE_EVENTS,
      Permission.UPDATE_EVENTS,
      Permission.VIEW_REPORTS,
      Permission.EXPORT_REPORTS,
      Permission.VIEW_SETTINGS,
    ],
  },
  {
    role: UserRole.CASHIER,
    permissions: [
      Permission.VIEW_DASHBOARD,
      Permission.VIEW_ORDERS,
      Permission.CREATE_ORDERS,
      Permission.UPDATE_ORDERS,
      Permission.VIEW_MENU,
      Permission.VIEW_INVENTORY,
      Permission.VIEW_PRODUCTS,
      // Clients
      Permission.VIEW_CLIENTS,
      Permission.CREATE_CLIENTS,
      Permission.VIEW_REVIEWS,
    ],
  },
  {
    role: UserRole.WAITER,
    permissions: [
      Permission.VIEW_ORDERS,
      Permission.CREATE_ORDERS,
      Permission.UPDATE_ORDERS,
      Permission.VIEW_MENU,
      Permission.VIEW_CALENDAR,
    ],
  },
  {
    role: UserRole.KITCHEN,
    permissions: [
      Permission.VIEW_ORDERS,
      Permission.UPDATE_ORDERS,
      Permission.VIEW_MENU,
      Permission.VIEW_INVENTORY,
    ],
  },
  {
    role: UserRole.BAR,
    permissions: [
      Permission.VIEW_ORDERS,
      Permission.UPDATE_ORDERS,
      Permission.VIEW_MENU,
      Permission.VIEW_INVENTORY,
    ],
  },
]
