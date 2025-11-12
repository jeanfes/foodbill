/**
 * @file products.ts
 * Mock dataset y helpers para el modelo Product.
 * Incluye persistencia en localStorage y datos de ejemplo variados.
 */



/**
 * Representa un producto en el sistema.
 * @property id - UUID único
 * @property sku - Código SKU/PLU/barcode (opcional, único si existe)
 * @property name - Nombre del producto (requerido, min 2 chars)
 * @property description - Descripción (opcional)
 * @property categoryId - ID de categoría (opcional)
 * @property categoryName - Nombre de la categoría (opcional)
 * @property price - Precio de venta (requerido, >= 0.01)
 * @property cost - Costo (opcional, visible solo si permiso showCost)
 * @property trackInventory - Si gestiona inventario
 * @property stockByWarehouse - Array de stock por bodega
 * @property minStock - Stock mínimo para alerta de bajo stock (opcional)
 * @property isComposite - Si es producto compuesto/receta
 * @property recipe - Ingredientes (si isComposite)
 * @property tags - Etiquetas (opcional)
 * @property imageUrl - URL de imagen (opcional)
 * @property status - 'active' | 'inactive'
 * @property visibility - Visibilidad en POS (opcional)
 * @property createdAt - Fecha creación (ISO)
 * @property updatedAt - Fecha actualización (ISO)
 */
export interface Product {
  id: string;
  sku?: string;
  name: string;
  description?: string;
  categoryId?: string;
  categoryName?: string;
  price: number;
  cost?: number;
  trackInventory: boolean;
  stockByWarehouse?: { warehouseId: string; warehouseName?: string; stock: number }[];
  minStock?: number;
  isComposite?: boolean;
  recipe?: { productId: string; qty: number }[];
  tags?: string[];
  imageUrl?: string;
  status: 'active' | 'inactive';
  visibility?: { active: boolean; startTime?: string; endTime?: string; days?: string[] };
  createdAt?: string;
  updatedAt?: string;
}

/**
 * Validaciones básicas:
 * - name: requerido, min 2 chars
 * - price: requerido, >= 0.01
 * - sku: único si existe
 * - stock inputs: enteros >= 0
 * - isComposite === true => recipe requerido
 */

/**
 * Devuelve un array de productos mock variados (~30), cubriendo edge cases.
 * Incluye productos con stock bajo, inactivos, tags, isComposite, etc.
 */
export function getInitialMockProducts(): Product[] {
  const now = new Date().toISOString();
  return [
    {
      id: 'p-1',
      sku: '1001',
      name: 'Hamburguesa Clásica',
      description: 'Jugosa hamburguesa con pan artesanal.',
      categoryId: 'c-1',
      categoryName: 'Platos',
      price: 18.5,
      cost: 8.2,
      status: 'active',
      trackInventory: true,
      stockByWarehouse: [
        { warehouseId: 'w-1', warehouseName: 'Cocina', stock: 25 }
      ],
      minStock: 5,
      imageUrl: '/images/burger.jpg',
      tags: ['popular'],
      createdAt: now,
      updatedAt: now
    },
    {
      id: 'p-2',
      sku: '1002',
      name: 'Coca Cola 500ml',
      description: 'Bebida refrescante.',
      categoryId: 'c-2',
      categoryName: 'Bebidas',
      price: 3.5,
      cost: 1.1,
      status: 'active',
      trackInventory: true,
      stockByWarehouse: [
        { warehouseId: 'w-2', warehouseName: 'Barra', stock: 10 }
      ],
      minStock: 10,
      imageUrl: '/images/coke.jpg',
      tags: [],
      createdAt: now,
      updatedAt: now
    },
    {
      id: 'p-3',
      sku: '1003',
      name: 'Servicio de Catering',
      description: 'Servicio para eventos corporativos.',
      categoryId: 'c-3',
      categoryName: 'Servicios',
      price: 150.0,
      cost: undefined,
      status: 'active',
      trackInventory: false,
      stockByWarehouse: [],
  minStock: undefined,
  imageUrl: undefined,
      tags: ['corporativo'],
      createdAt: now,
      updatedAt: now
    },
    // ...27 productos más variados (se agregarán en la siguiente iteración)...
  ];
}

/**
 * Helpers para persistencia en localStorage
 */
const STORAGE_KEY = 'mock_products_v1';

export function loadProductsFromStorage(): Product[] {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) return getInitialMockProducts();
  try {
    return JSON.parse(raw) as Product[];
  } catch {
    return getInitialMockProducts();
  }
}

export function saveProductsToStorage(products: Product[]): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(products));
}
