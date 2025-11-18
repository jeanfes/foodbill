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
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';
import type { OpenCashBoxData } from '@/interfaces/cashbox';
import { usersMock } from '@/lib/mockData/users';

const schema = z.object({
    initialAmount: z.number().min(0, 'El monto inicial debe ser mayor o igual a 0'),
    userId: z.string().optional(),
    note: z.string().optional(),
});

interface OpenBoxDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onSubmit: (data: OpenCashBoxData) => void;
    cashBoxName: string;
}

export function OpenBoxDialog({
    open,
    onOpenChange,
    onSubmit,
    cashBoxName
}: OpenBoxDialogProps) {
    const [submitting, setSubmitting] = useState(false);

    const { register, handleSubmit, setValue, watch, formState: { errors }, reset } = useForm<OpenCashBoxData>({
        resolver: zodResolver(schema),
        defaultValues: {
            initialAmount: 0,
            userId: undefined,
            note: '',
        },
    });

    const handleFormSubmit = async (data: OpenCashBoxData) => {
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
                    <DialogTitle>Abrir caja</DialogTitle>
                    <DialogDescription>
                        Registra el monto inicial para comenzar el turno de <strong>{cashBoxName}</strong>.
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6 mt-4">
                    <div className="space-y-2">
                        <Label htmlFor="initialAmount" className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                            Monto inicial *
                        </Label>
                        <NumberInput
                            id="initialAmount"
                            value={watch('initialAmount')}
                            onValueChange={(value) => setValue('initialAmount', value || 0)}
                            placeholder="0"
                            className="h-10"
                            min={0}
                        />
                        {errors.initialAmount && (
                            <p className="text-xs text-destructive">{errors.initialAmount.message}</p>
                        )}
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="userId" className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                            Usuario (opcional)
                        </Label>
                        <Select
                            value={watch('userId') || 'unassigned'}
                            onValueChange={(v) => setValue('userId', v === 'unassigned' ? undefined : v)}
                        >
                            <SelectTrigger id="userId" className="h-10">
                                <SelectValue placeholder="Seleccionar usuario" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="unassigned">Sin asignar</SelectItem>
                                {usersMock.map(user => (
                                    <SelectItem key={user.id} value={user.id}>
                                        {user.name}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="note" className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                            Nota (opcional)
                        </Label>
                        <Textarea
                            id="note"
                            {...register('note')}
                            placeholder="Observaciones sobre la apertura..."
                            className="min-h-20 resize-none"
                        />
                    </div>

                    <div className="flex justify-end gap-2 pt-2">
                        <Button type="button" variant="outline" onClick={handleCancel} disabled={submitting}>
                            Cancelar
                        </Button>
                        <Button type="submit" disabled={submitting}>
                            {submitting ? 'Abriendo...' : 'Abrir caja'}
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
}
