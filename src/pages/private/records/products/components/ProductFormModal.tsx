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
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from '@/components/ui/form';

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
        minStock: z.coerce.number().int().min(0, 'Debe ser 0 o mayor').optional().or(z.literal(0 as unknown as number)),
    }), []);

    type FormValues = z.infer<typeof schema>;

    const form = useForm<FormValues>({
        // Tipos del resolver con zod v4 pueden ser estrictos; casteamos para evitar fricciones.
        resolver: zodResolver(schema) as any,
        mode: 'onBlur',
        reValidateMode: 'onBlur',
        criteriaMode: 'firstError',
        defaultValues: {
            name: initial?.name || '',
            price: initial?.price || 0,
            categoryName: initial?.categoryName || '',
            trackInventory: initial?.trackInventory ?? true,
            isComposite: initial?.isComposite || false,
            sku: initial?.sku || '',
            minStock: initial?.minStock ?? 0,
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
            minStock: typeof (values as any).minStock === 'number' ? (values as any).minStock : initial?.minStock,
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
            <DialogContent className="max-w-xl">
                <DialogHeader>
                    <DialogTitle>{initial ? 'Editar producto' : 'Nuevo producto'}</DialogTitle>
                </DialogHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(submit)} className="flex flex-col gap-5">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            <FormField
                                control={form.control}
                                name="name"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Nombre</FormLabel>
                                        <FormControl>
                                            <Input placeholder="Nombre del producto" aria-label="Nombre" {...field} />
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
                                            <Input placeholder="SKU" aria-label="SKU" {...field} />
                                        </FormControl>
                                        <FormDescription>Usa un código único para facilitar búsquedas.</FormDescription>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
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
                                                placeholder="0"
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
                                            <Input placeholder="Ej: Bebidas, Postres" aria-label="Categoría" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>

                        <div className="space-y-2">
                            <div className="text-sm font-medium text-muted-foreground">Inventario</div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                <FormField
                                    control={form.control}
                                    name="trackInventory"
                                    render={({ field }) => (
                                        <FormItem>
                                            <div className="flex items-center gap-2 h-10">
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
                                            <div className="flex items-center gap-2 h-10">
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
                            </div>

                            {form.watch('trackInventory') && (
                                <FormField
                                    control={form.control}
                                    name="minStock"
                                    render={({ field }) => (
                                        <FormItem className="w-full">
                                            <div className="flex flex-col items-start">
                                                <FormLabel>Stock mínimo</FormLabel>
                                                <FormControl>
                                                    <NumberInput
                                                        value={Number(field.value) || 0}
                                                        onValueChange={(v) => field.onChange(v ?? 0)}
                                                        decimalScale={0}
                                                        min={0}
                                                        placeholder="0"
                                                    />
                                                </FormControl>
                                            </div>
                                            <FormDescription>Alerta cuando el stock esté por debajo.</FormDescription>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            )}
                        </div>

                        <DialogFooter>
                            <DialogClose asChild>
                                <Button type="button" variant="ghost">Cancelar</Button>
                            </DialogClose>
                            <Button type="submit" disabled={form.formState.isSubmitting}>
                                {form.formState.isSubmitting ? 'Guardando...' : 'Guardar'}
                            </Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
}
