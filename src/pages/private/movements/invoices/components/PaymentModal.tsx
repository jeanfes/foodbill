import { useState } from 'react';
import { useInvoicesMock } from '@/hooks/useInvoicesMock';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { NumberInput } from '@/components/ui/number-input';

export function PaymentModal({ invoiceId, onClose }: { invoiceId: string | null; onClose: () => void }) {
    const { getInvoice, registerPayment } = useInvoicesMock();
    const inv = invoiceId ? getInvoice(invoiceId) : null;

    const pending = inv ? Math.max(inv.total - inv.payments.reduce((s, p) => s + p.amount, 0), 0) : 0;
    const [amount, setAmount] = useState<number>(pending);
    const [method, setMethod] = useState<'cash' | 'card' | 'transfer' | 'other'>('cash');
    const [reference, setReference] = useState('');
    const fmt = (n: number) => new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', maximumFractionDigits: 2 }).format(n);

    const onConfirm = () => {
        if (!inv) return;
        registerPayment({ invoiceId: inv.id, amount: amount || 0, method, reference, userId: 'admin' });
        onClose();
    };

    return (
        <Dialog open={!!invoiceId} onOpenChange={(o) => !o && onClose()}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Registrar pago</DialogTitle>
                </DialogHeader>
                {inv && (
                    <div className="space-y-3">
                        <div className="flex items-center justify-between">
                            <div className="text-sm text-muted-foreground">Factura: <span className="font-medium text-foreground">{inv.number || inv.id}</span></div>
                            <div className="text-xs text-muted-foreground">Pendiente: <span className="font-semibold text-foreground">{fmt(pending)}</span></div>
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                            <div>
                                <label className="text-xs text-muted-foreground">Monto</label>
                                <NumberInput value={amount} min={0} step={100} onChange={(v) => setAmount(Number(v || 0))} />
                                <div className="flex gap-2 mt-2">
                                    <Button type="button" size="sm" variant="outline" onClick={() => setAmount(Math.max(0, Math.round(pending * 0.25)))}>25%</Button>
                                    <Button type="button" size="sm" variant="outline" onClick={() => setAmount(Math.max(0, Math.round(pending * 0.5)))}>50%</Button>
                                    <Button type="button" size="sm" variant="outline" onClick={() => setAmount(Math.max(0, Math.round(pending * 0.75)))}>75%</Button>
                                    <Button type="button" size="sm" onClick={() => setAmount(pending)}>Todo</Button>
                                </div>
                            </div>
                            <div>
                                <label className="text-xs text-muted-foreground">Método</label>
                                <Select value={method} onValueChange={(v) => setMethod(v as any)}>
                                    <SelectTrigger><SelectValue /></SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="cash">Efectivo</SelectItem>
                                        <SelectItem value="card">Tarjeta</SelectItem>
                                        <SelectItem value="transfer">Transferencia</SelectItem>
                                        <SelectItem value="other">Otro</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                        <div>
                            <label className="text-xs text-muted-foreground">Referencia</label>
                            <Input value={reference} onChange={(e) => setReference(e.target.value)} placeholder="# boleta / autorización" />
                        </div>
                        <div className="flex justify-end gap-2 pt-2">
                            <Button variant="outline" onClick={onClose}>Cancelar</Button>
                            <Button onClick={onConfirm}>Confirmar</Button>
                        </div>
                    </div>
                )}
            </DialogContent>
        </Dialog>
    );
}
