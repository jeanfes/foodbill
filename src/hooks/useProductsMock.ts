import { useCallback, useEffect,  useRef, useState } from 'react';
import {  loadProductsFromStorage, saveProductsToStorage, type Product } from '../lib/mockData/products';

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

  // Persistencia en localStorage
  useEffect(() => {
    if (!isFirst.current) saveProductsToStorage(products);
    isFirst.current = false;
  }, [products]);

  // Filtrado y búsqueda
  const filteredProducts = useCallback((params: FilterParams = {}) => {
    let data = [...products];
    if (params.search) {
      const q = params.search.toLowerCase();
      data = data.filter(p =>
        p.name.toLowerCase().includes(q) || (p.sku && p.sku.includes(q))
      );
    }
    if (params.categoryIds && params.categoryIds.length > 0) {
      data = data.filter(p => p.categoryId && params.categoryIds!.includes(p.categoryId));
    }
    if (params.status && params.status !== 'all') {
      data = data.filter(p => p.status === params.status);
    }
    if (params.trackInventory !== undefined) {
      data = data.filter(p => p.trackInventory === params.trackInventory);
    }
    if (params.stockLowOnly) {
      data = data.filter(p => {
        if (!p.trackInventory) return false;
        const total = (p.stockByWarehouse || []).reduce((a, w) => a + w.stock, 0);
        return p.minStock !== undefined && total <= p.minStock;
      });
    }
    if (params.priceMin !== undefined) {
      data = data.filter(p => p.price >= params.priceMin!);
    }
    if (params.priceMax !== undefined) {
      data = data.filter(p => p.price <= params.priceMax!);
    }
    if (params.tags && params.tags.length > 0) {
      data = data.filter(p => p.tags && p.tags.some(t => params.tags!.includes(t)));
    }
    // Sorting
    if (params.sortBy) {
      data.sort((a, b) => {
        const dir = params.sortDir === 'desc' ? -1 : 1;
        const av = a[params.sortBy!];
        const bv = b[params.sortBy!];
        if (av === undefined) return 1;
        if (bv === undefined) return -1;
        if (typeof av === 'number' && typeof bv === 'number') return (av - bv) * dir;
        return String(av).localeCompare(String(bv)) * dir;
      });
    }
    // Paginación
    if (params.pageSize && params.page !== undefined) {
      const start = params.page * params.pageSize;
      data = data.slice(start, start + params.pageSize);
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
    createProduct,
    updateProduct,
    softDeleteProduct,
    adjustStock,
    importProducts,
    exportProductsCSV
  };
}
