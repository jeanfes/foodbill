import type { Customer, Invoice, InvoiceSeries, InvoiceSettings, InvoiceLine, Payment } from '@/interfaces/billing';
import { STORAGE_KEYS } from '@/lib/storageKeys';

function nowIso(offsetDays = 0): string {
  const d = new Date();
  d.setDate(d.getDate() + offsetDays);
  return d.toISOString();
}

export function getInitialBillingSettings(): InvoiceSettings {
  return { roundingStep: 0.01, defaultSeriesCode: 'FV' };
}

export function getInitialSeries(): InvoiceSeries[] {
  return [
    { id: 's-1', seriesCode: 'FV', lastNumber: 100025, formatPattern: '{series}-{seq:6}' },
  ];
}

export function getInitialCustomers(): Customer[] {
  return [
    { id: 'cus-1', name: 'Juan Pérez', documentType: 'CC', documentNumber: '10101010', email: 'juan@example.com', phone: '3001112233', type: 'individual', address: 'Calle 1 #2-3', createdAt: nowIso(-120), updatedAt: nowIso(-10) },
    { id: 'cus-2', name: 'María Gómez', documentType: 'CC', documentNumber: '20202020', email: 'maria@example.com', phone: '3002223344', type: 'individual', address: 'Carrera 10 #20-30', createdAt: nowIso(-200), updatedAt: nowIso(-5) },
    { id: 'cus-3', name: 'Empresa XYZ SAS', documentType: 'NIT', documentNumber: '900123456', email: 'contacto@xyz.com', phone: '6015556677', type: 'company', taxRegime: 'common', address: 'Av Principal 100-200', createdAt: nowIso(-300), updatedAt: nowIso(-1) },
    { id: 'cus-4', name: 'Carlos Ruiz', documentType: 'CC', documentNumber: '30303030', type: 'individual', phone: '3009998888', createdAt: nowIso(-40), updatedAt: nowIso(-2) },
    { id: 'cus-5', name: 'Comercial ABC LTDA', documentType: 'NIT', documentNumber: '901777666', type: 'company', email: 'ventas@abc.com', createdAt: nowIso(-60), updatedAt: nowIso(-3) },
  ];
}

function line(id: string, p: { desc: string; qty: number; unit: string; price: number; taxRate: number; disc?: number }): InvoiceLine {
  const discountAmount = p.disc ?? 0;
  const base = p.qty * p.price - discountAmount;
  const tax = +(base * (p.taxRate / 100)).toFixed(2);
  const total = +(base + tax).toFixed(2);
  return {
    id,
    description: p.desc,
    qty: p.qty,
    unit: p.unit,
    unitPrice: p.price,
    discountAmount,
    taxRate: p.taxRate,
    lineBase: +base.toFixed(2),
    lineTax: tax,
    lineTotal: total,
  };
}

