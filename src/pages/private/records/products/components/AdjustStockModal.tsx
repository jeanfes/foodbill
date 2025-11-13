import { useMemo } from 'react';
import type { Product } from '@/interfaces/product';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { NumberInput } from '@/components/ui/number-input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';

interface AdjustStockModalProps {
    product: Product | null;
    open: boolean;
    onClose: () => void;
    onAdjust: (args: { productId: string; warehouseId: string; qty: number; reason?: string }) => void;
}

export function AdjustStockModal({ product, open, onClose, onAdjust }: AdjustStockModalProps) {
    const schema = useMemo(() => z.object({
        warehouseId: z.string().min(1, 'Selecciona una bodega'),
        quantity: z.coerce.number().int().refine(v => !isNaN(v), 'Cantidad inválida').refine(v => v !== 0, 'La cantidad no puede ser 0'),
        reason: z.string().optional().or(z.literal('')),
    }), []);

    type FormValues = z.infer<typeof schema>;

    const form = useForm<FormValues>({
        resolver: zodResolver(schema) as any,
        mode: 'onBlur',
        reValidateMode: 'onBlur',
        criteriaMode: 'firstError',
        defaultValues: {
            warehouseId: '',
            quantity: 0,
            reason: '',
        }
    });

    const submit = (values: FormValues) => {
        if (!product) return;

        const warehouse = product.stockByWarehouse?.find(w => w.warehouseId === values.warehouseId);
        const currentStock = warehouse?.stock || 0;
        const qty = Number(values.quantity);

        if (currentStock + qty < 0) {
            form.setError('quantity', { type: 'validate', message: `Stock insuficiente. Stock actual: ${currentStock}` });
            return;
        }

        onAdjust({
            productId: product.id,
            warehouseId: values.warehouseId,
            qty,
            reason: values.reason || undefined,
        });

        form.reset();
        onClose();
    };

    if (!product) return null;

    return (
        <Dialog open={open} onOpenChange={(v: boolean) => { if (!v) onClose(); }}>
            <DialogContent className="max-w-lg">
                <DialogHeader>
                    <DialogTitle className="text-xl">Ajustar Stock - {product.name}</DialogTitle>
                </DialogHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(submit)} className="space-y-4">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            <FormField
                                control={form.control}
                                name="warehouseId"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Bodega</FormLabel>
                                        <FormControl>
                                            <Select value={field.value} onValueChange={field.onChange}>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Selecciona bodega" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {product.stockByWarehouse?.map((w) => (
                                                        <SelectItem key={w.warehouseId} value={w.warehouseId}>
                                                            {w.warehouseName || w.warehouseId} (Stock: {w.stock})
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="quantity"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Cantidad </FormLabel>
                                        <FormControl>
                                            <NumberInput
                                                value={Number(field.value) || 0}
                                                onValueChange={(v) => field.onChange(v ?? 0)}
                                                decimalScale={0}
                                                fixedDecimalScale={false}
                                                placeholder="Ej: +10 o -5"
                                            />
                                        </FormControl>
                                        <FormMessage />
                                        <p className="text-xs text-muted-foreground">Usa números positivos para agregar o negativos para restar</p>
                                    </FormItem>
                                )}
                            />
                        </div>

                        <FormField
                            control={form.control}
                            name="reason"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Motivo (opcional)</FormLabel>
                                    <FormControl>
                                        <Input {...field} placeholder="Ej: Compra, Venta, Ajuste de inventario" />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <DialogFooter className="gap-2 sm:gap-3">
                            <Button type="button" variant="ghost" onClick={onClose}>Cancelar</Button>
                            <Button type="submit">Ajustar Stock</Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
}
