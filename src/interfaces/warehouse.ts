export type WarehouseStatus = "ACTIVE" | "INACTIVE";

export interface Warehouse {
  id: string;
  code: string;
  name: string;
  description?: string;
  location: string;
  status: WarehouseStatus;
  manager: string;
  createdAt: string; // ISO
  updatedAt: string; // ISO
}

export interface WarehouseProductStock {
  warehouseId: string;
  productId: string;
  productName: string;
  unit: string; // e.g., "und", "kg", "lt"
  stock: number;
  minStock: number;
  lastUpdated: string; // ISO
}
