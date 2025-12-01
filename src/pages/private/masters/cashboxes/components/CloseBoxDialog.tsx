import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { NumberInput } from '@/components/ui/number-input';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { AlertCircle } from 'lucide-react';
import type { CloseCashBoxData } from '@/interfaces/cashbox';

const schema = z.object({
    countedAmount: z.number().min(0, 'El monto contado debe ser mayor o igual a 0'),
    note: z.string().optional(),
});

interface CloseBoxDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onSubmit: (data: CloseCashBoxData) => void;
    cashBoxName: string;
    expectedAmount: number;
}

export function CloseBoxDialog({
    open,
    onOpenChange,
    onSubmit,
    cashBoxName,
    expectedAmount,
}: CloseBoxDialogProps) {
    const [submitting, setSubmitting] = useState(false);

    const { register, handleSubmit, setValue, watch, formState: { errors }, reset } = useForm<CloseCashBoxData>({
        resolver: zodResolver(schema),
        defaultValues: {
            countedAmount: 0,
            note: '',
        },
    });

    const countedAmount = watch('countedAmount');
    const difference = countedAmount - expectedAmount;

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('es-CO', {
            style: 'currency',
            currency: 'COP',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
        }).format(amount);
    };

    const handleFormSubmit = async (data: CloseCashBoxData) => {
        setSubmitting(true);
        try {
            await onSubmit(data);
            reset();
            onOpenChange(false);
        } finally {
            setSubmitting(false);
        }
    };

    const handleCancel = () => {
        reset();
        onOpenChange(false);
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-md">
                <DialogHeader>
                    <DialogTitle>Cerrar caja</DialogTitle>
                    <DialogDescription>
                        Al cerrar, ingresa el dinero contado para calcular sobrante/faltante de <strong>{cashBoxName}</strong>.
                    </DialogDescription>
                </DialogHeader>

                <Card className="p-4 bg-muted/50">
                    <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">Monto esperado</span>
                        <span className="text-lg font-semibold tabular-nums">
                            {formatCurrency(expectedAmount)}
                        </span>
                    </div>
                </Card>

                <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
                    <div className="space-y-2">
                        <Label htmlFor="countedAmount" className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                            Monto contado *
                        </Label>
                        <NumberInput
                            id="countedAmount"
                            value={countedAmount}
                            onValueChange={(value) => setValue('countedAmount', value || 0)}
                            placeholder="0"
                            className="h-10"
                            min={0}
                        />
                        {errors.countedAmount && (
                            <p className="text-xs text-destructive">{errors.countedAmount.message}</p>
                        )}
                    </div>

                    {countedAmount > 0 && (
                        <Card className={`p-4 ${difference !== 0 ? 'border-2' : ''} ${difference > 0 ? 'border-green-500 bg-green-50 dark:bg-green-950/20' : difference < 0 ? 'border-red-500 bg-red-50 dark:bg-red-950/20' : ''}`}>
                            <div className="flex items-center gap-2 mb-2">
                                {difference !== 0 && <AlertCircle className={`h-4 w-4 ${difference > 0 ? 'text-green-600' : 'text-red-600'}`} />}
                                <span className="text-sm font-medium">
                                    {difference > 0 ? 'Sobrante' : difference < 0 ? 'Faltante' : 'Exacto'}
                                </span>
                            </div>
                            <div className="flex items-baseline gap-2">
                                <span className={`text-2xl font-bold tabular-nums ${difference > 0 ? 'text-green-600' : difference < 0 ? 'text-red-600' : 'text-foreground'}`}>
                                    {difference > 0 ? '+' : ''}{formatCurrency(Math.abs(difference))}
                                </span>
                                {difference !== 0 && (
                                    <Badge variant={difference > 0 ? 'default' : 'destructive'}>
                                        {((Math.abs(difference) / expectedAmount) * 100).toFixed(2)}%
                                    </Badge>
                                )}
                            </div>
                        </Card>
                    )}

                    <div className="space-y-2">
                        <Label htmlFor="note" className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                            Observaciones (opcional)
                        </Label>
                        <Textarea
                            id="note"
                            {...register('note')}
                            placeholder="Notas sobre el cierre, explicación de diferencias..."
                            className="min-h-20 resize-none"
                        />
                    </div>

                    {difference !== 0 && countedAmount > 0 && (
                        <div className="flex items-start gap-2 p-3 rounded-lg bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800">
                            <AlertCircle className="h-4 w-4 text-amber-600 mt-0.5 shrink-0" />
                            <p className="text-xs text-amber-900 dark:text-amber-100">
                                Estás por cerrar la caja con una diferencia de <strong>{formatCurrency(Math.abs(difference))}</strong>.
                                Confirma que el monto contado es correcto.
                            </p>
                        </div>
                    )}

                    <div className="flex justify-end gap-2 pt-2">
                        <Button type="button" variant="outline" onClick={handleCancel} disabled={submitting}>
                            Cancelar
                        </Button>
                        <Button type="submit" variant="destructive" disabled={submitting}>
                            {submitting ? 'Cerrando...' : 'Cerrar caja'}
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
}
