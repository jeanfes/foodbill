// Tipos para el módulo de facturación (frontend-only)

export type CurrencyCode = 'COP' | 'USD' | 'EUR';

export interface Customer {
  id: string;
  name: string;
  documentType: 'CC' | 'CE' | 'NIT' | 'PAS';
  documentNumber: string;
  address?: string;
  email?: string;
  phone?: string;
  taxRegime?: 'simplified' | 'common' | 'special' | string;
  type: 'individual' | 'company';
  extraFields?: Record<string, string | number | boolean | null>;
  createdAt?: string;
  updatedAt?: string;
}

export type PaymentType = 'cash' | 'credit';

export interface InvoiceLine {
  id: string;
  productId?: string;
  description: string;
  qty: number;
  unit: string;
  unitPrice: number;
  discountAmount?: number; // valor absoluto
  discountPercent?: number; // 0-100
  taxRate: number; // %
  lineBase: number; // calculado
  lineTax: number; // calculado
  lineTotal: number; // calculado
}

export type PaymentMethod = 'cash' | 'card' | 'transfer' | 'other';
export type PaymentStatus = 'pending' | 'confirmed' | 'failed';

export interface Payment {
  id: string;
  invoiceId: string;
  amount: number;
  method: PaymentMethod;
  reference?: string;
  cashboxId?: string;
  date: string;
  receivedBy: string;
  notes?: string;
  status: PaymentStatus;
}

export interface InvoiceSeries {
  id: string;
  seriesCode: string; // ej: "FV"
  lastNumber: number; // último correlativo emitido
  formatPattern: string; // ej: "{series}-{seq:6}"
}

export type InvoiceStatus = 'draft' | 'issued' | 'partially_paid' | 'paid' | 'cancelled';

export interface InvoiceCustomerSnapshot {
  id: string;
  name: string;
  documentType?: string;
  documentNumber?: string;
  address?: string;
  phone?: string;
  email?: string;
}

export interface Invoice {
  id: string;
  number?: string; // serie + seq
  status: InvoiceStatus;
  date: string;
  dueDate: string; // Obligatoria según requerimientos
  paymentType: PaymentType; // 'cash' | 'credit'
  customerId: string;
  customerSnapshot: InvoiceCustomerSnapshot;
  currency: CurrencyCode;
  exchangeRate?: number;
  lines: InvoiceLine[];
  subtotal: number;
  taxTotal: number;
  discountTotal: number;
  rounding: number;
  total: number;
  balance: number; // Saldo pendiente
  payments: Payment[];
  references?: { relatedInvoiceId?: string; reason?: string };
  createdBy: string;
  createdAt: string;
  updatedAt: string;
  issuedAt?: string; // Fecha de emisión
  cancelledAt?: string; // Fecha de anulación
  cancelledBy?: string; // Usuario que anuló
  notes?: string;
  internalNotes?: string; // Notas internas (solo borrador)
}

export interface CreditNote extends Invoice {
  references: { relatedInvoiceId: string; reason?: string };
}

export interface InvoiceEvent {
  id: string;
  userId: string;
  action: string;
  timestamp: string;
  payload?: any;
}

export interface InvoiceSettings {
  roundingStep: number; // ej 0.01
  defaultSeriesCode: string;
}

export interface RegisterPaymentInput {
  invoiceId: string;
  amount: number;
  method: PaymentMethod;
  reference?: string;
  cashboxId?: string;
  notes?: string;
  userId: string;
  date?: string; // Opcional, por defecto hoy
  idempotencyKey?: string; // Para backend futuro
}

export interface RefundInput {
  invoiceId: string;
  amount: number;
  reason?: string;
}

export interface CreateCreditNoteInput {
  invoiceId: string;
  lines: Pick<InvoiceLine, 'description' | 'qty' | 'unit' | 'unitPrice' | 'discountAmount' | 'discountPercent' | 'taxRate'>[];
  reason?: string;
}
