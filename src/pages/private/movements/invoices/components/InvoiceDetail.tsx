import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { useInvoicesMock } from '@/hooks/useInvoicesMock';
import type { InvoiceStatus } from '@/interfaces/billing';
import { Printer, Banknote, Ban, FileText } from 'lucide-react';
import { useState, useMemo } from 'react';
import { ConfirmDialog } from '@/components/ui/confirm-dialog';

function statusBadge(s: InvoiceStatus) {
    const map: Record<InvoiceStatus, string> = {
        draft: 'bg-gray-500 text-white',
        issued: 'bg-blue-600 text-white',
        partially_paid: 'bg-amber-600 text-white',
        paid: 'bg-green-600 text-white',
        cancelled: 'bg-red-600 text-white',
        refunded: 'bg-purple-600 text-white',
    };
    return map[s];
}

export function InvoiceDetail({ id, onClose, onIssue, onCancel, onPay }: { id: string | null; onClose: () => void; onIssue: (id: string) => void; onCancel: (id: string) => void; onPay: (id: string) => void; }) {
    const { getInvoice, exportInvoicePDF } = useInvoicesMock();
    const inv = id ? getInvoice(id) : null;
    const [confirmOpen, setConfirmOpen] = useState(false);
    const fmt = useMemo(() => (n: number) => new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', maximumFractionDigits: 2 }).format(n), []);

    return (
        <Sheet open={!!id} onOpenChange={(o) => !o && onClose()}>
            <SheetContent className="w-full sm:max-w-3xl overflow-y-auto p-0">
                {inv && (
                    <div>
                        <SheetHeader className="px-6 pt-6 pb-4 border-b sticky top-0 bg-background z-10">
                            <div className="flex items-start justify-between gap-4">
                                <div>
                                    <SheetTitle className="text-xl">Factura {inv.number || '(Sin emitir)'}</SheetTitle>
                                    <div className="mt-2 flex items-center gap-2">
                                        <Badge className={statusBadge(inv.status)}>{inv.status.replace('_', ' ')}</Badge>
                                        <span className="text-sm text-muted-foreground">{new Date(inv.date).toLocaleString()}</span>
                                    </div>
                                    <div className="text-sm text-muted-foreground mt-1">Cliente: <span className="font-medium text-foreground">{inv.customerSnapshot.name}</span></div>
                                </div>
                                <div className="flex gap-2">
                                    <Button variant="outline" onClick={() => exportInvoicePDF(inv.id)}><Printer className="h-4 w-4 mr-2" /> Imprimir</Button>
                                    <Button variant="default" onClick={() => onPay(inv.id)} disabled={inv.status === 'paid' || inv.status === 'cancelled' || inv.status === 'refunded'}><Banknote className="h-4 w-4 mr-2" /> Pagar</Button>
                                </div>
                            </div>
                        </SheetHeader>

                        <div className="px-6 py-6 space-y-6">
                            <Card className="p-4 overflow-hidden">
                                <table className="w-full text-sm">
                                    <thead className="text-muted-foreground">
                                        <tr>
                                            <th className="text-left py-2">Descripción</th>
                                            <th className="text-right py-2">Cant</th>
                                            <th className="text-right py-2">Precio</th>
                                            <th className="text-right py-2">Impuesto</th>
                                            <th className="text-right py-2">Total</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {inv.lines.map((l) => (
                                            <tr key={l.id} className="border-t">
                                                <td className="py-2">{l.description}</td>
                                                <td className="text-right py-2">{l.qty}</td>
                                                <td className="text-right py-2">{l.unitPrice.toFixed(2)}</td>
                                                <td className="text-right py-2">{l.lineTax.toFixed(2)}</td>
                                                <td className="text-right py-2 font-medium">{l.lineTotal.toFixed(2)}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </Card>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                                <Card className="p-4">
                                    <div className="text-sm text-muted-foreground">Subtotal</div>
                                    <div className="text-lg font-bold">{fmt(inv.subtotal)}</div>
                                </Card>
                                <Card className="p-4">
                                    <div className="text-sm text-muted-foreground">Impuestos</div>
                                    <div className="text-lg font-bold">{fmt(inv.taxTotal)}</div>
                                </Card>
                                <Card className="p-4">
                                    <div className="text-sm text-muted-foreground">Total</div>
                                    <div className="text-lg font-bold">{fmt(inv.total)}</div>
                                </Card>
                            </div>

                            <div className="flex gap-2">
                                <Button variant="outline" onClick={() => onIssue(inv.id)} disabled={inv.status !== 'draft'}><FileText className="h-4 w-4 mr-2" /> Emitir</Button>
                                <Button variant="destructive" onClick={() => setConfirmOpen(true)} disabled={inv.status === 'cancelled' || inv.status === 'refunded'}><Ban className="h-4 w-4 mr-2" /> Anular</Button>
                            </div>

                            {inv.payments.length > 0 && (
                                <div>
                                    <h4 className="font-bold text-base mb-3">Historial de pagos</h4>
                                    <div className="space-y-2">
                                        {inv.payments.map(p => (
                                            <Card key={p.id} className="p-4">
                                                <div className="flex items-center justify-between">
                                                    <div className="flex-1">
                                                        <div className="text-sm font-semibold">{p.method.toUpperCase()}</div>
                                                        <div className="text-xs text-muted-foreground mt-1">{new Date(p.date).toLocaleString()}</div>
                                                    </div>
                                                    <div className="text-lg font-bold">{fmt(p.amount)}</div>
                                                </div>
                                            </Card>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </SheetContent>

            <ConfirmDialog
                open={confirmOpen}
                onOpenChange={setConfirmOpen}
                title="Anular factura"
                description="Esta acción marcará la factura como anulada. ¿Deseas continuar?"
                confirmLabel="Sí, anular"
                variant="destructive"
                onConfirm={() => { if (inv) onCancel(inv.id); setConfirmOpen(false); }}
            />
        </Sheet>
    );
}
