import { useCallback, useEffect,  useRef, useState } from 'react';
import {  loadProductsFromStorage, saveProductsToStorage } from '@/lib/mockData/products';
import type { Product, ProductsUIPreferences } from '@/interfaces/product';
import { STORAGE_KEYS } from '@/lib/storageKeys';

export interface FilterParams {
  search?: string;
  categoryIds?: string[];
  status?: 'all' | 'active' | 'inactive';
  trackInventory?: boolean;
  stockLowOnly?: boolean;
  priceMin?: number;
  priceMax?: number;
  tags?: string[];
  sortBy?: keyof Product;
  sortDir?: 'asc' | 'desc';
  page?: number;
  pageSize?: number;
}

export function useProductsMock() {
  const [products, setProducts] = useState<Product[]>(() => loadProductsFromStorage());
  const isFirst = useRef(true);
  const [prefs, setPrefs] = useState<ProductsUIPreferences>(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEYS.PRODUCTS_PREFS);
      return raw ? (JSON.parse(raw) as ProductsUIPreferences) : {};
    } catch {
      return {} as ProductsUIPreferences;
    }
  });

  // Persistencia en localStorage
  useEffect(() => {
    if (!isFirst.current) saveProductsToStorage(products);
    isFirst.current = false;
  }, [products]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.PRODUCTS_PREFS, JSON.stringify(prefs));
  }, [prefs]);

  // Filtrado y búsqueda
  const filteredProducts = useCallback((params: FilterParams = {}) => {
    const effective = {
      ...prefs.lastFilters,
      sortBy: prefs.sortBy,
      sortDir: prefs.sortDir,
      pageSize: prefs.pageSize,
      ...params,
    } as FilterParams;
    let data = [...products];
    if (effective.search) {
      const q = effective.search.toLowerCase();
      data = data.filter(p =>
        p.name.toLowerCase().includes(q) || (p.sku && p.sku.includes(q))
      );
    }
    if (effective.categoryIds && effective.categoryIds.length > 0) {
      data = data.filter(p => p.categoryId && effective.categoryIds!.includes(p.categoryId));
    }
    if (effective.status && effective.status !== 'all') {
      data = data.filter(p => p.status === effective.status);
    }
    if (effective.trackInventory !== undefined) {
      data = data.filter(p => p.trackInventory === effective.trackInventory);
    }
    if (effective.stockLowOnly) {
      data = data.filter(p => {
        if (!p.trackInventory) return false;
        const total = (p.stockByWarehouse || []).reduce((a, w) => a + w.stock, 0);
        return p.minStock !== undefined && total <= p.minStock;
      });
    }
    if (effective.priceMin !== undefined) {
      data = data.filter(p => p.price >= effective.priceMin!);
    }
    if (effective.priceMax !== undefined) {
      data = data.filter(p => p.price <= effective.priceMax!);
    }
    if (effective.tags && effective.tags.length > 0) {
      data = data.filter(p => p.tags && p.tags.some(t => effective.tags!.includes(t)));
    }
    // Sorting
    if (effective.sortBy) {
      data.sort((a, b) => {
        const dir = effective.sortDir === 'desc' ? -1 : 1;
        const av = a[effective.sortBy!];
        const bv = b[effective.sortBy!];
        if (av === undefined) return 1;
        if (bv === undefined) return -1;
        if (typeof av === 'number' && typeof bv === 'number') return (av - bv) * dir;
        return String(av).localeCompare(String(bv)) * dir;
      });
    }
    // Paginación
    if (effective.pageSize && effective.page !== undefined) {
      const start = effective.page * effective.pageSize;
      data = data.slice(start, start + effective.pageSize);
    }
    return data;
  }, [products]);

  // CRUD y helpers
  const createProduct = useCallback((p: Product) => {
    setProducts(prev => [{ ...p, id: `p-${Date.now()}` }, ...prev]);
  }, []);

  const updateProduct = useCallback((p: Product) => {
    setProducts(prev => prev.map(prod => prod.id === p.id ? { ...prod, ...p } : prod));
  }, []);

  const softDeleteProduct = useCallback((id: string) => {
    setProducts(prev => prev.map(prod => prod.id === id ? { ...prod, status: 'inactive' } : prod));
  }, []);

  const adjustStock = useCallback(({ productId, warehouseId, qty }: { productId: string; warehouseId: string; qty: number; reason?: string }) => {
    setProducts(prev => prev.map(prod => {
      if (prod.id !== productId) return prod;
      if (!prod.stockByWarehouse) return prod;
      return {
        ...prod,
        stockByWarehouse: prod.stockByWarehouse.map(w =>
          w.warehouseId === warehouseId ? { ...w, stock: Math.max(0, w.stock + qty) } : w
        )
      };
    }));
  }, []);

  // Importa productos desde CSV (valida mínimos)
  const importProducts = useCallback((rows: Partial<Product>[]) => {
    const errors: { row: any; error: string }[] = [];
    const valid: Product[] = [];
    rows.forEach((row, i) => {
      if (!row.name || typeof row.name !== 'string' || row.name.length < 2) {
        errors.push({ row, error: 'Nombre requerido (min 2 chars)' });
        return;
      }
      if (typeof row.price !== 'number' || row.price < 0.01) {
        errors.push({ row, error: 'Precio inválido (>= 0.01)' });
        return;
      }
      valid.push({
        ...row,
        id: `p-${Date.now()}-${i}`,
        status: 'active',
        trackInventory: !!row.trackInventory,
        stockByWarehouse: row.stockByWarehouse || [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      } as Product);
    });
    if (valid.length) setProducts(prev => [...valid, ...prev]);
    return { success: valid.length, errors };
  }, []);

  // Exporta productos a CSV y fuerza descarga
  const exportProductsCSV = useCallback((productsToExport: Product[]) => {
    const headers = [
      'id', 'sku', 'name', 'description', 'categoryId', 'categoryName', 'price', 'cost', 'trackInventory', 'minStock', 'status', 'tags', 'createdAt', 'updatedAt'
    ];
    const rows = productsToExport.map(p =>
      headers.map(h => Array.isArray((p as any)[h]) ? JSON.stringify((p as any)[h]) : (p as any)[h] ?? '')
    );
    const csv = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `productos_${Date.now()}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }, []);

  return {
    products,
    filteredProducts,
    preferences: prefs,
    setPreferences: setPrefs,
    createProduct,
    updateProduct,
    softDeleteProduct,
    adjustStock,
    importProducts,
    exportProductsCSV
  };
}
