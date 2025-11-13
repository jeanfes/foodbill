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
                    <form onSubmit={form.handleSubmit(submit)} className="space-y-5">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <FormField
                                control={form.control}
                                name="name"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-sm mb-1.5 block">Nombre</FormLabel>
                                        <FormControl>
                                            <Input placeholder="Nombre del producto" aria-label="Nombre" className="h-10" {...field} />
                                        </FormControl>
                                        <FormMessage className="text-xs" />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="sku"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-sm mb-1.5 block">SKU (opcional)</FormLabel>
                                        <FormControl>
                                            <Input placeholder="SKU" aria-label="SKU" className="h-10" {...field} />
                                        </FormControl>
                                        <p className="text-xs text-muted-foreground mt-1">Usa un código único para facilitar búsquedas.</p>
                                        <FormMessage className="text-xs" />
                                    </FormItem>
                                )}
                            />
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <FormField
                                control={form.control}
                                name="price"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-sm mb-1.5 block">Precio (COP)</FormLabel>
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
                                                className="h-10"
                                            />
                                        </FormControl>
                                        <FormMessage className="text-xs" />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="categoryName"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-sm mb-1.5 block">Categoría</FormLabel>
                                        <FormControl>
                                            <Input placeholder="Ej: Bebidas, Postres" aria-label="Categoría" className="h-10" {...field} />
                                        </FormControl>
                                        <FormMessage className="text-xs" />
                                    </FormItem>
                                )}
                            />
                        </div>

                        <div>
                            <div className="text-sm font-medium text-muted-foreground mb-3">Inventario</div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
                                                <Label htmlFor="trackInventory" className="cursor-pointer text-sm">Gestiona inventario</Label>
                                            </div>
                                            <FormMessage className="text-xs" />
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
                                                <Label htmlFor="isComposite" className="cursor-pointer text-sm">Es compuesto</Label>
                                            </div>
                                            <FormMessage className="text-xs" />
                                        </FormItem>
                                    )}
                                />
                            </div>

                            {form.watch('trackInventory') && (
                                <FormField
                                    control={form.control}
                                    name="minStock"
                                    render={({ field }) => (
                                        <FormItem className="w-full mt-4">
                                            <FormLabel className="text-sm mb-1.5 block">Stock mínimo</FormLabel>
                                            <FormControl>
                                                <NumberInput
                                                    value={Number(field.value) || 0}
                                                    onValueChange={(v) => field.onChange(v ?? 0)}
                                                    decimalScale={0}
                                                    min={0}
                                                    placeholder="0"
                                                    className="h-10"
                                                />
                                            </FormControl>
                                            <p className="text-xs text-muted-foreground mt-1">Alerta cuando el stock esté por debajo.</p>
                                            <FormMessage className="text-xs" />
                                        </FormItem>
                                    )}
                                />
                            )}
                        </div>

                        <DialogFooter>
                            <DialogClose asChild>
                                <Button type="button" variant="ghost" className="h-9">Cancelar</Button>
                            </DialogClose>
                            <Button type="submit" disabled={form.formState.isSubmitting} className="h-9">
                                {form.formState.isSubmitting ? 'Guardando...' : 'Guardar'}
                            </Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
}
