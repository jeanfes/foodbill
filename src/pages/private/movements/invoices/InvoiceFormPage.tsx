import { useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { motion, AnimatePresence, Reorder } from 'framer-motion';
import { useInvoicesMock } from '@/hooks/useInvoicesMock';
import { useProductsMock } from '@/hooks/useProductsMock';
import { useToast } from '@/components/ui/toast';
import type { InvoiceLine, Customer, PaymentType, Payment } from '@/interfaces/billing';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { AlertTriangle, CheckCircle2, Plus, ArrowLeft, FileText, User, CalendarIcon } from 'lucide-react';
import { CustomerTypeahead } from './components/CustomerTypeahead';
import { InvoiceSummary } from './components/InvoiceSummary';
import { InvoicePrintView } from './components/InvoicePrintView';
import { PaymentModal } from './components/PaymentModal';
import { PaymentHistoryList } from './components/PaymentHistoryList';
import { PaymentReceipt } from './components/PaymentReceipt';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { InvoiceLineRow } from './components/InvoiceLineRow';

export default function InvoiceFormPage() {
    const navigate = useNavigate();
    const { id } = useParams<{ id: string }>();
    const { invoices, customers, settings, createInvoice, updateInvoice, issueInvoice, registerPayment, importCustomers, getNextInvoiceNumber } = useInvoicesMock();
    const { products } = useProductsMock();
    const { show: showToast } = useToast();

    const editing = useMemo(() => id ? invoices.find(i => i.id === id) || null : null, [invoices, id]);

    const [customerId, setCustomerId] = useState(editing?.customerId || customers[0]?.id || '');
    const customer = useMemo(() => customers.find(c => c.id === customerId), [customers, customerId]);
    const [paymentType, setPaymentType] = useState<PaymentType>(editing?.paymentType || 'cash');
    const [dueDate, setDueDate] = useState<Date | undefined>(editing?.dueDate ? new Date(editing.dueDate) : undefined);
    const [lines, setLines] = useState<InvoiceLine[]>(editing?.lines || []);
    const [rounding, setRounding] = useState<number>(editing?.rounding || 0);
    const [notes, setNotes] = useState(editing?.notes || '');
    const [internalNotes, setInternalNotes] = useState(editing?.internalNotes || '');
    const [saving, setSaving] = useState(false);
    const [showNewCustomerModal, setShowNewCustomerModal] = useState(false);
    const [showIssueModal, setShowIssueModal] = useState(false);
    const [showPrintView, setShowPrintView] = useState(false);
    const [showPaymentModal, setShowPaymentModal] = useState(false);
    const [showReceiptModal, setShowReceiptModal] = useState(false);
    const [selectedPayment, setSelectedPayment] = useState<Payment | null>(null);

    const isDraft = !editing || editing.status === 'draft';
    const canRegisterPayment = !!(editing && (editing.status === 'issued' || editing.status === 'partially_paid') && editing.balance > 0);

    useEffect(() => {
        if (editing) {
            setCustomerId(editing.customerId);
            setPaymentType(editing.paymentType);
            setDueDate(editing.dueDate ? new Date(editing.dueDate) : undefined);
            setLines(editing.lines);
            setRounding(editing.rounding || 0);
            setNotes(editing.notes || '');
            setInternalNotes(editing.internalNotes || '');
        }
    }, [editing]);

    // Auto-agregar primera línea si está vacío
    useEffect(() => {
        if (lines.length === 0 && !editing) {
            addLine();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    function defaultTaxRateByProductName(name: string): number {
        const n = name.toLowerCase();
        if (n.includes('coca') || n.includes('gaseosa') || n.includes('bebida')) return 19;
        if (n.includes('servicio')) return 19;
        if (n.includes('postre')) return 5;
        if (n.includes('hamburguesa') || n.includes('plato')) return 5;
        return 0;
    }

    const addLine = () => {
        const p = products[0];
        const desc = p?.name || '';
        const taxRate = p ? defaultTaxRateByProductName(p.name) : 0;
        const qty = 1;
        const price = p?.price ?? 0;
        const base = qty * price;
        const tax = +(base * (taxRate / 100)).toFixed(2);
        const total = +(base + tax).toFixed(2);

        setLines(prev => [...prev, {
            id: 'l-' + Date.now() + '-' + Math.random().toString(36).slice(2, 5),
            productId: p?.id,
            description: desc,
            qty,
            unit: 'u',
            unitPrice: price,
            taxRate,
            lineBase: +base.toFixed(2),
            lineTax: tax,
            lineTotal: total
        }]);
    };

    const updateLine = (lineId: string, patch: Partial<InvoiceLine>) => {
        setLines(prev => prev.map(l => {
            if (l.id !== lineId) return l;
            const next = { ...l, ...patch } as InvoiceLine;
            const discount = next.discountAmount || (next.discountPercent ? +(next.qty * next.unitPrice * (next.discountPercent / 100)).toFixed(2) : 0);
            const base = Math.max(0, next.qty * next.unitPrice - discount);
            const tax = +(base * (next.taxRate / 100)).toFixed(2);
            const total = +(base + tax).toFixed(2);
            return { ...next, lineBase: +base.toFixed(2), lineTax: tax, lineTotal: total };
        }));
    };

    const removeLine = (lineId: string) => {
        if (lines.length > 1) {
            setLines(prev => prev.filter(l => l.id !== lineId));
        }
    };

    const duplicateLine = (lineId: string) => {
        const lineToDuplicate = lines.find(l => l.id === lineId);
        if (!lineToDuplicate) return;

        const newLine: InvoiceLine = {
            ...lineToDuplicate,
            id: 'l-' + Date.now() + '-' + Math.random().toString(36).slice(2, 5),
        };

        setLines(prev => {
            const index = prev.findIndex(l => l.id === lineId);
            const newLines = [...prev];
            newLines.splice(index + 1, 0, newLine);
            return newLines;
        });
    };

    const subtotal = lines.reduce((s, l) => s + l.lineBase, 0);
    const taxTotal = lines.reduce((s, l) => s + l.lineTax, 0);
    const discountTotal = lines.reduce((s, l) => s + Math.max(0, l.qty * l.unitPrice - l.lineBase), 0);
    const total = +(subtotal + taxTotal + rounding).toFixed(2);

    const onSaveDraft = async () => {
        if (!customer) {
            alert('Debe seleccionar un cliente');
            return;
        }

        if (!dueDate) {
            alert('Debe especificar la fecha de vencimiento');
            return;
        }

        const validLines = lines.filter(l => l.description.trim() && l.qty > 0);
        if (validLines.length === 0) {
            alert('Debe agregar al menos una línea válida');
            return;
        }

        setSaving(true);
        try {
            if (!editing) {
                createInvoice({
                    customerId: customer.id,
                    customerSnapshot: {
                        id: customer.id,
                        name: customer.name,
                        documentType: customer.documentType,
                        documentNumber: customer.documentNumber,
                        address: customer.address,
                        phone: customer.phone,
                        email: customer.email
                    },
                    currency: 'COP',
                    paymentType,
                    dueDate: dueDate.toISOString(),
                    lines: validLines,
                    rounding,
                    notes,
                    internalNotes,
                });
            } else {
                updateInvoice(editing.id, {
                    lines: validLines,
                    notes,
                    internalNotes,
                    rounding,
                    paymentType,
                    dueDate: dueDate.toISOString()
                });
            }
            navigate('/movements/invoices');
        } finally {
            setSaving(false);
        }
    };

    const handleIssueInvoice = () => {
        if (!customer) {
            alert('Debe seleccionar un cliente');
            return;
        }

        if (!dueDate) {
            alert('Debe especificar la fecha de vencimiento');
            return;
        }

        const validLines = lines.filter(l => l.description.trim() && l.qty > 0 && l.unitPrice > 0);
        if (validLines.length === 0) {
            alert('Debe agregar al menos una línea válida con cantidad y precio mayor a cero');
            return;
        }

        const invoiceDate = new Date(editing?.date || new Date());
        if (dueDate < invoiceDate) {
            alert('La fecha de vencimiento no puede ser anterior a la fecha de factura');
            return;
        }

        setShowIssueModal(true);
    };

    const confirmIssue = () => {
        if (editing) {
            issueInvoice(editing.id);
            setShowIssueModal(false);
            navigate('/movements/invoices');
        }
    };

    const handleRegisterPayment = async (paymentData: any) => {
        if (!editing) return;

        try {
            registerPayment({
                invoiceId: editing.id,
                userId: 'admin', // TODO: usar usuario actual del auth
                ...paymentData
            });

            const newBalance = editing.balance - paymentData.amount;
            const fmt = (n: number) => new Intl.NumberFormat('es-CO', {
                style: 'currency',
                currency: 'COP',
                maximumFractionDigits: 2
            }).format(n);

            showToast(
                `Pago registrado: ${fmt(paymentData.amount)} — Saldo restante: ${fmt(Math.max(0, newBalance))}`,
                'success'
            );
        } catch (error) {
            showToast(
                (error as Error).message || 'Error al registrar el pago',
                'error'
            );
            throw error;
        }
    };

    const handlePrintReceipt = (payment: Payment) => {
        setSelectedPayment(payment);
        setShowReceiptModal(true);
    };

    const [newCustomer, setNewCustomer] = useState({
        name: '',
        documentType: 'CC' as Customer['documentType'],
        documentNumber: '',
        email: '',
        phone: '',
        address: '',
        type: 'individual' as Customer['type']
    });

    const handleCreateCustomer = () => {
        if (!newCustomer.name.trim() || !newCustomer.documentNumber.trim()) {
            alert('Nombre y documento son obligatorios');
            return;
        }

        const { success } = importCustomers([newCustomer]);
        if (success > 0) {
            const created = customers.find(c => c.documentNumber === newCustomer.documentNumber);
            if (created) setCustomerId(created.id);
            setShowNewCustomerModal(false);
            setNewCustomer({ name: '', documentType: 'CC', documentNumber: '', email: '', phone: '', address: '', type: 'individual' });
        }
    };

    if (showPrintView && editing) {
        return <InvoicePrintView invoice={editing} onClose={() => setShowPrintView(false)} />;
    }

    return (
        <div className="min-h-screen bg-background pb-8">
            {/* Header */}
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.25 }}
                className="sticky top-0 z-40 bg-background border-b"
            >
                <div className="py-4 flex items-center justify-between">
                    <div className="flex items-start gap-4">
                        <Button variant="ghost" size="icon" onClick={() => navigate('/movements/invoices')}>
                            <ArrowLeft className="h-5 w-5" />
                        </Button>
                        <div>
                            <h1 className="text-2xl font-bold">
                                {editing ? 'Editar factura' : 'Nueva factura'}
                            </h1>
                            <p className="text-sm text-muted-foreground">
                                {editing && editing.number ? `#${editing.number}` : 'Borrador'}
                            </p>
                        </div>
                    </div>
                    <div className="flex gap-2">
                        <Button variant="outline" onClick={() => navigate('/movements/invoices')}>
                            Cancelar
                        </Button>
                    </div>
                </div>
            </motion.div>

            {/* Content */}
            <div className="pt-6">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Main content - 2/3 */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Cliente */}
                        <Card className="p-6">
                            <div className="flex items-center gap-2">
                                <User className="h-5 w-5 text-muted-foreground" />
                                <h2 className="text-lg font-semibold">Cliente</h2>
                            </div>

                            <CustomerTypeahead
                                customers={customers}
                                selectedCustomerId={customerId}
                                onSelect={setCustomerId}
                                onCreateNew={() => setShowNewCustomerModal(true)}
                                disabled={!isDraft}
                            />

                            {customer && (
                                <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    className="bg-muted/50 rounded-lg p-4 space-y-2"
                                >
                                    <div className="font-medium text-base">{customer.name}</div>
                                    <div className="text-sm text-muted-foreground">
                                        {customer.documentType}-{customer.documentNumber}
                                    </div>
                                    {customer.email && (
                                        <div className="text-sm text-muted-foreground">{customer.email}</div>
                                    )}
                                    <div className="pt-2">
                                        <Badge variant="outline">Moneda: COP</Badge>
                                    </div>
                                </motion.div>
                            )}
                        </Card>

                        {/* Tipo de pago y fecha de vencimiento */}
                        <Card className="p-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <Label htmlFor="paymentType">Tipo de pago *</Label>
                                    <Select
                                        value={paymentType}
                                        onValueChange={(v: PaymentType) => setPaymentType(v)}
                                        disabled={!isDraft}
                                    >
                                        <SelectTrigger id="paymentType">
                                            <SelectValue placeholder="Seleccionar tipo de pago" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="cash">Contado</SelectItem>
                                            <SelectItem value="credit">Crédito</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div className="space-y-2">
                                    <Label>Fecha de vencimiento *</Label>
                                    <Popover>
                                        <PopoverTrigger asChild>
                                            <Button
                                                variant="outline"
                                                disabled={!isDraft}
                                                className={cn(
                                                    "w-full justify-start text-left font-normal",
                                                    !dueDate && "text-muted-foreground"
                                                )}
                                            >
                                                <CalendarIcon className="mr-2 h-4 w-4" />
                                                {dueDate ? format(dueDate, "PPP", { locale: es }) : <span>Seleccionar fecha</span>}
                                            </Button>
                                        </PopoverTrigger>
                                        <PopoverContent className="w-auto p-0" align="start">
                                            <Calendar
                                                mode="single"
                                                selected={dueDate}
                                                onSelect={setDueDate}
                                                initialFocus
                                                locale={es}
                                            />
                                        </PopoverContent>
                                    </Popover>
                                    {paymentType === 'cash' && dueDate && (
                                        <p className="text-xs text-muted-foreground">
                                            Para pago de contado, la fecha de vencimiento es informativa
                                        </p>
                                    )}
                                </div>
                            </div>
                        </Card>

                        {/* Líneas */}
                        <Card className="p-6">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <FileText className="h-5 w-5 text-muted-foreground" />
                                    <h2 className="text-lg font-semibold">Líneas de factura</h2>
                                    <Badge variant="secondary">{lines.length}</Badge>
                                </div>
                                <Button onClick={addLine} size="sm" disabled={!isDraft}>
                                    <Plus className="h-4 w-4 mr-2" /> Agregar línea
                                </Button>
                            </div>

                            <Reorder.Group axis="y" values={lines} onReorder={setLines} className="space-y-3">
                                <AnimatePresence initial={false}>
                                    {lines.map((line, index) => (
                                        <InvoiceLineRow
                                            key={line.id}
                                            line={line}
                                            index={index}
                                            onUpdate={updateLine}
                                            onRemove={removeLine}
                                            onDuplicate={duplicateLine}
                                            disabled={!isDraft}
                                        />
                                    ))}
                                </AnimatePresence>
                                {lines.length === 0 && (
                                    <div className="border border-dashed rounded-lg p-8 text-center text-muted-foreground">
                                        Sin líneas. Usa el botón "Agregar línea" para añadir productos.
                                    </div>
                                )}
                            </Reorder.Group>
                        </Card>

                        {/* Notas */}
                        <Card className="p-6 space-y-4">
                            <div className="mb-0">
                                <h2 className="text-lg font-semibold mb-2">Notas (visibles para el cliente)</h2>
                                <Textarea
                                    value={notes}
                                    onChange={(e) => setNotes(e.target.value)}
                                    placeholder="Observaciones, condiciones de pago, etc..."
                                    className="min-h-24"
                                    disabled={!isDraft}
                                />
                            </div>

                            {isDraft && (
                                <div>
                                    <h2 className="text-lg font-semibold mb-2">Notas internas (solo borrador)</h2>
                                    <Textarea
                                        value={internalNotes}
                                        onChange={(e) => setInternalNotes(e.target.value)}
                                        placeholder="Notas internas que no se mostrarán al cliente ni en la factura emitida..."
                                        className="min-h-20"
                                    />
                                    <p className="text-xs text-muted-foreground mt-2">
                                        Estas notas se eliminan automáticamente al emitir la factura
                                    </p>
                                </div>
                            )}
                        </Card>
                    </div>

                    {/* Sidebar - 1/3 */}
                    <div className="lg:col-span-1 space-y-6">
                        <InvoiceSummary
                            subtotal={subtotal}
                            taxTotal={taxTotal}
                            discountTotal={discountTotal}
                            rounding={rounding}
                            total={total}
                            balance={editing ? editing.balance : total}
                            payments={editing?.payments || []}
                            roundingStep={settings.roundingStep ?? 1}
                            paymentType={paymentType}
                            dueDate={dueDate}
                            onRoundingChange={isDraft ? setRounding : undefined}
                            onSaveDraft={isDraft ? onSaveDraft : undefined}
                            onIssue={editing && editing.status === 'draft' ? handleIssueInvoice : undefined}
                            onPrint={editing && editing.status !== 'draft' ? () => setShowPrintView(true) : undefined}
                            onRegisterPayment={canRegisterPayment ? () => setShowPaymentModal(true) : undefined}
                            saving={saving}
                            canIssue={!editing || editing.status === 'draft'}
                            canPrint={!!editing && editing.status !== 'draft'}
                            canRegisterPayment={canRegisterPayment}
                            status={editing?.status}
                        />

                        {/* Historial de pagos */}
                        {editing && editing.payments.length > 0 && (
                            <PaymentHistoryList
                                payments={editing.payments}
                                invoice={editing}
                                onPrintReceipt={handlePrintReceipt}
                            />
                        )}
                    </div>
                </div>
            </div>

            {/* Modal: Nuevo Cliente */}
            <Dialog open={showNewCustomerModal} onOpenChange={setShowNewCustomerModal}>
                <DialogContent className="max-w-md">
                    <DialogHeader>
                        <DialogTitle>Nuevo cliente</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                        <div>
                            <label className="text-sm font-medium mb-1 block">Nombre *</label>
                            <Input value={newCustomer.name} onChange={(e) => setNewCustomer(prev => ({ ...prev, name: e.target.value }))} />
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                            <div>
                                <label className="text-sm font-medium mb-1 block">Tipo *</label>
                                <Select value={newCustomer.documentType} onValueChange={(v) => setNewCustomer(prev => ({ ...prev, documentType: v as Customer['documentType'] }))}>
                                    <SelectTrigger><SelectValue /></SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="CC">CC</SelectItem>
                                        <SelectItem value="CE">CE</SelectItem>
                                        <SelectItem value="NIT">NIT</SelectItem>
                                        <SelectItem value="PAS">Pasaporte</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div>
                                <label className="text-sm font-medium mb-1 block">Número *</label>
                                <Input value={newCustomer.documentNumber} onChange={(e) => setNewCustomer(prev => ({ ...prev, documentNumber: e.target.value }))} />
                            </div>
                        </div>
                        <div>
                            <label className="text-sm font-medium mb-1 block">Email</label>
                            <Input type="email" value={newCustomer.email} onChange={(e) => setNewCustomer(prev => ({ ...prev, email: e.target.value }))} />
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                            <div>
                                <label className="text-sm font-medium mb-1 block">Teléfono</label>
                                <Input value={newCustomer.phone} onChange={(e) => setNewCustomer(prev => ({ ...prev, phone: e.target.value }))} />
                            </div>
                            <div>
                                <label className="text-sm font-medium mb-1 block">Tipo</label>
                                <Select value={newCustomer.type} onValueChange={(v) => setNewCustomer(prev => ({ ...prev, type: v as Customer['type'] }))}>
                                    <SelectTrigger><SelectValue /></SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="individual">Individual</SelectItem>
                                        <SelectItem value="company">Empresa</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                        <div>
                            <label className="text-sm font-medium mb-1 block">Dirección</label>
                            <Input value={newCustomer.address} onChange={(e) => setNewCustomer(prev => ({ ...prev, address: e.target.value }))} />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setShowNewCustomerModal(false)}>Cancelar</Button>
                        <Button onClick={handleCreateCustomer} disabled={!newCustomer.name.trim() || !newCustomer.documentNumber.trim()}>
                            <CheckCircle2 className="h-4 w-4 mr-2" />Guardar
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Modal: Registrar Pago */}
            {editing && (
                <PaymentModal
                    open={showPaymentModal}
                    onOpenChange={setShowPaymentModal}
                    invoice={editing}
                    onConfirm={handleRegisterPayment}
                    userId="admin"
                />
            )}

            {/* Modal: Confirmar Emisión */}
            <Dialog open={showIssueModal} onOpenChange={setShowIssueModal}>
                <DialogContent className="max-w-md">
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-2">
                            <AlertTriangle className="h-5 w-5 text-amber-600" /> Confirmar emisión
                        </DialogTitle>
                        <DialogDescription>
                            Asignará un número oficial y bloqueará ediciones posteriores.
                        </DialogDescription>
                    </DialogHeader>
                    {editing && (
                        <div className="space-y-4">
                            <div className="rounded-md border p-3 space-y-2 text-sm">
                                <div className="flex justify-between">
                                    <span className="text-muted-foreground">Número:</span>
                                    <Badge variant="default">{getNextInvoiceNumber(settings.defaultSeriesCode).number}</Badge>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-muted-foreground">Cliente:</span>
                                    <span className="font-medium">{editing.customerSnapshot.name}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-muted-foreground">Total:</span>
                                    <span className="font-semibold">
                                        {new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP' }).format(editing.total)}
                                    </span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-muted-foreground">Líneas:</span>
                                    <span>{editing.lines.length}</span>
                                </div>
                            </div>
                            <DialogFooter>
                                <Button variant="outline" onClick={() => setShowIssueModal(false)}>Cancelar</Button>
                                <Button onClick={confirmIssue}>
                                    <CheckCircle2 className="h-4 w-4 mr-2" /> Emitir factura
                                </Button>
                            </DialogFooter>
                        </div>
                    )}
                </DialogContent>
            </Dialog>

            {/* Modal: Recibo de pago */}
            {showReceiptModal && selectedPayment && editing && (
                <PaymentReceipt
                    invoice={editing}
                    payment={selectedPayment}
                    onClose={() => {
                        setShowReceiptModal(false);
                        setSelectedPayment(null);
                    }}
                />
            )}
        </div>
    );
}
