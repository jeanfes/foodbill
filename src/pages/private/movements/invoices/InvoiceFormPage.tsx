import { useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useInvoicesMock } from '@/hooks/useInvoicesMock';
import { useProductsMock } from '@/hooks/useProductsMock';
import type { InvoiceLine, Customer } from '@/interfaces/billing';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Table, TableBody, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { AlertTriangle, CheckCircle2, Plus, ArrowLeft, FileText, User } from 'lucide-react';
import { CustomerTypeahead } from './components/CustomerTypeahead';
import { InvoiceLineRow } from './components/InvoiceLineRow';
import { InvoiceSummary } from './components/InvoiceSummary';
import { InvoicePrintView } from './components/InvoicePrintView';
import { Badge } from '@/components/ui/badge';

export default function InvoiceFormPage() {
    const navigate = useNavigate();
    const { id } = useParams<{ id: string }>();
    const { invoices, customers, settings, createInvoice, updateInvoice, issueInvoice, importCustomers, getNextInvoiceNumber } = useInvoicesMock();
    const { products } = useProductsMock();

    const editing = useMemo(() => id ? invoices.find(i => i.id === id) || null : null, [invoices, id]);

    const [customerId, setCustomerId] = useState(editing?.customerId || customers[0]?.id || '');
    const customer = useMemo(() => customers.find(c => c.id === customerId), [customers, customerId]);
    const [lines, setLines] = useState<InvoiceLine[]>(editing?.lines || []);
    const [rounding, setRounding] = useState<number>(editing?.rounding || 0);
    const [notes, setNotes] = useState(editing?.notes || '');
    const [saving, setSaving] = useState(false);
    const [showNewCustomerModal, setShowNewCustomerModal] = useState(false);
    const [showIssueModal, setShowIssueModal] = useState(false);
    const [showPrintView, setShowPrintView] = useState(false);

    useEffect(() => {
        if (editing) {
            setCustomerId(editing.customerId);
            setLines(editing.lines);
            setRounding(editing.rounding || 0);
            setNotes(editing.notes || '');
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

    const subtotal = lines.reduce((s, l) => s + l.lineBase, 0);
    const taxTotal = lines.reduce((s, l) => s + l.lineTax, 0);
    const discountTotal = lines.reduce((s, l) => s + Math.max(0, l.qty * l.unitPrice - l.lineBase), 0);
    const total = +(subtotal + taxTotal + rounding).toFixed(2);

    const onSaveDraft = async () => {
        if (!customer) {
            alert('Debe seleccionar un cliente');
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
                        email: customer.email
                    },
                    currency: 'COP',
                    lines: validLines,
                    rounding,
                    notes,
                });
            } else {
                updateInvoice(editing.id, { lines: validLines, notes, rounding });
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

        const validLines = lines.filter(l => l.description.trim() && l.qty > 0);
        if (validLines.length === 0) {
            alert('Debe agregar al menos una línea válida');
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
                                disabled={!!editing && editing.status !== 'draft'}
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

                        {/* Líneas */}
                        <Card className="p-6">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <FileText className="h-5 w-5 text-muted-foreground" />
                                    <h2 className="text-lg font-semibold">Líneas de factura</h2>
                                    <Badge variant="secondary">{lines.length}</Badge>
                                </div>
                                <Button onClick={addLine} size="sm">
                                    <Plus className="h-4 w-4 mr-2" /> Agregar línea
                                </Button>
                            </div>

                            <div className="border rounded-lg overflow-hidden">
                                <div className="overflow-x-auto">
                                    <Table>
                                        <TableHeader>
                                            <TableRow>
                                                <TableHead className="w-[35%] min-w-[300px]">Descripción</TableHead>
                                                <TableHead className="w-[8%] min-w-[100px]">Cantidad</TableHead>
                                                <TableHead className="w-[12%] min-w-[120px]">Precio</TableHead>
                                                <TableHead className="w-[8%] min-w-[90px]">IVA %</TableHead>
                                                <TableHead className="w-[12%] min-w-[120px]">Total</TableHead>
                                                <TableHead className="w-[5%] min-w-[50px]"></TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            <AnimatePresence initial={false}>
                                                {lines.map((line) => (
                                                    <InvoiceLineRow
                                                        key={line.id}
                                                        line={line}
                                                        onUpdate={updateLine}
                                                        onRemove={removeLine}
                                                    />
                                                ))}
                                            </AnimatePresence>
                                            {lines.length === 0 && (
                                                <TableRow>
                                                    <td colSpan={6} className="text-center py-8 text-muted-foreground">
                                                        Sin líneas. Usa el botón "Agregar línea" para añadir productos.
                                                    </td>
                                                </TableRow>
                                            )}
                                        </TableBody>
                                    </Table>
                                </div>
                            </div>
                        </Card>

                        {/* Notas */}
                        <Card className="p-6">
                            <h2 className="text-lg font-semibold">Notas</h2>
                            <Textarea
                                value={notes}
                                onChange={(e) => setNotes(e.target.value)}
                                placeholder="Observaciones, condiciones de pago, etc..."
                                className="min-h-24"
                            />
                        </Card>
                    </div>

                    {/* Sidebar - 1/3 */}
                    <div className="lg:col-span-1">
                        <InvoiceSummary
                            subtotal={subtotal}
                            taxTotal={taxTotal}
                            discountTotal={discountTotal}
                            rounding={rounding}
                            total={total}
                            balance={editing ? editing.total - editing.payments.reduce((s, p) => s + p.amount, 0) : total}
                            payments={editing?.payments || []}
                            roundingStep={settings.roundingStep ?? 1}
                            onRoundingChange={setRounding}
                            onSaveDraft={onSaveDraft}
                            onIssue={editing && editing.status === 'draft' ? handleIssueInvoice : undefined}
                            onPrint={editing && editing.status !== 'draft' ? () => setShowPrintView(true) : undefined}
                            saving={saving}
                            canIssue={!editing || editing.status === 'draft'}
                            canPrint={!!editing && editing.status !== 'draft'}
                            status={editing?.status}
                        />
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
        </div>
    );
}
