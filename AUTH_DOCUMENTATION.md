# Sistema de Autenticación y Permisos - FoodBill

## 🔐 Credenciales de Acceso

### Usuario Administrador
- **Usuario:** `admin`
- **Contraseña:** `1234`
- **Rol:** ADMIN
- **Permisos:** Acceso total a todas las funcionalidades

## 📋 Roles y Permisos del Sistema

### 1. ADMIN (Administrador)
**Acceso Completo** - Todos los permisos del sistema
- ✅ Dashboard y Analíticas
- ✅ Órdenes (Ver, Crear, Actualizar, Eliminar)
- ✅ Menú (Ver, Crear, Actualizar, Eliminar)
- ✅ Inventario (Ver, Crear, Actualizar, Eliminar)
- ✅ Reseñas (Ver, Responder, Eliminar)
- ✅ Calendario (Ver, Crear, Actualizar, Eliminar)
- ✅ Usuarios (Ver, Crear, Actualizar, Eliminar)
- ✅ Configuración (Ver, Actualizar)
- ✅ Reportes (Ver, Exportar)

### 2. MANAGER (Gerente)
**Gestión Operativa**
- ✅ Dashboard y Analíticas
- ✅ Órdenes (Ver, Crear, Actualizar)
- ✅ Menú (Ver, Crear, Actualizar, Eliminar)
- ✅ Inventario (Ver, Actualizar)
- ✅ Reseñas (Ver, Responder)
- ✅ Calendario (Ver, Crear, Actualizar)
- ✅ Reportes (Ver, Exportar)
- ✅ Configuración (Ver)
- ❌ Usuarios (Sin acceso)
- ❌ Eliminar Órdenes

### 3. CASHIER (Cajero)
**Punto de Venta**
- ✅ Dashboard
- ✅ Órdenes (Ver, Crear, Actualizar)
- ✅ Menú (Solo Ver)
- ✅ Inventario (Solo Ver)
- ✅ Reseñas (Solo Ver)
- ❌ Calendario
- ❌ Usuarios
- ❌ Configuración
- ❌ Reportes

### 4. WAITER (Mesero)
**Servicio al Cliente**
- ✅ Órdenes (Ver, Crear, Actualizar)
- ✅ Menú (Solo Ver)
- ✅ Calendario (Solo Ver)
- ❌ Dashboard
- ❌ Inventario
- ❌ Reseñas
- ❌ Usuarios
- ❌ Configuración
- ❌ Reportes

### 5. KITCHEN (Cocina)
**Preparación de Alimentos**
- ✅ Órdenes (Ver, Actualizar)
- ✅ Menú (Solo Ver)
- ✅ Inventario (Solo Ver)
- ❌ Dashboard
- ❌ Calendario
- ❌ Reseñas
- ❌ Usuarios
- ❌ Configuración
- ❌ Reportes

### 6. BAR (Bar)
**Preparación de Bebidas**
- ✅ Órdenes (Ver, Actualizar)
- ✅ Menú (Solo Ver)
- ✅ Inventario (Solo Ver)
- ❌ Dashboard
- ❌ Calendario
- ❌ Reseñas
- ❌ Usuarios
- ❌ Configuración
- ❌ Reportes

## 🛡️ Protección de Rutas

### Rutas Públicas (Sin Autenticación)
- `/login` - Página de inicio de sesión
- `/register` - Página de registro
- `/forgot-password` - Recuperación de contraseña
- `/not-found` - Página 404

### Rutas Privadas (Requieren Autenticación)
Todas las rutas bajo `/` requieren estar autenticado y además verifican permisos específicos:

| Ruta | Permiso Requerido | Descripción |
|------|-------------------|-------------|
| `/home` | VIEW_DASHBOARD | Panel principal con métricas |
| `/orders` | VIEW_ORDERS | Gestión de pedidos |
| `/calendar` | VIEW_CALENDAR | Calendario de eventos |
| `/menu` | VIEW_MENU | Gestión del menú |
| `/inventory` | VIEW_INVENTORY | Control de inventario |
| `/reviews` | VIEW_REVIEWS | Gestión de reseñas |

## 🔧 Componentes de Protección

