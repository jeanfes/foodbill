export type MovementType = 'in' | 'out' | 'adjust' | 'transfer' | 'consumption';

export interface InventoryItem {
  productId: string;
  sku?: string;
  name: string;
  unit: string;
  totalQuantity: number;
  minQuantity?: number;
  isTrackable: boolean;
  isComposite?: boolean;
  recipe?: { productId: string; qty: number }[];
  categoryId?: string;
  categoryName?: string;
  imageUrl?: string;
}

export interface StockByWarehouse {
  id: string;
  productId: string;
  warehouseId: string;
  warehouseName?: string;
  quantity: number;
  unit?: string;
  minQuantity?: number;
  lastUpdated: string;
}

export interface InventoryMovement {
  id: string;
  type: MovementType;
  productId: string;
  productName?: string;
  fromWarehouseId?: string;
  fromWarehouseName?: string;
  toWarehouseId?: string;
  toWarehouseName?: string;
  qty: number;
  unit?: string;
  reason?: string;
  userId?: string;
  userName?: string;
  createdAt: string;
}

export interface InventorySnapshot {
  id: string;
  productId: string;
  warehouseId: string;
  expectedQty: number;
  actualQty: number;
  difference: number;
  userId?: string;
  notes?: string;
  createdAt: string;
}

export interface InventoryFilters {
  search?: string;
  categoryIds?: string[];
  trackableOnly?: boolean;
  stockLowOnly?: boolean;
  warehouseId?: string;
}

export interface InventoryPreferences {
  viewMode?: 'cards' | 'list' | 'table';
  lastFilters?: InventoryFilters;
  pageSize?: number;
}
