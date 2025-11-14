import type { Product } from "@/interfaces/product";
import { STORAGE_KEYS } from "@/lib/storageKeys";

export function getInitialMockProducts(): Product[] {
  const now = new Date().toISOString();
  const tagForCategory = (name?: string) => {
    switch (name) {
      case 'Platos':
        return 'food';
      case 'Bebidas':
        return 'drink';
      case 'Postres':
        return 'dessert';
      case 'Snacks':
        return 'snack';
      default:
        return 'restaurant';
    }
  };
  const base: Product[] = [
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
  imageUrl: `https://loremflickr.com/600/400/${tagForCategory('Platos')}?lock=1`,
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
  imageUrl: `https://loremflickr.com/600/400/${tagForCategory('Bebidas')}?lock=2`,
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
  imageUrl: `https://loremflickr.com/600/400/${tagForCategory('Servicios')}?lock=3`,
      tags: ['corporativo'],
      createdAt: now,
      updatedAt: now
    },
  ];

  // Generar productos adicionales variados hasta ~30
  const categories = [
    { id: 'c-1', name: 'Platos' },
    { id: 'c-2', name: 'Bebidas' },
    { id: 'c-3', name: 'Servicios' },
    { id: 'c-4', name: 'Postres' },
    { id: 'c-5', name: 'Snacks' },
  ];
  const tags = ["popular", "vegano", "sin_gluten", "nuevo", "promo"];
  for (let i = 4; i <= 30; i++) {
    const c = categories[i % categories.length];
    const price = Number((Math.random() * 50 + 2).toFixed(2));
    const track = i % 3 !== 0; // algunos sin inventario
    const minStock = track ? (i % 5 === 0 ? 20 : 5) : undefined;
    const stock = track ? (i % 6 === 0 ? 3 : Math.floor(Math.random() * 40) + 1) : 0; // algunos bajos
    base.push({
      id: `p-${i}`,
      sku: `${1000 + i}`,
      name: `${c.name} ${i}`,
      description: `Producto ${i} de categoría ${c.name}`,
      categoryId: c.id,
      categoryName: c.name,
      price,
      cost: Math.random() > 0.5 ? Number((price * 0.5).toFixed(2)) : undefined,
      status: i % 11 === 0 ? 'inactive' : 'active',
      trackInventory: track,
      stockByWarehouse: track ? [{ warehouseId: 'w-1', warehouseName: 'General', stock }] : [],
      minStock,
  imageUrl: `https://loremflickr.com/600/400/${tagForCategory(c.name)}?lock=${i}`,
      tags: Math.random() > 0.6 ? [tags[i % tags.length]] : [],
      createdAt: now,
      updatedAt: now,
      isComposite: i % 7 === 0,
      recipe: i % 7 === 0 ? [{ productId: 'p-1', qty: 1 }, { productId: 'p-2', qty: 2 }] : undefined,
    });
  }
  return base;
}

const STORAGE_KEY = STORAGE_KEYS.PRODUCTS;

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
