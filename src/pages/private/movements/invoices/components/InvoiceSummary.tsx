import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { NumberInput } from '@/components/ui/number-input';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { Save, Send, Printer, Banknote, Loader2, CreditCard, Calendar } from 'lucide-react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import type { PaymentType } from '@/interfaces/billing';

interface Props {
    subtotal: number;
    taxTotal: number;
    discountTotal: number;
    rounding: number;
    total: number;
    balance?: number;
    payments?: { amount: number }[];
    roundingStep?: number;
    paymentType?: PaymentType;
    dueDate?: Date;
    onRoundingChange?: (value: number) => void;
    onSaveDraft?: () => void;
    onIssue?: () => void;
    onPrint?: () => void;
    onRegisterPayment?: () => void;
    saving?: boolean;
    canIssue?: boolean;
    canPrint?: boolean;
    canRegisterPayment?: boolean;
    status?: 'draft' | 'issued' | 'paid' | 'partially_paid' | 'cancelled';
}

export function InvoiceSummary({
    subtotal,
    taxTotal,
    discountTotal,
    rounding,
    total,
    balance,
    payments = [],
    roundingStep = 1,
    paymentType,
    dueDate,
    onRoundingChange,
    onSaveDraft,
    onIssue,
    onPrint,
    onRegisterPayment,
    saving = false,
    canIssue = true,
    canPrint = false,
    canRegisterPayment = false,
    status = 'draft'
}: Props) {
    const fmt = (n: number) => new Intl.NumberFormat('es-CO', {
        style: 'currency',
        currency: 'COP',
        maximumFractionDigits: 2
    }).format(n);

    const totalPaid = payments.reduce((sum, p) => sum + p.amount, 0);

    return (
        <Card className="p-6 space-y-4 sticky top-24">
            <div>
                <h3 className="font-semibold text-lg mb-4">Resumen</h3>

                {status !== 'draft' && (
                    <div className="mb-4">
                        <Badge variant={
                            status === 'paid' ? 'default' :
                                status === 'partially_paid' ? 'secondary' :
                                    status === 'cancelled' ? 'destructive' :
                                        'outline'
                        }>
                            {status === 'draft' ? 'Borrador' :
                                status === 'issued' ? 'Emitida' :
                                    status === 'paid' ? 'Pagada' :
                                        status === 'partially_paid' ? 'Pago parcial' :
                                            status === 'cancelled' ? 'Anulada' : status}
                        </Badge>
                    </div>
                )}

                {/* Tipo de pago y vencimiento */}
                {(paymentType || dueDate) && (
                    <div className="space-y-2 mb-4 pb-4 border-b">
                        {paymentType && (
                            <div className="flex items-center gap-2 text-sm">
                                <CreditCard className="h-4 w-4 text-muted-foreground" />
                                <span className="text-muted-foreground">Tipo:</span>
                                <Badge variant="outline">
                                    {paymentType === 'cash' ? 'Contado' : 'Crédito'}
                                </Badge>
                            </div>
                        )}
                        {dueDate && (
                            <div className="flex items-center gap-2 text-sm">
                                <Calendar className="h-4 w-4 text-muted-foreground" />
                                <span className="text-muted-foreground">Vence:</span>
                                <span className="font-medium">{format(dueDate, "PPP", { locale: es })}</span>
                            </div>
                        )}
                    </div>
                )}

                <div className="space-y-3 text-sm">
                    <div className="flex justify-between">
                        <span className="text-muted-foreground">Subtotal</span>
                        <span className="font-medium">{fmt(subtotal)}</span>
                    </div>

                    {discountTotal > 0 && (
                        <div className="flex justify-between text-red-600">
                            <span>Descuentos</span>
                            <span>-{fmt(discountTotal)}</span>
                        </div>
                    )}

                    <div className="flex justify-between">
                        <span className="text-muted-foreground">Impuestos</span>
                        <span className="font-medium">{fmt(taxTotal)}</span>
                    </div>

                    {onRoundingChange && (
                        <div className="space-y-1">
                            <label className="text-xs text-muted-foreground">Redondeo</label>
                            <NumberInput
                                value={rounding}
                                onChange={(v) => onRoundingChange(Number(v || 0))}
                                step={roundingStep}
                                decimalScale={2}
                                fixedDecimalScale
                            />
                        </div>
                    )}
                </div>

                <Separator className="my-4" />

                <div className="space-y-2">
                    <div className="flex justify-between text-base font-bold">
                        <span>Total</span>
                        <span>{fmt(total)}</span>
                    </div>

                    {payments.length > 0 && (
                        <>
                            <div className="flex justify-between text-sm text-green-600">
                                <span>Pagado</span>
                                <span>-{fmt(totalPaid)}</span>
                            </div>
                            <div className="flex justify-between text-base font-bold text-orange-600">
                                <span>Saldo</span>
                                <span>{fmt(balance ?? (total - totalPaid))}</span>
                            </div>
                        </>
                    )}
                </div>
            </div>

            <Separator />

            <div className="space-y-2">
                {onSaveDraft && (
                    <Button
                        onClick={onSaveDraft}
                        disabled={saving}
                        className="w-full"
                        variant="outline"
                    >
                        {saving ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Save className="h-4 w-4 mr-2" />}
                        Guardar borrador
                    </Button>
                )}

                {onIssue && canIssue && status === 'draft' && (
                    <Button
                        onClick={onIssue}
                        className="w-full"
                    >
                        <Send className="h-4 w-4 mr-2" />
                        Emitir factura
                    </Button>
                )}

                {onRegisterPayment && canRegisterPayment && (
                    <Button
                        onClick={onRegisterPayment}
                        className="w-full"
                        variant="secondary"
                    >
                        <Banknote className="h-4 w-4 mr-2" />
                        Registrar pago
                    </Button>
                )}

                {onPrint && canPrint && (
                    <Button
                        onClick={onPrint}
                        className="w-full"
                        variant="outline"
                    >
                        <Printer className="h-4 w-4 mr-2" />
                        Imprimir
                    </Button>
                )}
            </div>
        </Card>
    );
}
