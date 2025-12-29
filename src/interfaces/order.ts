export type Station = "POS" | "KITCHEN" | "BAR";

export type OrderStatus =
  | "open"
  | "in_progress"
  | "ready"
  | "served"
  | "paid"
  | "cancelled";

export type OrderItemStatus = "queued" | "preparing" | "ready" | "served" | "cancelled";

export interface OrderItem {
  id: string;
  productId: string;
  name: string;
  qty: number;
  unitPrice: number;
  notes?: string;
  station: Exclude<Station, "POS">;
  status: OrderItemStatus;
}

export interface TableRef {
  id?: string;
  name?: string;
}

export interface PaymentSummary {
  subtotal: number;
  tip?: number;
  taxes?: number;
  total: number;
  paid?: number;
  balance?: number;
}

export interface Order {
  id: string;
  source: Station; // quién creó: POS
  table?: TableRef;
  customerName?: string;
  status: OrderStatus;
  items: OrderItem[];
  notes?: string;
  payments?: PaymentSummary;
  createdAt: string;
  updatedAt: string;
}
