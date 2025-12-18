import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useInvoicesMock } from '@/hooks/useInvoicesMock';
import { useToast } from '@/components/ui/toast';
import type { InvoiceStatus } from '@/interfaces/billing';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { motion } from 'framer-motion';
import { Plus, Printer, Eye, Pencil, Banknote, FileDown, FileUp } from 'lucide-react';
import { InvoiceDetail } from './components/InvoiceDetail';
import { PaymentModal } from './components/PaymentModal';
import { usePermissions } from '@/hooks/usePermissions';
import { Permission } from '@/interfaces/role';
import { ImportCustomersModal } from './components/ImportCustomersModal';
import { DateRangeFilter } from './components/DateRangeFilter';
import type { DateRange } from './components/DateRangeFilter';

function statusBadge(s: InvoiceStatus) {
    const map: Record<InvoiceStatus, string> = {
        draft: 'bg-gray-500 text-white',
        issued: 'bg-blue-600 text-white',
        partially_paid: 'bg-amber-600 text-white',
        paid: 'bg-green-600 text-white',
        cancelled: 'bg-red-600 text-white',
    };
    return map[s];
}

export default function InvoicesPage() {
    const navigate = useNavigate();
    const { invoices, series, exportInvoicesCSV, exportInvoicePDF, issueInvoice, deleteInvoice, registerPayment } = useInvoicesMock();
    const { hasPermission } = usePermissions();
    const { show: showToast } = useToast();

    const flags = {
        canCreateInvoice: hasPermission(Permission.FAC_EDIT),
        canIssueInvoice: hasPermission(Permission.FAC_EDIT),
        canEditInvoice: hasPermission(Permission.FAC_EDIT),
        canRegisterPayment: hasPermission(Permission.FAC_EDIT),
        canRefund: hasPermission(Permission.FAC_EDIT),
        canCancelInvoice: hasPermission(Permission.FAC_EDIT),
        canExportInvoice: hasPermission(Permission.FAC_VIEW),
    };

    const [q, setQ] = useState('');
    const [status, setStatus] = useState<InvoiceStatus | 'all'>('all');
    const [seriesCode, setSeriesCode] = useState<string | 'all'>('all');
    const [dateRange, setDateRange] = useState<DateRange>({});

    const [page, setPage] = useState<number>(1);
    const [pageSize, setPageSize] = useState<number>(10);

    const [showImport, setShowImport] = useState(false);
    const [detailId, setDetailId] = useState<string | null>(null);
    const [payId, setPayId] = useState<string | null>(null);

    const filtered = useMemo(() => {
        const txt = q.trim().toLowerCase();
        const from = dateRange.from ? new Date(dateRange.from.setHours(0, 0, 0, 0)) : null;
        const to = dateRange.to ? new Date(dateRange.to.setHours(23, 59, 59, 999)) : null;
        const res = invoices.filter(i => {
            if (status !== 'all' && i.status !== status) return false;
            if (seriesCode !== 'all') {
                if (!i.number || !i.number.startsWith(seriesCode + '-')) return false;
            }
            const d = new Date(i.date);
            if (from && d < from) return false;
            if (to && d > to) return false;
            if (!txt) return true;
            return (i.number || '').toLowerCase().includes(txt) || i.customerSnapshot.name.toLowerCase().includes(txt);
        });
        return res;
    }, [invoices, q, status, seriesCode, dateRange]);

    const paged = useMemo(() => {
        const start = (page - 1) * pageSize;
        return filtered.slice(start, start + pageSize);
    }, [filtered, page, pageSize]);

    const pageCount = Math.max(1, Math.ceil(filtered.length / pageSize));

    const fmt = (n: number) => new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', maximumFractionDigits: 2 }).format(n);

    const handleRegisterPayment = async (paymentData: any) => {
        if (!payId) return;

        try {
            registerPayment({
                invoiceId: payId,
                userId: 'admin',
                ...paymentData
            });

            const invoice = invoices.find(i => i.id === payId);
            if (invoice) {
                const newBalance = invoice.balance - paymentData.amount;
                showToast(
                    `Pago registrado: ${fmt(paymentData.amount)} — Saldo restante: ${fmt(Math.max(0, newBalance))}`,
                    'success'
                );
            }
            setPayId(null);
        } catch (error) {
            showToast(
                (error as Error).message || 'Error al registrar el pago',
                'error'
            );
            throw error;
        }
    };

    return (
        <div className="space-y-4">
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.25 }}
                className="flex flex-wrap items-center justify-between gap-3"
            >
                <div className="space-y-1">
                    <h2 className="text-2xl font-bold tracking-tight">Facturación</h2>
                    <p className="text-sm text-muted-foreground">Emite, cobra, imprime y gestiona facturas</p>
                </div>
                <div className="flex gap-2">
                    <Button
                        variant="outline"
                        onClick={() => exportInvoicesCSV({
                            status: status === 'all' ? undefined : status,
                            seriesCode: seriesCode === 'all' ? undefined : seriesCode,
                            dateFrom: dateRange.from ? dateRange.from.toISOString().slice(0, 10) : undefined,
                            dateTo: dateRange.to ? dateRange.to.toISOString().slice(0, 10) : undefined,
                            q: q || undefined,
                        })}
                        disabled={!flags.canExportInvoice}
                    >
                        <FileDown className="h-4 w-4 mr-2" /> Exportar CSV
                    </Button>
                    <Button variant="outline" onClick={() => setShowImport(true)}>
                        <FileUp className="h-4 w-4 mr-2" /> Importar clientes
                    </Button>
                    <Button onClick={() => navigate('/movimientos/facturacion/nueva')} disabled={!flags.canCreateInvoice}>
                        <Plus className="h-4 w-4 mr-2" /> Nueva factura
                    </Button>
                </div>
            </motion.div>

            <Card className="p-4">
                <div className="flex flex-wrap gap-3 items-center">
                    <div className="flex-1 min-w-[220px]">
                        <Input placeholder="Buscar por número o cliente" value={q} onChange={e => { setQ(e.target.value); setPage(1); }} />
                    </div>
                    <Select value={status} onValueChange={(v) => { setStatus(v as any); setPage(1); }}>
                        <SelectTrigger className="w-40"><SelectValue placeholder="Estado" /></SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">Todos</SelectItem>
                            <SelectItem value="draft">Borrador</SelectItem>
                            <SelectItem value="issued">Emitida</SelectItem>
                            <SelectItem value="partially_paid">Parcial</SelectItem>
                            <SelectItem value="paid">Pagada</SelectItem>
                            <SelectItem value="cancelled">Anulada</SelectItem>
                        </SelectContent>
                    </Select>
                    <Select value={seriesCode} onValueChange={(v) => { setSeriesCode(v as any); setPage(1); }}>
                        <SelectTrigger className="w-40"><SelectValue placeholder="Serie" /></SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">Todas las series</SelectItem>
                            {series.map(s => (
                                <SelectItem key={s.id} value={s.seriesCode}>{s.seriesCode}</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                    <DateRangeFilter
                        value={dateRange}
                        onChange={(r) => { setDateRange(r); setPage(1); }}
                    />
                    <div className="ml-auto text-xs text-muted-foreground">{filtered.length} resultado(s) · Página {page} de {pageCount}</div>
                </div>
            </Card>

            <Card className="overflow-hidden pb-0">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Número</TableHead>
                            <TableHead>Fecha</TableHead>
                            <TableHead>Cliente</TableHead>
                            <TableHead className="text-right">Subtotal</TableHead>
                            <TableHead className="text-right">Impuesto</TableHead>
                            <TableHead className="text-right">Total</TableHead>
                            <TableHead>Estado</TableHead>
                            <TableHead>Acciones</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {paged.map((i) => (
                            <TableRow key={i.id} className="hover:bg-accent/40">
                                <TableCell className="font-medium">{i.number || <span className="text-muted-foreground">(Sin emitir)</span>}</TableCell>
                                <TableCell>{new Date(i.date).toLocaleDateString()}</TableCell>
                                <TableCell>{i.customerSnapshot.name}</TableCell>
                                <TableCell className="text-right">{fmt(i.subtotal)}</TableCell>
                                <TableCell className="text-right">{fmt(i.taxTotal)}</TableCell>
                                <TableCell className="text-right font-semibold">{fmt(i.total)}</TableCell>
                                <TableCell>
                                    <Badge className={statusBadge(i.status)}>{i.status.replace('_', ' ')}</Badge>
                                </TableCell>
                                <TableCell>
                                    <div className="flex gap-2">
                                        <Button variant="outline" size="sm" onClick={() => setDetailId(i.id)}><Eye className="h-4 w-4" /></Button>
                                        <Button variant="outline" size="sm" onClick={() => navigate(`/movimientos/facturacion/${i.id}/editar`)} disabled={!flags.canEditInvoice || i.status === 'cancelled'}><Pencil className="h-4 w-4" /></Button>
                                        <Button variant="outline" size="sm" onClick={() => exportInvoicePDF(i.id)}><Printer className="h-4 w-4" /></Button>
                                        <Button variant="default" size="sm" onClick={() => setPayId(i.id)} disabled={!flags.canRegisterPayment || i.status === 'cancelled' || i.status === 'paid' || i.status === 'draft'}>
                                            <Banknote className="h-4 w-4" />
                                        </Button>
                                    </div>
                                </TableCell>
                            </TableRow>
                        ))}
                        {filtered.length === 0 && (
                            <TableRow>
                                <TableCell colSpan={8} className="text-center text-muted-foreground py-8">Sin resultados</TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
                <div className="flex items-center justify-between p-3 border-t">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <span>Filas por página:</span>
                        <Select value={String(pageSize)} onValueChange={(v) => { setPageSize(parseInt(v)); setPage(1); }}>
                            <SelectTrigger className="w-[90px]"><SelectValue /></SelectTrigger>
                            <SelectContent>
                                <SelectItem value="10">10</SelectItem>
                                <SelectItem value="20">20</SelectItem>
                                <SelectItem value="50">50</SelectItem>
                            </SelectContent>
                        </Select>
                        <span className="ml-3">{filtered.length} total</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <Button variant="outline" size="sm" onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page <= 1}>Anterior</Button>
                        <div className="text-sm text-muted-foreground">{page} / {pageCount}</div>
                        <Button variant="outline" size="sm" onClick={() => setPage(p => Math.min(pageCount, p + 1))} disabled={page >= pageCount}>Siguiente</Button>
                    </div>
                </div>
            </Card>

            <InvoiceDetail id={detailId} onClose={() => setDetailId(null)}
                onIssue={(id) => issueInvoice(id)} onCancel={(id) => deleteInvoice(id)} onPay={(id) => setPayId(id)} />

            {payId && invoices.find(i => i.id === payId) && (
                <PaymentModal
                    open={true}
                    onOpenChange={(open) => !open && setPayId(null)}
                    invoice={invoices.find(i => i.id === payId)!}
                    onConfirm={handleRegisterPayment}
                    userId="admin"
                />
            )}

            <ImportCustomersModal open={showImport} onOpenChange={setShowImport} />
        </div>
    );
}
