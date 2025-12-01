import { useMemo } from 'react';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { NumberInput } from '@/components/ui/number-input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import type { Table, TableFormData, TableStatus } from '@/interfaces/table';
import { useTablesMock } from '@/hooks/useTablesMock';

const schema = z.object({
    nombre: z.string().min(2, 'Requerido'),
    capacidad: z.coerce.number().int().min(1, 'Debe ser 1 o mayor'),
    estado: z.custom<TableStatus>(),
    ubicacion: z.string().optional().or(z.literal('')),
});

interface TableFormDialogProps {
    open: boolean;
    onClose: () => void;
    editing?: Table | null;
}

export function TableFormDialog({ open, onClose, editing }: TableFormDialogProps) {
    const { create, update } = useTablesMock();

    const defaultValues: TableFormData = useMemo(() => ({
        nombre: editing?.nombre || '',
        capacidad: editing?.capacidad || 2,
        estado: editing?.estado || 'disponible',
        ubicacion: editing?.ubicacion || '',
    }), [editing]);

    const form = useForm<TableFormData>({
        resolver: zodResolver(schema) as any,
        defaultValues,
        values: defaultValues,
    });

    const onSubmit = (values: TableFormData) => {
        if (editing) {
            update(editing.id, values);
        } else {
            create(values);
        }
        onClose();
    };

    return (
        <Dialog open={open} onOpenChange={(o) => { if (!o) onClose(); }}>
            <DialogContent className="sm:max-w-[520px]">
                <DialogHeader>
                    <DialogTitle>{editing ? 'Editar mesa' : 'Nueva mesa'}</DialogTitle>
                </DialogHeader>

                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5 mt-2">
                        <FormField
                            control={form.control}
                            name="nombre"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-sm mb-1.5 block">Nombre *</FormLabel>
                                    <FormControl>
                                        <Input className="h-10" placeholder="Mesa 7" {...field} />
                                    </FormControl>
                                    <FormMessage className="text-xs" />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="capacidad"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-sm mb-1.5 block">Capacidad *</FormLabel>
                                    <FormControl>
                                        <NumberInput min={1} className="h-10" placeholder="4" value={field.value} onChange={field.onChange} />
                                    </FormControl>
                                    <FormMessage className="text-xs" />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="estado"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-sm mb-1.5 block">Estado *</FormLabel>
                                    <FormControl>
                                        <Select value={field.value} onValueChange={field.onChange}>
                                            <SelectTrigger className="h-10">
                                                <SelectValue placeholder="Seleccionar estado" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="disponible">Disponible</SelectItem>
                                                <SelectItem value="ocupada">Ocupada</SelectItem>
                                                <SelectItem value="reservada">Reservada</SelectItem>
                                                <SelectItem value="inactiva">Inactiva</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </FormControl>
                                    <FormMessage className="text-xs" />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="ubicacion"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-sm mb-1.5 block">Ubicación</FormLabel>
                                    <FormControl>
                                        <Input className="h-10" placeholder="Terraza, Sala, VIP" {...field} />
                                    </FormControl>
                                    <FormMessage className="text-xs" />
                                </FormItem>
                            )}
                        />

                        <div className="flex justify-end gap-2">
                            <Button type="button" variant="ghost" className="h-9" onClick={onClose}>Cancelar</Button>
                            <Button type="submit" className="h-9">Guardar</Button>
                        </div>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
}
