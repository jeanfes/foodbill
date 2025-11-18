import type { StockByWarehouse, InventoryMovement, InventoryPreferences } from '@/interfaces/inventory';

const INVENTORY_STORAGE_KEY = 'foodbill_inventory_stocks';
const MOVEMENTS_STORAGE_KEY = 'foodbill_inventory_movements';
const PREFERENCES_STORAGE_KEY = 'foodbill_inventory_preferences';

export const WAREHOUSES_MOCK = [
  { id: 'w-1', name: 'Cocina' },
  { id: 'w-2', name: 'Barra' },
  { id: 'w-3', name: 'Almacén General' },
  { id: 'w-4', name: 'Bodega Refrigerada' },
];

export function getInitialStocksByWarehouse(): StockByWarehouse[] {
  return [
    // Hamburguesa Clásica
    { id: 'st-1', productId: 'p-1', warehouseId: 'w-1', warehouseName: 'Cocina', quantity: 25, unit: 'und', minQuantity: 5, lastUpdated: new Date().toISOString() },
    { id: 'st-2', productId: 'p-1', warehouseId: 'w-3', warehouseName: 'Almacén General', quantity: 50, unit: 'und', minQuantity: 10, lastUpdated: new Date().toISOString() },
    
    // Coca Cola 500ml
    { id: 'st-3', productId: 'p-2', warehouseId: 'w-2', warehouseName: 'Barra', quantity: 10, unit: 'und', minQuantity: 20, lastUpdated: new Date().toISOString() },
    { id: 'st-4', productId: 'p-2', warehouseId: 'w-4', warehouseName: 'Bodega Refrigerada', quantity: 100, unit: 'und', minQuantity: 30, lastUpdated: new Date().toISOString() },
    
    // Productos varios con stock variado
    { id: 'st-5', productId: 'p-4', warehouseId: 'w-1', warehouseName: 'Cocina', quantity: 15, unit: 'und', minQuantity: 10, lastUpdated: new Date().toISOString() },
    { id: 'st-6', productId: 'p-5', warehouseId: 'w-2', warehouseName: 'Barra', quantity: 8, unit: 'und', minQuantity: 5, lastUpdated: new Date().toISOString() },
    { id: 'st-7', productId: 'p-6', warehouseId: 'w-3', warehouseName: 'Almacén General', quantity: 2, unit: 'kg', minQuantity: 10, lastUpdated: new Date().toISOString() },
    { id: 'st-8', productId: 'p-7', warehouseId: 'w-1', warehouseName: 'Cocina', quantity: 30, unit: 'und', minQuantity: 5, lastUpdated: new Date().toISOString() },
    { id: 'st-9', productId: 'p-8', warehouseId: 'w-4', warehouseName: 'Bodega Refrigerada', quantity: 45, unit: 'lt', minQuantity: 15, lastUpdated: new Date().toISOString() },
    { id: 'st-10', productId: 'p-9', warehouseId: 'w-2', warehouseName: 'Barra', quantity: 60, unit: 'und', minQuantity: 20, lastUpdated: new Date().toISOString() },
    { id: 'st-11', productId: 'p-10', warehouseId: 'w-3', warehouseName: 'Almacén General', quantity: 3, unit: 'und', minQuantity: 8, lastUpdated: new Date().toISOString() },
    { id: 'st-12', productId: 'p-11', warehouseId: 'w-1', warehouseName: 'Cocina', quantity: 22, unit: 'kg', minQuantity: 5, lastUpdated: new Date().toISOString() },
    { id: 'st-13', productId: 'p-12', warehouseId: 'w-2', warehouseName: 'Barra', quantity: 40, unit: 'und', minQuantity: 10, lastUpdated: new Date().toISOString() },
    { id: 'st-14', productId: 'p-13', warehouseId: 'w-4', warehouseName: 'Bodega Refrigerada', quantity: 18, unit: 'und', minQuantity: 25, lastUpdated: new Date().toISOString() },
    { id: 'st-15', productId: 'p-14', warehouseId: 'w-3', warehouseName: 'Almacén General', quantity: 35, unit: 'und', minQuantity: 10, lastUpdated: new Date().toISOString() },
  ];
}

