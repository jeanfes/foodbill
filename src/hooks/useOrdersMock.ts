import { useCallback, useEffect, useRef, useState } from "react";
import type { Order, OrderItem, OrderItemStatus, OrderStatus } from "@/interfaces/order";
import { loadOrdersFromStorage, saveOrdersToStorage } from "@/lib/mockData/orders";

export function useOrdersMock() {
  const [orders, setOrders] = useState<Order[]>(() => loadOrdersFromStorage());
  const first = useRef(true);

  useEffect(() => {
    if (!first.current) saveOrdersToStorage(orders);
    first.current = false;
  }, [orders]);

  const computeOrderStatus = (o: Order): OrderStatus => {
    const items = o.items;
    const allServed = items.every((i) => i.status === "served");
    if (allServed) return "served";
    const anyPreparing = items.some((i) => i.status === "preparing");
    const anyQueued = items.some((i) => i.status === "queued");
    const allReady = items.every((i) => i.status === "ready" || i.status === "served");
    if (anyPreparing) return "in_progress";
    if (allReady && !anyQueued) return "ready";
    return "open";
  };

  const createOrder = useCallback(
    (payload: {
      table?: Order["table"];
      customerName?: string;
      items: Array<Omit<OrderItem, "id" | "status"> & { status?: OrderItemStatus }>;
      notes?: string;
    }) => {
      const now = new Date().toISOString();
      const newOrder: Order = {
        id: `o-${Date.now()}`,
        source: "POS",
        table: payload.table,
        customerName: payload.customerName,
        status: "open",
        items: payload.items.map((it, idx) => ({
          ...it,
          id: `oi-${Date.now()}-${idx}`,
          status: it.status ?? "queued",
        })),
        notes: payload.notes,
        createdAt: now,
        updatedAt: now,
      };
      setOrders((prev) => [newOrder, ...prev]);
      return newOrder.id;
    },
    []
  );

  const updateItemStatus = useCallback((orderId: string, itemId: string, status: OrderItemStatus) => {
    setOrders((prev) =>
      prev.map((o) => {
        if (o.id !== orderId) return o;
        const items = o.items.map((it) => (it.id === itemId ? { ...it, status } : it));
        const statusOrder = computeOrderStatus({ ...o, items });
        return { ...o, items, status: statusOrder, updatedAt: new Date().toISOString() };
      })
    );
  }, []);

  const updateOrderStatus = useCallback((orderId: string, status: OrderStatus) => {
    setOrders((prev) => prev.map((o) => (o.id === orderId ? { ...o, status, updatedAt: new Date().toISOString() } : o)));
  }, []);

  const addItem = useCallback((orderId: string, item: Omit<OrderItem, "id" | "status"> & { status?: OrderItemStatus }) => {
    setOrders((prev) =>
      prev.map((o) => {
        if (o.id !== orderId) return o;
        const newItem: OrderItem = { ...item, id: `oi-${Date.now()}`, status: item.status ?? "queued" };
        const items = [newItem, ...o.items];
        const statusOrder = computeOrderStatus({ ...o, items });
        return { ...o, items, status: statusOrder, updatedAt: new Date().toISOString() };
      })
    );
  }, []);

  const ordersByStation = useCallback(
    (station: "KITCHEN" | "BAR") => {
      // Devuelve las órdenes con al menos un item de esa estación que no esté servido
      return orders
        .map((o) => ({
          ...o,
          stationItems: o.items.filter((i) => i.station === station && i.status !== "served"),
        }))
        .filter((o) => o.stationItems && o.stationItems.length > 0);
    },
    [orders]
  );

  return {
    orders,
    createOrder,
    updateItemStatus,
    updateOrderStatus,
    addItem,
    ordersByStation,
  };
}
