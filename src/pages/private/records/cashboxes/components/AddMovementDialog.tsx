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
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { NumberInput } from '@/components/ui/number-input';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';
import type { AddMovementData, MovementType } from '@/interfaces/cashbox';
import { usersMock } from '@/lib/mockData/users';

const schema = z.object({
    type: z.enum(['SALE', 'INCOME', 'EXPENSE', 'WITHDRAWAL', 'ADJUSTMENT', 'OPENING', 'CLOSING']),
    amount: z.number().min(0.01, 'El monto debe ser mayor a 0'),
    reference: z.string().optional(),
    note: z.string().optional(),
    userId: z.string().min(1, 'Debe seleccionar un usuario'),
}); interface AddMovementDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onSubmit: (data: AddMovementData) => void;
    cashBoxName: string;
}

const movementTypes: { value: MovementType; label: string }[] = [
    { value: 'SALE', label: 'Venta' },
    { value: 'INCOME', label: 'Ingreso' },
    { value: 'EXPENSE', label: 'Gasto' },
    { value: 'WITHDRAWAL', label: 'Retiro' },
    { value: 'ADJUSTMENT', label: 'Ajuste' },
];

export function AddMovementDialog({
    open,
    onOpenChange,
    onSubmit,
    cashBoxName
}: AddMovementDialogProps) {
    const [submitting, setSubmitting] = useState(false);

    const { register, handleSubmit, setValue, watch, formState: { errors }, reset } = useForm<AddMovementData>({
        resolver: zodResolver(schema),
        defaultValues: {
            type: 'SALE',
            amount: 0,
            reference: '',
            note: '',
            userId: '',
        },
    });

    const handleFormSubmit = async (data: AddMovementData) => {
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

    const selectedType = watch('type');
    const isPositiveMovement = selectedType === 'SALE' || selectedType === 'INCOME' || selectedType === 'ADJUSTMENT';

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-md">
                <DialogHeader>
                    <DialogTitle>Registrar movimiento</DialogTitle>
                    <DialogDescription>
                        Agrega un movimiento a <strong>{cashBoxName}</strong>.
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6 mt-4">
                    <div className="space-y-2">
                        <Label htmlFor="type" className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                            Tipo de movimiento *
                        </Label>
                        <Select
                            value={watch('type')}
                            onValueChange={(v) => setValue('type', v as MovementType)}
                        >
                            <SelectTrigger id="type" className="h-10">
                                <SelectValue placeholder="Seleccionar tipo" />
                            </SelectTrigger>
                            <SelectContent>
                                {movementTypes.map(type => (
                                    <SelectItem key={type.value} value={type.value}>
                                        {type.label}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        {errors.type && (
                            <p className="text-xs text-destructive">{errors.type.message}</p>
                        )}
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="amount" className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                            Monto *
                        </Label>
                        <div className="flex items-start gap-2">
                            <div className={`flex items-center justify-center h-10 px-3 rounded-md border shrink-0 ${isPositiveMovement ? 'bg-green-50 text-green-700 border-green-200' : 'bg-red-50 text-red-700 border-red-200'}`}>
                                <span className="font-semibold">{isPositiveMovement ? '+' : '-'}</span>
                            </div>
                            <div className="flex-1">
                                <NumberInput
                                    id="amount"
                                    value={watch('amount')}
                                    onValueChange={(value) => setValue('amount', value || 0)}
                                    placeholder="0"
                                    className="h-10"
                                    min={0.01}
                                    prefix="$"
                                    thousandSeparator="."
                                    decimalSeparator=","
                                    decimalScale={0}
                                />
                                {errors.amount && (
                                    <p className="text-xs text-destructive mt-1">{errors.amount.message}</p>
                                )}
                            </div>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="reference" className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                            Referencia (opcional)
                        </Label>
                        <Input
                            id="reference"
                            {...register('reference')}
                            placeholder="Ej: POS-123, Factura-456"
                            className="h-10"
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="userId" className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                            Usuario *
                        </Label>
                        <Select
                            value={watch('userId')}
                            onValueChange={(v) => setValue('userId', v)}
                        >
                            <SelectTrigger id="userId" className="h-10">
                                <SelectValue placeholder="Seleccionar usuario" />
                            </SelectTrigger>
                            <SelectContent>
                                {usersMock.map(user => (
                                    <SelectItem key={user.id} value={user.id}>
                                        {user.name}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        {errors.userId && (
                            <p className="text-xs text-destructive">{errors.userId.message}</p>
                        )}
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="note" className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                            Nota (opcional)
                        </Label>
                        <Textarea
                            id="note"
                            {...register('note')}
                            placeholder="Detalles adicionales del movimiento..."
                            className="min-h-20 resize-none"
                        />
                    </div>

                    <div className="flex justify-end gap-2 pt-2">
                        <Button type="button" variant="outline" onClick={handleCancel} disabled={submitting}>
                            Cancelar
                        </Button>
                        <Button type="submit" disabled={submitting}>
                            {submitting ? 'Agregando...' : 'Agregar movimiento'}
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
}