export function getInitialInvoices(customers: Customer[]): Invoice[] {
  const c1 = customers[0];
  const c2 = customers[2];
  const c3 = customers[1];

  const inv1: Invoice = {
    id: 'inv-1',
    number: 'FV-000101',
    status: 'paid',
    date: nowIso(-15),
    dueDate: nowIso(-10),
    paymentType: 'cash',
    customerId: c1.id,
    customerSnapshot: { id: c1.id, name: c1.name, documentType: c1.documentType, documentNumber: c1.documentNumber, address: c1.address, phone: c1.phone, email: c1.email },
    currency: 'COP',
    lines: [
      line('l-1', { desc: 'Hamburguesa Clásica', qty: 2, unit: 'u', price: 18000, taxRate: 5 }),
      line('l-2', { desc: 'Gaseosa 500ml', qty: 2, unit: 'u', price: 3500, taxRate: 19 }),
    ],
    subtotal: 0, taxTotal: 0, discountTotal: 0, rounding: 0, total: 0, balance: 0,
    payments: [],
    createdBy: 'admin',
    createdAt: nowIso(-15),
    updatedAt: nowIso(-15),
    issuedAt: nowIso(-15),
  };

  const inv2: Invoice = {
    id: 'inv-2',
    number: 'FV-000102',
    status: 'issued',
    date: nowIso(-5),
    dueDate: nowIso(+25),
    paymentType: 'credit',
    customerId: c2.id,
    customerSnapshot: { id: c2.id, name: c2.name, documentType: c2.documentType, documentNumber: c2.documentNumber, address: c2.address, phone: c2.phone },
    currency: 'COP',
    lines: [
      line('l-3', { desc: 'Servicio de Catering', qty: 1, unit: 'serv', price: 150000, taxRate: 19, disc: 10000 }),
    ],
    subtotal: 0, taxTotal: 0, discountTotal: 0, rounding: 0, total: 0, balance: 0,
    payments: [],
    createdBy: 'admin',
    createdAt: nowIso(-5),
    updatedAt: nowIso(-5),
    issuedAt: nowIso(-5),
  };

  const inv3: Invoice = {
    id: 'inv-3',
    status: 'partially_paid',
    date: nowIso(-2),
    dueDate: nowIso(+15),
    paymentType: 'credit',
    customerId: c3.id,
    customerSnapshot: { id: c3.id, name: c3.name, address: c3.address, phone: c3.phone },
    currency: 'COP',
    lines: [
      line('l-4', { desc: 'Postre de chocolate', qty: 3, unit: 'u', price: 6000, taxRate: 5 }),
    ],
    subtotal: 0, taxTotal: 0, discountTotal: 0, rounding: 0, total: 0, balance: 0,
    payments: [],
    createdBy: 'admin',
    createdAt: nowIso(-2),
    updatedAt: nowIso(-2),
  };

  const recompute = (inv: Invoice) => {
    const subtotal = inv.lines.reduce((s, l) => s + l.lineBase, 0);
    const taxTotal = inv.lines.reduce((s, l) => s + l.lineTax, 0);
    const discountTotal = inv.lines.reduce((s, l) => s + (l.discountAmount || 0), 0);
    const total = +(subtotal + taxTotal + inv.rounding).toFixed(2);
    inv.subtotal = +subtotal.toFixed(2);
    inv.taxTotal = +taxTotal.toFixed(2);
    inv.discountTotal = +discountTotal.toFixed(2);
    inv.total = total;
    inv.balance = total; // Inicialmente, el saldo es el total
  };

  [inv1, inv2, inv3].forEach(recompute);

  // pagos para estados
  const pay1: Payment = { id: 'pay-1', invoiceId: inv1.id, amount: inv1.total, method: 'cash', date: nowIso(-15), receivedBy: 'admin' };
  inv1.payments.push(pay1);
  inv1.balance = 0; // Totalmente pagada

  const partialAmount = +(inv3.total / 2).toFixed(2);
  const pay3: Payment = { id: 'pay-2', invoiceId: inv3.id, amount: partialAmount, method: 'card', date: nowIso(-2), receivedBy: 'admin' };
  inv3.payments.push(pay3);
  inv3.balance = inv3.total - partialAmount; // Saldo parcial

  return [inv1, inv2, inv3];
}

export function loadOrInitBillingData() {
  const rawCustomers = localStorage.getItem(STORAGE_KEYS.BILLING_CUSTOMERS);
  const rawSeries = localStorage.getItem(STORAGE_KEYS.INVOICE_SERIES);
  const rawInvoices = localStorage.getItem(STORAGE_KEYS.INVOICES);
  const rawSettings = localStorage.getItem(STORAGE_KEYS.INVOICE_SETTINGS);

  const customers = rawCustomers ? (JSON.parse(rawCustomers) as Customer[]) : getInitialCustomers();
  const series = rawSeries ? (JSON.parse(rawSeries) as InvoiceSeries[]) : getInitialSeries();
  const settings = rawSettings ? (JSON.parse(rawSettings) as InvoiceSettings) : getInitialBillingSettings();
  const invoices = rawInvoices ? (JSON.parse(rawInvoices) as Invoice[]) : getInitialInvoices(customers);

  if (!rawCustomers) localStorage.setItem(STORAGE_KEYS.BILLING_CUSTOMERS, JSON.stringify(customers));
  if (!rawSeries) localStorage.setItem(STORAGE_KEYS.INVOICE_SERIES, JSON.stringify(series));
  if (!rawSettings) localStorage.setItem(STORAGE_KEYS.INVOICE_SETTINGS, JSON.stringify(settings));
  if (!rawInvoices) localStorage.setItem(STORAGE_KEYS.INVOICES, JSON.stringify(invoices));

  return { customers, series, settings, invoices };
}