export function getInitialMovements(): InventoryMovement[] {
  const now = new Date();
  const days = (d: number) => new Date(now.getTime() - d * 24 * 60 * 60 * 1000).toISOString();
  
  return [
    { id: 'm-1', type: 'in', productId: 'p-1', productName: 'Hamburguesa Clásica', toWarehouseId: 'w-1', toWarehouseName: 'Cocina', qty: 50, unit: 'und', reason: 'Compra inicial', userId: 'u-1', userName: 'Admin', createdAt: days(10) },
    { id: 'm-2', type: 'out', productId: 'p-1', productName: 'Hamburguesa Clásica', fromWarehouseId: 'w-1', fromWarehouseName: 'Cocina', qty: 15, unit: 'und', reason: 'Venta del día', userId: 'u-1', userName: 'Admin', createdAt: days(9) },
    { id: 'm-3', type: 'transfer', productId: 'p-1', productName: 'Hamburguesa Clásica', fromWarehouseId: 'w-1', fromWarehouseName: 'Cocina', toWarehouseId: 'w-3', toWarehouseName: 'Almacén General', qty: 10, unit: 'und', reason: 'Reubicación de excedente', userId: 'u-1', userName: 'Admin', createdAt: days(8) },
    { id: 'm-4', type: 'in', productId: 'p-2', productName: 'Coca Cola 500ml', toWarehouseId: 'w-4', toWarehouseName: 'Bodega Refrigerada', qty: 120, unit: 'und', reason: 'Pedido proveedor', userId: 'u-1', userName: 'Admin', createdAt: days(7) },
    { id: 'm-5', type: 'transfer', productId: 'p-2', productName: 'Coca Cola 500ml', fromWarehouseId: 'w-4', fromWarehouseName: 'Bodega Refrigerada', toWarehouseId: 'w-2', toWarehouseName: 'Barra', qty: 20, unit: 'und', reason: 'Reponer barra', userId: 'u-1', userName: 'Admin', createdAt: days(6) },
    { id: 'm-6', type: 'adjust', productId: 'p-6', productName: 'Platos 6', toWarehouseId: 'w-3', toWarehouseName: 'Almacén General', qty: -5, unit: 'kg', reason: 'Merma por deterioro', userId: 'u-1', userName: 'Admin', createdAt: days(5) },
    { id: 'm-7', type: 'in', productId: 'p-7', productName: 'Platos 7', toWarehouseId: 'w-1', toWarehouseName: 'Cocina', qty: 30, unit: 'und', reason: 'Inventario inicial', userId: 'u-1', userName: 'Admin', createdAt: days(4) },
    { id: 'm-8', type: 'consumption', productId: 'p-10', productName: 'Platos 10', fromWarehouseId: 'w-3', fromWarehouseName: 'Almacén General', qty: 5, unit: 'und', reason: 'Preparación de receta compuesta', userId: 'u-1', userName: 'Admin', createdAt: days(3) },
    { id: 'm-9', type: 'adjust', productId: 'p-13', productName: 'Platos 13', toWarehouseId: 'w-4', toWarehouseName: 'Bodega Refrigerada', qty: 3, unit: 'und', reason: 'Ajuste de conteo físico', userId: 'u-1', userName: 'Admin', createdAt: days(2) },
    { id: 'm-10', type: 'out', productId: 'p-12', productName: 'Platos 12', fromWarehouseId: 'w-2', fromWarehouseName: 'Barra', qty: 10, unit: 'und', reason: 'Venta', userId: 'u-1', userName: 'Admin', createdAt: days(1) },
  ];
}

export function loadStocksFromStorage(): StockByWarehouse[] {
  const stored = localStorage.getItem(INVENTORY_STORAGE_KEY);
  if (stored) {
    try {
      return JSON.parse(stored);
    } catch {
      return getInitialStocksByWarehouse();
    }
  }
  return getInitialStocksByWarehouse();
}

export function saveStocksToStorage(stocks: StockByWarehouse[]): void {
  localStorage.setItem(INVENTORY_STORAGE_KEY, JSON.stringify(stocks));
}

export function loadMovementsFromStorage(): InventoryMovement[] {
  const stored = localStorage.getItem(MOVEMENTS_STORAGE_KEY);
  if (stored) {
    try {
      return JSON.parse(stored);
    } catch {
      return getInitialMovements();
    }
  }
  return getInitialMovements();
}

export function saveMovementsToStorage(movements: InventoryMovement[]): void {
  localStorage.setItem(MOVEMENTS_STORAGE_KEY, JSON.stringify(movements));
}

export function loadPreferencesFromStorage(): InventoryPreferences {
  const stored = localStorage.getItem(PREFERENCES_STORAGE_KEY);
  if (stored) {
    try {
      return JSON.parse(stored);
    } catch {
      return {};
    }
  }
  return {};
}

export function savePreferencesToStorage(prefs: InventoryPreferences): void {
  localStorage.setItem(PREFERENCES_STORAGE_KEY, JSON.stringify(prefs));
}
