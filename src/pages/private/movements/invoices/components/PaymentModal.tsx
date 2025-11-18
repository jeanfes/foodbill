import { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { NumberInput } from '@/components/ui/number-input';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { AlertTriangle, DollarSign, Calendar as CalendarIcon, Banknote, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import type { Invoice, PaymentMethod, RegisterPaymentInput } from '@/interfaces/billing';

interface Props {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    invoice: Invoice;
    onConfirm: (payment: Omit<RegisterPaymentInput, 'invoiceId' | 'userId'>) => Promise<void>;
    userId: string;
}

export function PaymentModal({ open, onOpenChange, invoice, onConfirm, userId }: Props) {
    const [amount, setAmount] = useState<number>(invoice?.balance || 0);
    const [method, setMethod] = useState<PaymentMethod>('cash');
    const [reference, setReference] = useState('');
    const [date, setDate] = useState<Date>(new Date());
    const [notes, setNotes] = useState('');
    const [cashboxId, setCashboxId] = useState<string>('');
    const [submitting, setSubmitting] = useState(false);
    const [showOverpaymentWarning, setShowOverpaymentWarning] = useState(false);

    console.log(userId);

    useEffect(() => {
        if (open && invoice) {
            setAmount(invoice.balance);
            setMethod('cash');
            setReference('');
            setDate(new Date());
            setNotes('');
            setCashboxId('');
            setShowOverpaymentWarning(false);
        }
    }, [open, invoice?.balance]);

    const fmt = (n: number) => new Intl.NumberFormat('es-CO', {
        style: 'currency',
        currency: 'COP',
        maximumFractionDigits: 2
    }).format(n);

    // Validaciones
    const invoiceBalance = invoice?.balance || 0;
    const isOverpayment = amount > invoiceBalance;
    const overpaymentAmount = isOverpayment ? amount - invoiceBalance : 0;
    const isPartialPayment = amount < invoiceBalance;
    const remainingBalance = isPartialPayment ? invoiceBalance - amount : 0;
    const isFullPayment = Math.abs(amount - invoiceBalance) < 0.01;

    const errors = useMemo(() => {
        const errs: string[] = [];
        if (amount <= 0) errs.push('El monto debe ser mayor a cero');
        if (!method) errs.push('Debe seleccionar un método de pago');
        if ((method === 'card' || method === 'transfer') && !reference.trim()) {
            errs.push('La referencia es obligatoria para pagos con tarjeta o transferencia');
        }
        return errs;
    }, [amount, method, reference]);

    const canSubmit = errors.length === 0 && !submitting;

    if (!invoice) {
        return null;
    }

    // Botones rápidos de porcentaje
    const setPercentage = (pct: number) => {
        if (!invoice) return;
        setAmount(+(invoice.balance * (pct / 100)).toFixed(2));
    };

    const handleConfirm = async () => {
        if (!canSubmit) return;

        // Si hay sobrepago y no se ha confirmado, mostrar advertencia
        if (isOverpayment && !showOverpaymentWarning) {
            setShowOverpaymentWarning(true);
            return;
        }

        setSubmitting(true);
        try {
            await onConfirm({
                amount,
                method,
                reference: reference.trim() || undefined,
                date: date.toISOString(),
                notes: notes.trim() || undefined,
                cashboxId: cashboxId || undefined,
            });
            onOpenChange(false);
        } catch (error) {
            console.error('Error registrando pago:', error);
            // El error se maneja en el componente padre
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <>
            <Dialog open={open} onOpenChange={onOpenChange}>
                <DialogContent className="max-w-2xl max-h-[90vh] flex flex-col p-0">
                    <DialogHeader className="px-6 pt-6 pb-4 border-b">
                        <DialogTitle className="flex items-center gap-2">
                            <Banknote className="h-5 w-5" />
                            Registrar pago
                        </DialogTitle>
                        <DialogDescription>
                            Factura #{invoice?.number || invoice?.id || 'N/A'}
                        </DialogDescription>
                    </DialogHeader>

                    <div className="space-y-6 py-4 px-6 overflow-y-auto flex-1">{/* Resumen de factura */}
                        {/* Resumen de factura */}
                        <div className="bg-muted/50 rounded-lg p-3 space-y-2">
                            <div className="flex justify-between text-sm">
                                <span className="text-muted-foreground">Total factura:</span>
                                <span className="font-semibold">{fmt(invoice.total)}</span>
                            </div>
                            {invoice.payments.length > 0 && (
                                <div className="flex justify-between text-sm">
                                    <span className="text-muted-foreground">Pagado:</span>
                                    <span className="text-green-600">
                                        {fmt(invoice.payments.reduce((s, p) => s + p.amount, 0))}
                                    </span>
                                </div>
                            )}
                            <div className="flex justify-between font-semibold pt-2 border-t">
                                <span>Saldo pendiente:</span>
                                <span className="text-orange-600">{fmt(invoice.balance)}</span>
                            </div>
                        </div>

                        {/* Monto */}
                        <div className="space-y-2">
                            <Label htmlFor="amount">Monto a pagar *</Label>
                            <NumberInput
                                id="amount"
                                value={amount}
                                onChange={(v) => setAmount(Number(v || 0))}
                                min={0}
                                step={1000}
                                decimalScale={2}
                                className="text-lg font-semibold"
                            />

                            {/* Botones rápidos */}
                            <div className="flex gap-2">
                                <Button
                                    type="button"
                                    variant="outline"
                                    size="sm"
                                    onClick={() => setPercentage(25)}
                                >
                                    25%
                                </Button>
                                <Button
                                    type="button"
                                    variant="outline"
                                    size="sm"
                                    onClick={() => setPercentage(50)}
                                >
                                    50%
                                </Button>
                                <Button
                                    type="button"
                                    variant="outline"
                                    size="sm"
                                    onClick={() => setPercentage(75)}
                                >
                                    75%
                                </Button>
                                <Button
                                    type="button"
                                    variant="outline"
                                    size="sm"
                                    onClick={() => setAmount(invoice.balance)}
                                >
                                    Total
                                </Button>
                            </div>

                            {/* Mensajes informativos */}
                            <AnimatePresence mode="wait">
                                {isFullPayment && (
                                    <motion.div
                                        key="full"
                                        initial={{ opacity: 0, y: -10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -10 }}
                                        className="flex items-start gap-2 p-3 bg-emerald-50 border border-emerald-200 rounded-lg text-sm text-emerald-900"
                                    >
                                        <DollarSign className="h-4 w-4 mt-0.5 shrink-0" />
                                        <span>Pago cubre el total — la factura quedará marcada como <strong>PAGADA</strong>.</span>
                                    </motion.div>
                                )}
                                {isPartialPayment && (
                                    <motion.div
                                        key="partial"
                                        initial={{ opacity: 0, y: -10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -10 }}
                                        className="flex items-start gap-2 p-3 bg-blue-50 border border-blue-200 rounded-lg text-sm text-blue-900"
                                    >
                                        <DollarSign className="h-4 w-4 mt-0.5 shrink-0" />
                                        <span>Pago parcial — saldo restante: <strong>{fmt(remainingBalance)}</strong></span>
                                    </motion.div>
                                )}
                                {isOverpayment && (
                                    <motion.div
                                        key="overpay"
                                        initial={{ opacity: 0, y: -10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -10 }}
                                        className="flex items-start gap-2 p-3 bg-amber-50 border border-amber-200 rounded-lg text-sm text-amber-900"
                                    >
                                        <AlertTriangle className="h-4 w-4 mt-0.5 shrink-0" />
                                        <span>El pago excede el saldo por <strong>{fmt(overpaymentAmount)}</strong>. Confirme para continuar.</span>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>

                        {/* Método de pago */}
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="method">Método de pago *</Label>
                                <Select value={method} onValueChange={(v) => setMethod(v as PaymentMethod)}>
                                    <SelectTrigger id="method">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="cash">Efectivo</SelectItem>
                                        <SelectItem value="card">Tarjeta</SelectItem>
                                        <SelectItem value="transfer">Transferencia</SelectItem>
                                        <SelectItem value="other">Otro</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            {/* Fecha */}
                            <div className="space-y-2">
                                <Label>Fecha de pago</Label>
                                <Popover>
                                    <PopoverTrigger asChild>
                                        <Button
                                            variant="outline"
                                            className={cn(
                                                "w-full justify-start text-left font-normal",
                                                !date && "text-muted-foreground"
                                            )}
                                        >
                                            <CalendarIcon className="mr-2 h-4 w-4" />
                                            {date ? format(date, "PPP", { locale: es }) : <span>Seleccionar fecha</span>}
                                        </Button>
                                    </PopoverTrigger>
                                    <PopoverContent className="w-auto p-0" align="start">
                                        <Calendar
                                            mode="single"
                                            selected={date}
                                            onSelect={(d) => d && setDate(d)}
                                            initialFocus
                                            locale={es}
                                        />
                                    </PopoverContent>
                                </Popover>
                            </div>
                        </div>

                        {/* Referencia */}
                        <div className="space-y-2">
                            <Label htmlFor="reference">
                                Referencia {(method === 'card' || method === 'transfer') && '*'}
                            </Label>
                            <Input
                                id="reference"
                                value={reference}
                                onChange={(e) => setReference(e.target.value)}
                                placeholder="Número de autorización, transacción, etc."
                            />
                        </div>

                        {/* Caja (opcional) */}
                        <div className="space-y-2">
                            <Label htmlFor="cashbox">Caja (opcional)</Label>
                            <Select value={cashboxId || 'none'} onValueChange={(v) => setCashboxId(v === 'none' ? '' : v)}>
                                <SelectTrigger id="cashbox">
                                    <SelectValue placeholder="Seleccionar caja" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="none">Sin asignar</SelectItem>
                                    <SelectItem value="box-1">Caja Principal</SelectItem>
                                    <SelectItem value="box-2">Caja Secundaria</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        {/* Notas */}
                        <div className="space-y-2">
                            <Label htmlFor="notes">Notas (opcional)</Label>
                            <Textarea
                                id="notes"
                                value={notes}
                                onChange={(e) => setNotes(e.target.value)}
                                placeholder="Observaciones sobre el pago..."
                                className="min-h-20"
                            />
                        </div>

                        {/* Errores de validación */}
                        {errors.length > 0 && (
                            <div className="space-y-1">
                                {errors.map((err, i) => (
                                    <div key={i} className="flex items-center gap-2 text-sm text-red-600">
                                        <AlertTriangle className="h-4 w-4" />
                                        {err}
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    <DialogFooter className="px-6 py-4 border-t bg-background">
                        <Button
                            variant="outline"
                            onClick={() => onOpenChange(false)}
                            disabled={submitting}
                        >
                            Cancelar
                        </Button>
                        <Button
                            onClick={handleConfirm}
                            disabled={!canSubmit}
                        >
                            {submitting ? (
                                <>
                                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                    Registrando...
                                </>
                            ) : isOverpayment && !showOverpaymentWarning ? (
                                'Confirmar sobrepago'
                            ) : (
                                'Confirmar pago'
                            )}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    );
}
