import { useMemo } from 'react';
import type { Product } from '@/interfaces/product';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogClose } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { NumberInput } from '@/components/ui/number-input';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';

interface ProductFormModalProps {
    open: boolean;
    onClose: () => void;
    onSave: (product: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>) => void;
    initial?: Partial<Product>;
}

export function ProductFormModal({ open, onClose, onSave, initial }: ProductFormModalProps) {
    const schema = useMemo(() => z.object({
        name: z.string().min(2, 'El nombre es requerido (mínimo 2 caracteres)'),
        sku: z.string().optional().or(z.literal('')),
        price: z.coerce.number().min(1, 'El precio debe ser mayor a 0 COP'),
        categoryName: z.string().optional().or(z.literal('')),
        trackInventory: z.boolean(),
        isComposite: z.boolean(),
    }), []);

    type FormValues = z.infer<typeof schema>;

    const form = useForm<FormValues>({
        // Tipos del resolver con zod v4 pueden ser estrictos; casteamos para evitar fricciones.
        resolver: zodResolver(schema) as any,
        defaultValues: {
            name: initial?.name || '',
            price: initial?.price || 0,
            categoryName: initial?.categoryName || '',
            trackInventory: initial?.trackInventory ?? true,
            isComposite: initial?.isComposite || false,
            sku: initial?.sku || '',
        }
    });

    const submit = (values: FormValues) => {
        const payload: Omit<Product, 'id' | 'createdAt' | 'updatedAt'> = {
            name: values.name,
            price: Number(values.price) || 0,
            categoryId: initial?.categoryId || '',
            categoryName: values.categoryName || '',
            status: initial?.status || 'active',
            trackInventory: !!values.trackInventory,
            stockByWarehouse: initial?.stockByWarehouse || [],
            minStock: initial?.minStock,
            isComposite: !!values.isComposite,
            recipe: initial?.recipe || [],
            tags: initial?.tags || [],
            imageUrl: initial?.imageUrl || '',
            sku: values.sku || '',
            description: initial?.description || '',
            cost: initial?.cost,
            visibility: initial?.visibility
        };
        onSave(payload);
        onClose();
    };

    return (
        <Dialog open={open} onOpenChange={(v: boolean) => { if (!v) onClose(); }}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>{initial ? 'Editar producto' : 'Nuevo producto'}</DialogTitle>
                </DialogHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(submit)} className="flex flex-col gap-3">
                        <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Nombre</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Nombre" aria-label="Nombre" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="sku"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>SKU (opcional)</FormLabel>
                                    <FormControl>
                                        <Input placeholder="SKU (opcional)" aria-label="SKU" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="price"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Precio (COP)</FormLabel>
                                    <FormControl>
                                        <NumberInput
                                            value={Number(field.value) || 0}
                                            onValueChange={(v) => field.onChange(v ?? 0)}
                                            thousandSeparator="."
                                            decimalSeparator=","
                                            decimalScale={0}
                                            fixedDecimalScale={false}
                                            min={0}
                                            stepper={100}
                                            prefix="$ "
                                            suffix=" COP"
                                            placeholder="Precio (COP)"
                                            aria-label="Precio (COP)"
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="categoryName"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Categoría</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Categoría" aria-label="Categoría" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="trackInventory"
                            render={({ field }) => (
                                <FormItem>
                                    <div className="flex items-center gap-2">
                                        <FormControl>
                                            <Checkbox
                                                id="trackInventory"
                                                checked={!!field.value}
                                                onCheckedChange={(v) => field.onChange(!!v)}
                                                aria-label="Gestiona inventario"
                                            />
                                        </FormControl>
                                        <Label htmlFor="trackInventory" className="cursor-pointer">Gestiona inventario</Label>
                                    </div>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="isComposite"
                            render={({ field }) => (
                                <FormItem>
                                    <div className="flex items-center gap-2">
                                        <FormControl>
                                            <Checkbox
                                                id="isComposite"
                                                checked={!!field.value}
                                                onCheckedChange={(v) => field.onChange(!!v)}
                                                aria-label="Es compuesto"
                                            />
                                        </FormControl>
                                        <Label htmlFor="isComposite" className="cursor-pointer">Es compuesto</Label>
                                    </div>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <DialogFooter>
                            <Button type="submit">Guardar</Button>
                            <DialogClose asChild>
                                <Button type="button" variant="ghost">Cancelar</Button>
                            </DialogClose>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
}
