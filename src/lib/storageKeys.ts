export const STORAGE_KEYS = {
  PRODUCTS: 'mock_products_v1',
  PRODUCTS_PREFS: 'products_prefs_v1',
} as const;

export type StorageKey = (typeof STORAGE_KEYS)[keyof typeof STORAGE_KEYS];