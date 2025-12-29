import type { Order, OrderItem, OrderItemStatus } from "@/interfaces/order";
import { STORAGE_KEYS } from "@/lib/storageKeys";

const STORAGE_KEY = STORAGE_KEYS.ORDERS;

export function getInitialMockOrders(): Order[] {
  const now = new Date().toISOString();
  const item = (
    p: Partial<OrderItem> & { name: string; qty?: number; unitPrice?: number; station: "KITCHEN" | "BAR" }
  ): OrderItem => ({
    id: `oi-${Math.random().toString(36).slice(2, 9)}`,
    productId: p.productId ?? "",
    name: p.name,
    qty: p.qty ?? 1,
    unitPrice: p.unitPrice ?? 0,
    notes: p.notes,
    station: p.station,
    status: (p.status ?? "queued") as OrderItemStatus,
  });

  return [
    {
      id: "o-1",
      source: "POS",
      table: { id: "t-1", name: "Mesa 1" },
      customerName: "Walk-in",
      status: "open",
      items: [
        item({ productId: "p-1", name: "Hamburguesa Clásica", unitPrice: 18.5, station: "KITCHEN" }),
        item({ productId: "p-2", name: "Coca Cola 500ml", unitPrice: 3.5, station: "BAR" }),
      ],
      createdAt: now,
      updatedAt: now,
    },
  ];
}

export function loadOrdersFromStorage(): Order[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return getInitialMockOrders();
    const parsed = JSON.parse(raw) as Order[];
    if (!Array.isArray(parsed)) return getInitialMockOrders();
    return parsed;
  } catch {
    return getInitialMockOrders();
  }
}

export function saveOrdersToStorage(orders: Order[]): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(orders));
}
