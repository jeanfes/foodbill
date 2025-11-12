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

export interface ProductsUIPreferences {
  pageSize?: number;
  sortBy?: keyof Product;
  sortDir?: 'asc' | 'desc';
  lastFilters?: {
    search?: string;
    categoryIds?: string[];
    status?: 'all' | 'active' | 'inactive';
    trackInventory?: boolean;
    stockLowOnly?: boolean;
    priceMin?: number;
    priceMax?: number;
    tags?: string[];
  };
}