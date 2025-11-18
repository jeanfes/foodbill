export const STORAGE_KEYS = {
  PRODUCTS: 'mock_products_v1',
  PRODUCTS_PREFS: 'products_prefs_v1',
  BILLING_CUSTOMERS: 'billing_customers_v1',
  INVOICES: 'billing_invoices_v1',
  INVOICE_SERIES: 'billing_series_v1',
  INVOICE_EVENTS: 'billing_events_v1',
  INVOICE_SETTINGS: 'billing_settings_v1',
} as const;

export type StorageKey = (typeof STORAGE_KEYS)[keyof typeof STORAGE_KEYS];