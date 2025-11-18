import { motion } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { CreditCard, Banknote, ArrowRightLeft, HelpCircle, Printer } from 'lucide-react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import type { Payment, Invoice } from '@/interfaces/billing';

interface Props {
    payments: Payment[];
    invoice?: Invoice;
    onPrintReceipt?: (payment: Payment) => void;
}

export function PaymentHistoryList({ payments, invoice, onPrintReceipt }: Props) {
    const fmt = (n: number) => new Intl.NumberFormat('es-CO', {
        style: 'currency',
        currency: 'COP',
        maximumFractionDigits: 2
    }).format(n);

    const getMethodIcon = (method: Payment['method']) => {
        switch (method) {
            case 'cash':
                return <Banknote className="h-4 w-4" />;
            case 'card':
                return <CreditCard className="h-4 w-4" />;
            case 'transfer':
                return <ArrowRightLeft className="h-4 w-4" />;
            default:
                return <HelpCircle className="h-4 w-4" />;
        }
    };

    const getMethodLabel = (method: Payment['method']) => {
        const labels = {
            cash: 'Efectivo',
            card: 'Tarjeta',
            transfer: 'Transferencia',
            other: 'Otro'
        };
        return labels[method] || method;
    };

    const getStatusVariant = (status: Payment['status']) => {
        switch (status) {
            case 'confirmed':
                return 'default' as const;
            case 'pending':
                return 'secondary' as const;
            case 'failed':
                return 'destructive' as const;
            default:
                return 'outline' as const;
        }
    };

    if (payments.length === 0) {
        return (
            <Card className="p-6">
                <div className="text-center text-muted-foreground">
                    <Banknote className="h-12 w-12 mx-auto mb-3 opacity-20" />
                    <p>No hay pagos registrados</p>
                </div>
            </Card>
        );
    }

    const totalPaid = payments.reduce((sum, p) => sum + p.amount, 0);

    return (
        <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-lg">Historial de pagos</h3>
                <Badge variant="outline">
                    Total pagado: {fmt(totalPaid)}
                </Badge>
            </div>

            <div className="space-y-3">
                {payments.map((payment, index) => (
                    <motion.div
                        key={payment.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.05 }}
                        className="border rounded-lg p-4 hover:bg-muted/50 transition-colors"
                    >
                        <div className="flex items-start justify-between">
                            <div className="flex items-start gap-3 flex-1">
                                <div className="p-2 bg-primary/10 rounded-lg text-primary">
                                    {getMethodIcon(payment.method)}
                                </div>

                                <div className="flex-1 space-y-1">
                                    <div className="flex items-center gap-2">
                                        <span className="font-medium">{getMethodLabel(payment.method)}</span>
                                        <Badge variant={getStatusVariant(payment.status)} className="text-xs">
                                            {payment.status === 'confirmed' ? 'Confirmado' :
                                                payment.status === 'pending' ? 'Pendiente' :
                                                    payment.status === 'failed' ? 'Fallido' : payment.status}
                                        </Badge>
                                    </div>

                                    <div className="text-sm text-muted-foreground">
                                        {format(new Date(payment.date), "PPP 'a las' p", { locale: es })}
                                    </div>

                                    {payment.reference && (
                                        <div className="text-xs text-muted-foreground">
                                            Ref: {payment.reference}
                                        </div>
                                    )}

                                    {payment.notes && (
                                        <div className="text-xs text-muted-foreground mt-2 p-2 bg-muted/50 rounded">
                                            {payment.notes}
                                        </div>
                                    )}

                                    {payment.cashboxId && (
                                        <div className="text-xs text-muted-foreground">
                                            Caja: {payment.cashboxId}
                                        </div>
                                    )}

                                    <div className="text-xs text-muted-foreground">
                                        Recibido por: {payment.receivedBy}
                                    </div>
                                </div>
                            </div>

                            <div className="flex items-center gap-2">
                                <div className="text-right">
                                    <div className="font-semibold text-lg text-green-600">
                                        {fmt(payment.amount)}
                                    </div>
                                </div>

                                {onPrintReceipt && invoice && (
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        onClick={() => onPrintReceipt(payment)}
                                        title="Imprimir recibo"
                                    >
                                        <Printer className="h-4 w-4" />
                                    </Button>
                                )}
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>
        </Card>
    );
}
