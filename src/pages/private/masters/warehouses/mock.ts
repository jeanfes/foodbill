import type { Warehouse, WarehouseProductStock } from "@/interfaces/warehouse";
import type { StockMovement } from "@/interfaces/stockMovement";

export const warehousesMock: Warehouse[] = [
  {
    id: "wh-001",
    code: "BOD-001",
    name: "Bodega Principal",
    description: "Bodega central para producto terminado",
    location: "Sede Norte",
    status: "ACTIVE",
    manager: "Laura Pérez",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "wh-002",
    code: "BOD-002",
    name: "Bodega Secundaria",
    description: "Insumos y empaques",
    location: "Sede Centro",
    status: "ACTIVE",
    manager: "Carlos Gómez",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "wh-003",
    code: "BOD-003",
    name: "Bodega Inactiva",
    description: "Temporalmente fuera de uso",
    location: "Sede Sur",
    status: "INACTIVE",
    manager: "-",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

export const warehouseStocksMock: WarehouseProductStock[] = [
  {
    warehouseId: "wh-001",
    productId: "p-001",
    productName: "Harina de Trigo 1kg",
    unit: "kg",
    stock: 120,
    minStock: 50,
    lastUpdated: new Date().toISOString(),
  },
  {
    warehouseId: "wh-001",
    productId: "p-002",
    productName: "Queso Mozzarella 500g",
    unit: "und",
    stock: 45,
    minStock: 20,
    lastUpdated: new Date().toISOString(),
  },
  {
    warehouseId: "wh-002",
    productId: "p-003",
    productName: "Cajas de Pizza",
    unit: "und",
    stock: 300,
    minStock: 100,
    lastUpdated: new Date().toISOString(),
  },
];

export const stockMovementsMock: StockMovement[] = [
  {
    id: "mov-001",
    type: "IN",
    warehouseId: "wh-001",
    productId: "p-001",
    productName: "Harina de Trigo 1kg",
    quantity: 30,
    note: "Compra semanal",
    date: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
  },
  {
    id: "mov-002",
    type: "OUT",
    warehouseId: "wh-001",
    productId: "p-002",
    productName: "Queso Mozzarella 500g",
    quantity: 10,
    note: "Consumo cocina",
    date: new Date().toISOString(),
  },
];
