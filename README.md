# FoodBill – Estructura de Navegación

- Prefijo de Operación: todas las páginas de operación viven bajo `/operacion/*` (antes `/movimientos/*`).
  - `/operacion/pos`, `/operacion/cocina`, `/operacion/barra`, `/operacion/caja`, `/operacion/caja-sesiones`, `/operacion/caja-movimientos`, `/operacion/facturacion`, `/operacion/gastos`, `/operacion/notas`.
- Inventario: `/inventario/stock`, `/inventario/movimientos`.
- Maestros: `/maestros/productos`, `/maestros/categorias`, `/maestros/menu`, `/maestros/clientes`, `/maestros/terceros`, `/maestros/mesas`, `/maestros/bodegas`, `/maestros/cajas`.
- Administración: `/administracion/configuracion`, `/administracion/empresa`, `/administracion/locales`, `/administracion/anulaciones`.
- Seguridad: `/seguridad/usuarios`, `/seguridad/roles`, `/seguridad/auditoria`, `/seguridad/cambiar-contrasena`.

Notas:
- El sidebar se alimenta desde `src/layouts/fullLayout/components/sidebar/navigation.ts`.
- Los grupos no requieren permiso “padre”; se muestran si al menos uno de sus hijos tiene permiso.
- Las rutas seguirán actualizándose de `/movimientos/*` a `/operacion/*` cuando corresponda.

## Mapeo antiguo → nuevo (para futuras rutas)
- `/movimientos/pos` → `/operacion/pos`
- `/movimientos/cocina` → `/operacion/cocina`
- `/movimientos/bar` → `/operacion/barra`
- `/movimientos/caja` → `/operacion/caja`
- `/movimientos/caja/apertura-cierre` → `/operacion/caja-sesiones`
- `/movimientos/caja/movimientos` → `/operacion/caja-movimientos`
- `/movimientos/facturacion` → `/operacion/facturacion`
- `/movimientos/facturacion/nueva` → `/operacion/facturacion-nueva`
- `/movimientos/facturacion/:id/editar` → `/operacion/facturacion/:id/editar`
- `/movimientos/gastos` → `/operacion/gastos`
- `/movimientos/notas` → `/operacion/notas`

# React + TypeScript + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) (or [oxc](https://oxc.rs) when used in [rolldown-vite](https://vite.dev/guide/rolldown)) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## React Compiler

The React Compiler is currently not compatible with SWC. See [this issue](https://github.com/vitejs/vite-plugin-react/issues/428) for tracking the progress.

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type-aware lint rules:

```js
export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...

      // Remove tseslint.configs.recommended and replace with this
      tseslint.configs.recommendedTypeChecked,
      // Alternatively, use this for stricter rules
      tseslint.configs.strictTypeChecked,
      // Optionally, add this for stylistic rules
      tseslint.configs.stylisticTypeChecked,

      // Other configs...
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```

You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from 'eslint-plugin-react-x'
import reactDom from 'eslint-plugin-react-dom'

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...
      // Enable lint rules for React
      reactX.configs['recommended-typescript'],
      // Enable lint rules for React DOM
      reactDom.configs.recommended,
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```