### 1. `<PrivateRoute>`
Protege rutas que requieren autenticación. Redirige a `/login` si no está autenticado.

```tsx
<PrivateRoute>
  <HomePage />
</PrivateRoute>
```

### 2. `<PermissionRoute>`
Protege rutas basándose en permisos específicos.

```tsx
<PermissionRoute requiredPermission={Permission.VIEW_DASHBOARD}>
  <HomePage />
</PermissionRoute>
```

### 3. `<RoleRoute>`
Protege rutas basándose en roles de usuario.

```tsx
<RoleRoute allowedRoles={[UserRole.ADMIN, UserRole.MANAGER]}>
  <AdminPanel />
</RoleRoute>
```

### 4. `<Can>` Component
Muestra u oculta elementos de UI basándose en permisos.

```tsx
<Can permission={Permission.DELETE_ORDERS}>
  <Button>Eliminar Pedido</Button>
</Can>
```

## 📦 Hooks Disponibles

### `usePermissions()`
Hook para verificar permisos en componentes.

```tsx
const { hasPermission, hasAnyPermission, hasAllPermissions } = usePermissions();

// Verificar un permiso
if (hasPermission(Permission.VIEW_DASHBOARD)) {
  // Mostrar dashboard
}

// Verificar al menos uno de varios permisos
if (hasAnyPermission([Permission.CREATE_ORDERS, Permission.UPDATE_ORDERS])) {
  // Permitir editar pedidos
}

// Verificar que tenga todos los permisos
if (hasAllPermissions([Permission.VIEW_REPORTS, Permission.EXPORT_REPORTS])) {
  // Mostrar botón de exportar
}
```

### `useLogin()`
Hook para manejar el proceso de autenticación.

```tsx
const { loginUser, loading, error } = useLogin();

const handleSubmit = async (credentials) => {
  const result = await loginUser(credentials);
  if (result.success) {
    navigate('/home');
  }
};
```

## 🔄 Flujo de Autenticación

1. **Usuario ingresa credenciales** en `/login`
2. **Se valida** contra `AuthService.login()`
3. **Si es válido:**
   - Se guarda el usuario en `authStore` (Zustand)
   - Se persiste en `sessionStorage`
   - Se redirige a `/home`
4. **Al navegar:**
   - `<PrivateRoute>` verifica autenticación
   - `<PermissionRoute>` verifica permisos específicos
   - El Sidebar filtra opciones según permisos
5. **Al cerrar sesión:**
   - Se limpia `authStore`
   - Se elimina de `sessionStorage`
   - Se redirige a `/login`

## 📝 Archivos Principales

### Interfaces y Tipos
- `/src/interfaces/role.ts` - Definición de roles y permisos
- `/src/interfaces/user.ts` - Interfaz de usuario

### Servicios
- `/src/services/authService.ts` - Lógica de autenticación

### Stores
- `/src/store/authStore.ts` - Estado de autenticación (Zustand)

### Hooks
- `/src/hooks/usePermissions.ts` - Verificación de permisos
- `/src/pages/public/login/hooks/useLogin.ts` - Lógica de login

### Componentes de Protección
- `/src/routes/validateRoutes/PrivateRoute.tsx` - Protección básica
- `/src/routes/validateRoutes/PermissionRoute.tsx` - Protección por permisos
- `/src/routes/validateRoutes/RoleRoute.tsx` - Protección por roles
- `/src/components/Can.tsx` - Componente condicional por permisos

### Configuración de Rutas
- `/src/routes/AppRoutes.tsx` - Definición de todas las rutas

## 🚀 Próximos Pasos

Para agregar nuevos usuarios o cambiar credenciales:
1. Edita `/src/services/authService.ts`
2. Agrega más usuarios mock o integra con API real
3. Los roles y permisos se gestionan en `/src/interfaces/role.ts`

## ⚠️ Notas Importantes

- **Seguridad:** Actualmente usa autenticación mock. En producción, integrar con API backend real.
- **Tokens:** Los tokens deben validarse en cada petición al backend.
- **Persistencia:** Usa `sessionStorage` por defecto. Cambiar a `localStorage` para sesiones persistentes.
- **Permisos:** Los permisos se verifican en frontend, pero deben validarse también en backend.
