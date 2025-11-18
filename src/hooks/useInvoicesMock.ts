import { useCallback, useEffect, useRef, useState } from 'react';
import type {
  CreateCreditNoteInput,
  Customer,
  Invoice,
  InvoiceEvent,
  InvoiceSettings,
  InvoiceStatus,
  InvoiceSeries,
  Payment,
  RegisterPaymentInput,
  RefundInput,
} from '@/interfaces/billing';
import { STORAGE_KEYS } from '@/lib/storageKeys';
import { loadOrInitBillingData } from '@/lib/mockData/billing';
import Papa from 'papaparse';

export function useInvoicesMock() {
  const boot = useRef(loadOrInitBillingData());
  const [invoices, setInvoices] = useState<Invoice[]>(boot.current.invoices);
  const [customers, setCustomers] = useState<Customer[]>(boot.current.customers);
  const [series, setSeries] = useState<InvoiceSeries[]>(boot.current.series);
  const [settings, setSettings] = useState<InvoiceSettings>(boot.current.settings);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.INVOICES, JSON.stringify(invoices));
  }, [invoices]);
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.BILLING_CUSTOMERS, JSON.stringify(customers));
  }, [customers]);
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.INVOICE_SERIES, JSON.stringify(series));
  }, [series]);
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.INVOICE_SETTINGS, JSON.stringify(settings));
  }, [settings]);

  const eventsKey = STORAGE_KEYS.INVOICE_EVENTS;
  const pushEvent = useCallback((e: Omit<InvoiceEvent, 'id' | 'timestamp'> & { timestamp?: string }) => {
    const raw = localStorage.getItem(eventsKey);
    const list: InvoiceEvent[] = raw ? JSON.parse(raw) : [];
    const evt: InvoiceEvent = { id: 'evt-' + Date.now(), timestamp: e.timestamp || new Date().toISOString(), ...e };
    list.push(evt);
    localStorage.setItem(eventsKey, JSON.stringify(list));
  }, [eventsKey]);

  const calculate = useCallback((inv: Invoice): Invoice => {
    const subtotal = inv.lines.reduce((s, l) => s + l.lineBase, 0);
    const taxTotal = inv.lines.reduce((s, l) => s + l.lineTax, 0);
    const discountTotal = inv.lines.reduce((s, l) => {
      const original = l.qty * l.unitPrice;
      const disc = Math.max(0, original - l.lineBase);
      return s + disc;
    }, 0);
    const total = +(subtotal + taxTotal + inv.rounding).toFixed(2);
    return { ...inv, subtotal: +subtotal.toFixed(2), taxTotal: +taxTotal.toFixed(2), discountTotal: +discountTotal.toFixed(2), total };
  }, []);

  const getInvoice = useCallback((id: string) => invoices.find(i => i.id === id) || null, [invoices]);

  const getNextInvoiceNumber = useCallback((seriesCode: string) => {
    const s = series.find(x => x.seriesCode === seriesCode);
    const seq = (s?.lastNumber || 0) + 1;
    const pattern = s?.formatPattern || '{series}-{seq:6}';
    const seqStr = String(seq).padStart(6, '0');
    const number = pattern.replace('{series}', seriesCode).replace('{seq:6}', seqStr);
    return { seq, number };
  }, [series]);

  const reserveInvoiceNumber = useCallback((seriesCode: string) => {
    const { seq, number } = getNextInvoiceNumber(seriesCode);
    setSeries(prev => prev.map(s => s.seriesCode === seriesCode ? { ...s, lastNumber: seq } : s));
    return number;
  }, [getNextInvoiceNumber]);

  const createInvoice = useCallback((payload: Partial<Invoice>) => {
    if (!payload.customerId || !payload.lines || payload.lines.length === 0) {
      throw new Error('Factura inválida: requiere cliente y al menos una línea.');
    }
    if (!payload.dueDate) {
      throw new Error('Factura inválida: la fecha de vencimiento es obligatoria.');
    }
    const base: Invoice = calculate({
      id: 'inv-' + Date.now(),
      status: 'draft',
      date: new Date().toISOString(),
      dueDate: payload.dueDate!,
      paymentType: payload.paymentType || 'cash',
      customerId: payload.customerId!,
      customerSnapshot: payload.customerSnapshot!,
      currency: payload.currency || 'COP',
      exchangeRate: payload.exchangeRate,
      lines: payload.lines!,
      subtotal: 0, taxTotal: 0, discountTotal: 0, rounding: payload.rounding || 0,
      total: 0,
      balance: 0,
      payments: [],
      references: payload.references,
      createdBy: payload.createdBy || 'admin',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      notes: payload.notes,
      internalNotes: payload.internalNotes,
    });
    const withBalance = { ...base, balance: base.total };
    setInvoices(prev => [withBalance, ...prev]);
    pushEvent({ userId: base.createdBy, action: 'INVOICE_CREATED', payload: { id: base.id } });
    return withBalance;
  }, [calculate, pushEvent]);

  const updateInvoice = useCallback((id: string, payload: Partial<Invoice>) => {
    setInvoices(prev => prev.map(i => {
      if (i.id !== id) return i;
      const updated = calculate({ ...i, ...payload, updatedAt: new Date().toISOString() });
      // Recalcular balance al actualizar
      const totalPaid = updated.payments.reduce((s, p) => s + p.amount, 0);
      return { ...updated, balance: updated.total - totalPaid };
    }));
    pushEvent({ userId: payload.createdBy || 'admin', action: 'INVOICE_UPDATED', payload: { id } });
  }, [calculate, pushEvent]);

  const deleteInvoice = useCallback((id: string, userId = 'admin') => {
    const invoice = invoices.find(i => i.id === id);
    if (!invoice) return;
    
    // Solo se puede anular si no tiene pagos registrados
    if (invoice.payments.length > 0) {
      throw new Error('No se puede anular una factura con pagos registrados. Debe reembolsar los pagos primero.');
    }
    
    // Soft cancel
    setInvoices(prev => prev.map(i => i.id === id ? { 
      ...i, 
      status: 'cancelled', 
      cancelledAt: new Date().toISOString(),
      cancelledBy: userId,
      updatedAt: new Date().toISOString() 
    } : i));
    pushEvent({ userId, action: 'INVOICE_CANCELLED', payload: { id } });
  }, [invoices, pushEvent]);

  const issueInvoice = useCallback((id: string) => {
    setInvoices(prev => prev.map(i => {
      if (i.id !== id) return i;
      if (i.status !== 'draft') return i;
      const number = reserveInvoiceNumber(settings.defaultSeriesCode);
      // Al emitir, se eliminan las notas internas y se congela
      return { 
        ...i, 
        status: 'issued', 
        number, 
        issuedAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        internalNotes: undefined, // Eliminar notas internas al emitir
      };
    }));
    pushEvent({ userId: 'admin', action: 'INVOICE_ISSUED', payload: { id } });
  }, [reserveInvoiceNumber, settings.defaultSeriesCode, pushEvent]);

  const registerPayment = useCallback((input: RegisterPaymentInput) => {
    setInvoices(prev => prev.map(i => {
      if (i.id !== input.invoiceId) return i;
      const payment: Payment = {
        id: 'pay-' + Date.now(),
        invoiceId: i.id,
        amount: input.amount,
        method: input.method,
        reference: input.reference,
        date: input.date || new Date().toISOString(),
        receivedBy: input.userId,
        notes: input.notes,
      };
      const totalPaid = i.payments.reduce((s, p) => s + p.amount, 0) + input.amount;
      let status: InvoiceStatus = i.status;
      const total = i.total;
      if (totalPaid >= total - 1e-6) status = 'paid';
      else if (totalPaid > 0) status = 'partially_paid';
      
      const balance = total - totalPaid;
      
      return { 
        ...i, 
        payments: [...i.payments, payment], 
        status, 
        balance,
        updatedAt: new Date().toISOString() 
      };
    }));
    pushEvent({ userId: input.userId, action: 'PAYMENT_REGISTERED', payload: { invoiceId: input.invoiceId, amount: input.amount } });
  }, [pushEvent]);

  const refundInvoice = useCallback((input: RefundInput) => {
    setInvoices(prev => prev.map(i => i.id === input.invoiceId ? { ...i, status: 'refunded', updatedAt: new Date().toISOString() } : i));
    pushEvent({ userId: 'admin', action: 'INVOICE_REFUNDED', payload: input });
  }, [pushEvent]);

  const createCreditNote = useCallback((input: CreateCreditNoteInput) => {
    const original = invoices.find(i => i.id === input.invoiceId);
    if (!original) throw new Error('Factura original no encontrada');
    // Nota crédito mínima: sólo persistimos evento. (Se puede extender a entidad separada)
    pushEvent({ userId: 'admin', action: 'CREDIT_NOTE_CREATED', payload: input });
  }, [invoices, pushEvent]);

  const exportInvoicePDF = useCallback((id: string) => {
    const inv = invoices.find(i => i.id === id);
    if (!inv) return;
    const win = window.open('', '_blank');
    if (!win) return;
    const html = `<!doctype html><html><head><title>Factura ${inv.number || inv.id}</title>
      <style>
        body{font-family: ui-sans-serif, system-ui; padding:24px}
        h1{font-size:20px;margin-bottom:8px}
        table{width:100%;border-collapse:collapse}
        th,td{border-bottom:1px solid #e5e7eb;padding:8px;text-align:left;font-size:12px}
        .right{text-align:right}
      </style>
    </head><body>
      <h1>Factura ${inv.number || inv.id}</h1>
      <div>Fecha: ${new Date(inv.date).toLocaleString()}</div>
      <div>Cliente: ${inv.customerSnapshot.name}</div>
      <br/>
      <table>
        <thead><tr><th>Descripción</th><th class="right">Cant</th><th class="right">Precio</th><th class="right">Impuesto</th><th class="right">Total</th></tr></thead>
        <tbody>
          ${inv.lines.map(l => `<tr><td>${l.description}</td><td class="right">${l.qty}</td><td class="right">${l.unitPrice.toFixed(2)}</td><td class="right">${l.lineTax.toFixed(2)}</td><td class="right">${l.lineTotal.toFixed(2)}</td></tr>`).join('')}
        </tbody>
      </table>
      <div style="margin-top:12px;text-align:right">Subtotal: ${inv.subtotal.toFixed(2)}</div>
      <div style="text-align:right">Impuestos: ${inv.taxTotal.toFixed(2)}</div>
      <div style="text-align:right">Redondeo: ${inv.rounding.toFixed(2)}</div>
      <div style="font-weight:bold;text-align:right">Total: ${inv.total.toFixed(2)}</div>
      <script>window.print();</script>
    </body></html>`;
    win.document.write(html);
    win.document.close();
  }, [invoices]);

  const exportInvoicesCSV = useCallback((filter?: { status?: InvoiceStatus; seriesCode?: string; dateFrom?: string; dateTo?: string; q?: string }) => {
    const txt = (filter?.q || '').trim().toLowerCase();
    const from = filter?.dateFrom ? new Date(filter.dateFrom + 'T00:00:00') : null;
    const to = filter?.dateTo ? new Date(filter.dateTo + 'T23:59:59') : null;
    const data = invoices
      .filter(i => !filter?.status || i.status === filter.status)
      .filter(i => !filter?.seriesCode || (i.number && i.number.startsWith(filter.seriesCode + '-')))
      .filter(i => !from || new Date(i.date) >= from)
      .filter(i => !to || new Date(i.date) <= to)
      .filter(i => !txt || (i.number || '').toLowerCase().includes(txt) || i.customerSnapshot.name.toLowerCase().includes(txt))
      .map(i => ({
        id: i.id,
        number: i.number || '',
        date: i.date,
        customer: i.customerSnapshot.name,
        subtotal: i.subtotal,
        taxTotal: i.taxTotal,
        discountTotal: i.discountTotal,
        rounding: i.rounding,
        total: i.total,
        status: i.status,
      }));
    const csv = Papa.unparse(data);
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = 'invoices.csv'; a.click();
    URL.revokeObjectURL(url);
  }, [invoices]);

  return {
    // state
    invoices, customers, series, settings,
    // getters
    getInvoice,
    // create/update/delete
    createInvoice, updateInvoice, deleteInvoice,
    // lifecycle
    issueInvoice, registerPayment, refundInvoice, createCreditNote,
    // exports
    exportInvoicePDF, exportInvoicesCSV,
    // series helpers
    getNextInvoiceNumber, reserveInvoiceNumber,
    // settings
    setSettings,
    // imports
    importCustomers: (rows: Partial<Customer>[]) => {
      const errors: { row: any; error: string }[] = [];
      const valid: Customer[] = [];
      rows.slice(0, 1000).forEach((r, i) => {
        const name = (r.name || '').toString().trim();
        const documentNumber = (r.documentNumber || '').toString().trim();
        if (!name || name.length < 2) { errors.push({ row: r, error: 'name requerido (>=2)' }); return; }
        if (!documentNumber) { errors.push({ row: r, error: 'documentNumber requerido' }); return; }
        valid.push({
          id: 'cus-' + Date.now() + '-' + i,
          name,
          documentType: (r.documentType as any) || 'CC',
          documentNumber,
          address: r.address?.toString(),
          email: r.email?.toString(),
          phone: r.phone?.toString(),
          taxRegime: (r.taxRegime as any) || undefined,
          type: (r.type as any) || 'individual',
          extraFields: r.extraFields as any,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        });
      });
      if (valid.length) setCustomers(prev => [...valid, ...prev]);
      return { success: valid.length, errors };
    },
  } as const;
}
