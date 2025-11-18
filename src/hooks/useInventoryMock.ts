import { useCallback, useEffect, useRef, useState } from 'react';
import { loadProductsFromStorage } from '@/lib/mockData/products';
import {
  loadStocksFromStorage,
  saveStocksToStorage,
  loadMovementsFromStorage,
  saveMovementsToStorage,
  loadPreferencesFromStorage,
  savePreferencesToStorage,
  WAREHOUSES_MOCK
} from '@/lib/mockData/inventory';
import type { Product } from '@/interfaces/product';
import type {
  InventoryItem,
  StockByWarehouse,
  InventoryMovement,
  InventoryFilters,
  InventoryPreferences
} from '@/interfaces/inventory';

export function useInventoryMock() {
  const [stocks, setStocks] = useState<StockByWarehouse[]>(() => loadStocksFromStorage());
  const [movements, setMovements] = useState<InventoryMovement[]>(() => loadMovementsFromStorage());
  const [preferences, setPreferences] = useState<InventoryPreferences>(() => loadPreferencesFromStorage());
  const [products] = useState<Product[]>(() => loadProductsFromStorage());
  const isFirst = useRef(true);

  useEffect(() => {
    if (!isFirst.current) {
      saveStocksToStorage(stocks);
    }
    isFirst.current = false;
  }, [stocks]);

  useEffect(() => {
    saveMovementsToStorage(movements);
  }, [movements]);

  useEffect(() => {
    savePreferencesToStorage(preferences);
  }, [preferences]);

  const getInventoryItems = useCallback((): InventoryItem[] => {
    return products
      .filter(p => p.trackInventory)
      .map(p => {
        const productStocks = stocks.filter(s => s.productId === p.id);
        const totalQuantity = productStocks.reduce((sum, s) => sum + s.quantity, 0);
        return {
          productId: p.id,
          sku: p.sku,
          name: p.name,
          unit: p.stockByWarehouse?.[0]?.stock !== undefined ? 'und' : 'und',
          totalQuantity,
          minQuantity: p.minStock,
          isTrackable: p.trackInventory,
          isComposite: p.isComposite,
          recipe: p.recipe,
          categoryId: p.categoryId,
          categoryName: p.categoryName,
          imageUrl: p.imageUrl
        };
      });
  }, [products, stocks]);

  const filteredItems = useCallback((filters: InventoryFilters = {}): InventoryItem[] => {
    let items = getInventoryItems();
    
    if (filters.search) {
      const q = filters.search.toLowerCase();
      items = items.filter(i => 
        i.name.toLowerCase().includes(q) || 
        (i.sku && i.sku.toLowerCase().includes(q))
      );
    }

    if (filters.categoryIds && filters.categoryIds.length > 0) {
      items = items.filter(i => i.categoryId && filters.categoryIds!.includes(i.categoryId));
    }

    if (filters.trackableOnly) {
      items = items.filter(i => i.isTrackable);
    }

    if (filters.stockLowOnly) {
      items = items.filter(i => {
        if (!i.minQuantity) return false;
        return i.totalQuantity <= i.minQuantity;
      });
    }

    if (filters.warehouseId) {
      const productIds = stocks
        .filter(s => s.warehouseId === filters.warehouseId)
        .map(s => s.productId);
      items = items.filter(i => productIds.includes(i.productId));
    }

    return items;
  }, [getInventoryItems, stocks]);

  const getStockByProduct = useCallback((productId: string): StockByWarehouse[] => {
    return stocks.filter(s => s.productId === productId);
  }, [stocks]);

  const getStockByWarehouse = useCallback((warehouseId: string): StockByWarehouse[] => {
    return stocks.filter(s => s.warehouseId === warehouseId);
  }, [stocks]);

  const getMovementsByProduct = useCallback((productId: string): InventoryMovement[] => {
    return movements
      .filter(m => m.productId === productId)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }, [movements]);

  const getMovementsByWarehouse = useCallback((warehouseId: string): InventoryMovement[] => {
    return movements
      .filter(m => m.fromWarehouseId === warehouseId || m.toWarehouseId === warehouseId)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }, [movements]);

  const addMovement = useCallback((movement: Omit<InventoryMovement, 'id' | 'createdAt'>): boolean => {
    const newMovement: InventoryMovement = {
      ...movement,
      id: `m-${Date.now()}-${Math.floor(Math.random() * 10000)}`,
      createdAt: new Date().toISOString()
    };

    try {
      if (movement.type === 'transfer') {
        if (!movement.fromWarehouseId || !movement.toWarehouseId) {
          throw new Error('Transfer requires both fromWarehouseId and toWarehouseId');
        }
        
        const fromStock = stocks.find(
          s => s.productId === movement.productId && s.warehouseId === movement.fromWarehouseId
        );
        
        if (!fromStock || fromStock.quantity < movement.qty) {
          throw new Error('Insufficient stock in source warehouse');
        }

        setStocks(prev => {
          const updated = [...prev];
          const fromIdx = updated.findIndex(
            s => s.productId === movement.productId && s.warehouseId === movement.fromWarehouseId
          );
          const toIdx = updated.findIndex(
            s => s.productId === movement.productId && s.warehouseId === movement.toWarehouseId
          );

          if (fromIdx !== -1) {
            updated[fromIdx] = {
              ...updated[fromIdx],
              quantity: updated[fromIdx].quantity - movement.qty,
              lastUpdated: new Date().toISOString()
            };
          }

          if (toIdx !== -1) {
            updated[toIdx] = {
              ...updated[toIdx],
              quantity: updated[toIdx].quantity + movement.qty,
              lastUpdated: new Date().toISOString()
            };
          } else {
            const warehouse = WAREHOUSES_MOCK.find(w => w.id === movement.toWarehouseId);
            updated.push({
              id: `st-${Date.now()}-${Math.floor(Math.random() * 10000)}`,
              productId: movement.productId,
              warehouseId: movement.toWarehouseId!,
              warehouseName: warehouse?.name,
              quantity: movement.qty,
              unit: movement.unit,
              lastUpdated: new Date().toISOString()
            });
          }

          return updated;
        });
      } else if (movement.type === 'in') {
        setStocks(prev => {
          const updated = [...prev];
          const idx = updated.findIndex(
            s => s.productId === movement.productId && s.warehouseId === movement.toWarehouseId
          );

          if (idx !== -1) {
            updated[idx] = {
              ...updated[idx],
              quantity: updated[idx].quantity + movement.qty,
              lastUpdated: new Date().toISOString()
            };
          } else {
            const warehouse = WAREHOUSES_MOCK.find(w => w.id === movement.toWarehouseId);
            updated.push({
              id: `st-${Date.now()}-${Math.floor(Math.random() * 10000)}`,
              productId: movement.productId,
              warehouseId: movement.toWarehouseId!,
              warehouseName: warehouse?.name,
              quantity: movement.qty,
              unit: movement.unit,
              lastUpdated: new Date().toISOString()
            });
          }

          return updated;
        });
      } else if (movement.type === 'out' || movement.type === 'consumption') {
        const fromStock = stocks.find(
          s => s.productId === movement.productId && s.warehouseId === movement.fromWarehouseId
        );

        if (!fromStock || fromStock.quantity < movement.qty) {
          throw new Error('Insufficient stock');
        }

        setStocks(prev => {
          const updated = [...prev];
          const idx = updated.findIndex(
            s => s.productId === movement.productId && s.warehouseId === movement.fromWarehouseId
          );

          if (idx !== -1) {
            updated[idx] = {
              ...updated[idx],
              quantity: updated[idx].quantity - movement.qty,
              lastUpdated: new Date().toISOString()
            };
          }

          return updated;
        });
      } else if (movement.type === 'adjust') {
        setStocks(prev => {
          const updated = [...prev];
          const warehouseId = movement.toWarehouseId || movement.fromWarehouseId;
          const idx = updated.findIndex(
            s => s.productId === movement.productId && s.warehouseId === warehouseId
          );

          if (idx !== -1) {
            updated[idx] = {
              ...updated[idx],
              quantity: Math.max(0, updated[idx].quantity + movement.qty),
              lastUpdated: new Date().toISOString()
            };
          } else if (movement.qty > 0 && warehouseId) {
            const warehouse = WAREHOUSES_MOCK.find(w => w.id === warehouseId);
            updated.push({
              id: `st-${Date.now()}-${Math.floor(Math.random() * 10000)}`,
              productId: movement.productId,
              warehouseId,
              warehouseName: warehouse?.name,
              quantity: movement.qty,
              unit: movement.unit,
              lastUpdated: new Date().toISOString()
            });
          }

          return updated;
        });
      }

      setMovements(prev => [newMovement, ...prev]);
      return true;
    } catch (error) {
      console.error('Error adding movement:', error);
      return false;
    }
  }, [stocks]);

  const adjustStock = useCallback((params: {
    productId: string;
    warehouseId: string;
    qty: number;
    reason?: string;
    userId?: string;
  }): boolean => {
    const product = products.find(p => p.id === params.productId);
    const warehouse = WAREHOUSES_MOCK.find(w => w.id === params.warehouseId);
    
    return addMovement({
      type: 'adjust',
      productId: params.productId,
      productName: product?.name,
      toWarehouseId: params.warehouseId,
      toWarehouseName: warehouse?.name,
      qty: params.qty,
      unit: 'und',
      reason: params.reason,
      userId: params.userId,
      userName: 'Usuario'
    });
  }, [addMovement, products]);

  const transferStock = useCallback((params: {
    productId: string;
    fromWarehouseId: string;
    toWarehouseId: string;
    qty: number;
    reason?: string;
    userId?: string;
  }): boolean => {
    const product = products.find(p => p.id === params.productId);
    const fromWarehouse = WAREHOUSES_MOCK.find(w => w.id === params.fromWarehouseId);
    const toWarehouse = WAREHOUSES_MOCK.find(w => w.id === params.toWarehouseId);
    
    return addMovement({
      type: 'transfer',
      productId: params.productId,
      productName: product?.name,
      fromWarehouseId: params.fromWarehouseId,
      fromWarehouseName: fromWarehouse?.name,
      toWarehouseId: params.toWarehouseId,
      toWarehouseName: toWarehouse?.name,
      qty: params.qty,
      unit: 'und',
      reason: params.reason,
      userId: params.userId,
      userName: 'Usuario'
    });
  }, [addMovement, products]);

  const registerConsumption = useCallback((params: {
    productId: string;
    warehouseId: string;
    qty: number;
    recipe?: { productId: string; qty: number }[];
    userId?: string;
  }): boolean => {
    const product = products.find(p => p.id === params.productId);
    const warehouse = WAREHOUSES_MOCK.find(w => w.id === params.warehouseId);

    if (product?.isComposite && params.recipe) {
      for (const ingredient of params.recipe) {
        const success = addMovement({
          type: 'consumption',
          productId: ingredient.productId,
          fromWarehouseId: params.warehouseId,
          fromWarehouseName: warehouse?.name,
          qty: ingredient.qty * params.qty,
          unit: 'und',
          reason: `Consumo por preparación de ${product.name}`,
          userId: params.userId,
          userName: 'Usuario'
        });
        
        if (!success) return false;
      }
      return true;
    }

    return addMovement({
      type: 'consumption',
      productId: params.productId,
      productName: product?.name,
      fromWarehouseId: params.warehouseId,
      fromWarehouseName: warehouse?.name,
      qty: params.qty,
      unit: 'und',
      reason: 'Consumo manual',
      userId: params.userId,
      userName: 'Usuario'
    });
  }, [addMovement, products]);

  const getStockLowCount = useCallback((): number => {
    return filteredItems({ stockLowOnly: true }).length;
  }, [filteredItems]);

  return {
    stocks,
    movements,
    preferences,
    setPreferences,
    getInventoryItems,
    filteredItems,
    getStockByProduct,
    getStockByWarehouse,
    getMovementsByProduct,
    getMovementsByWarehouse,
    addMovement,
    adjustStock,
    transferStock,
    registerConsumption,
    getStockLowCount,
    warehouses: WAREHOUSES_MOCK
  };
}
