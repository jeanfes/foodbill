export type MovementType = "IN" | "OUT" | "ADJUST" | "TRANSFER";

export interface StockMovement {
  id: string;
  type: MovementType;
  warehouseId: string; // origin for OUT/TRANSFER; target for IN if desired
  toWarehouseId?: string; // for TRANSFER
  productId: string;
  productName: string;
  quantity: number; // positive values; sign inferred by type
  note?: string;
  date: string; // ISO
}
