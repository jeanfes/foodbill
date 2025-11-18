import { useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import type { CashBox, CashBoxFormData } from '@/interfaces/cashbox';
import { usersMock } from '@/lib/mockData/users';

const schema = z.object({
    name: z.string().min(2, 'El nombre debe tener al menos 2 caracteres'),
    code: z.string().min(2, 'El código debe tener al menos 2 caracteres'),
    description: z.string().optional().or(z.literal('')),
    location: z.string().optional().or(z.literal('')),
    active: z.boolean(),
    assignedUserId: z.string().optional().or(z.literal('')),
    requiresOpeningClosing: z.boolean(),
});

interface Props {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    initial?: CashBox | null;
    onSubmit: (data: CashBoxFormData) => void;
}

export function CashBoxFormDialog({ open, onOpenChange, initial, onSubmit }: Props) {
    const { register, handleSubmit, reset, control, formState: { errors, isSubmitting } } = useForm<CashBoxFormData>({
        resolver: zodResolver(schema),
        mode: 'onBlur',
        defaultValues: {
            name: '',
            code: '',
            description: '',
            location: '',
            active: true,
            assignedUserId: '',
            requiresOpeningClosing: true,
        },
    });

    useEffect(() => {
        if (open) {
            reset(initial ? {
                name: initial.name,
                code: initial.code,
                description: initial.description || '',
                location: initial.location || '',
                active: initial.active,
                assignedUserId: initial.assignedUserId || '',
                requiresOpeningClosing: initial.requiresOpeningClosing,
            } : {
                name: '',
                code: '',
                description: '',
                location: '',
                active: true,
                assignedUserId: '',
                requiresOpeningClosing: true,
            });
        }
    }, [open, initial, reset]);

    const submit = (data: CashBoxFormData) => {
        onSubmit({
            ...data,
            assignedUserId: data.assignedUserId || undefined,
        });
        onOpenChange(false);
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle className="text-xl font-semibold">
                        {initial ? 'Editar caja' : 'Nueva caja'}
                    </DialogTitle>
                    <DialogDescription className="text-sm">
                        {initial ? 'Actualiza la información de la caja' : 'Completa los datos de la nueva caja. Los campos marcados con * son obligatorios.'}
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit(submit)} className="space-y-5">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                            <Label htmlFor="name" className="text-sm mb-1.5 block">Nombre *</Label>
                            <Input
                                id="name"
                                placeholder="Ej: Caja Principal"
                                className="h-10"
                                {...register('name')}
                            />
                            {errors.name && <p className="text-xs text-destructive mt-1">{errors.name.message}</p>}
                        </div>

                        <div>
                            <Label htmlFor="code" className="text-sm mb-1.5 block">Código *</Label>
                            <Input
                                id="code"
                                placeholder="Ej: CX-001"
                                className="h-10 font-mono"
                                {...register('code')}
                            />
                            {errors.code && <p className="text-xs text-destructive mt-1">{errors.code.message}</p>}
                        </div>
                    </div>

                    <div>
                        <Label htmlFor="description" className="text-sm mb-1.5 block">Descripción</Label>
                        <Input
                            id="description"
                            placeholder="Descripción opcional"
                            className="h-10"
                            {...register('description')}
                        />
                        {errors.description && <p className="text-xs text-destructive mt-1">{errors.description.message}</p>}
                    </div>

                    <div>
                        <Label htmlFor="location" className="text-sm mb-1.5 block">Ubicación</Label>
                        <Input
                            id="location"
                            placeholder="Ej: Cocina, Barra, Móvil"
                            className="h-10"
                            {...register('location')}
                        />
                        {errors.location && <p className="text-xs text-destructive mt-1">{errors.location.message}</p>}
                    </div>

                    <div>
                        <Label htmlFor="assignedUserId" className="text-sm mb-1.5 block">Usuario asignado</Label>
                        <Controller
                            control={control}
                            name="assignedUserId"
                            render={({ field }) => (
                                <Select
                                    value={field.value || 'unassigned'}
                                    onValueChange={(v) => field.onChange(v === 'unassigned' ? '' : v)}
                                >
                                    <SelectTrigger id="assignedUserId" className="h-10">
                                        <SelectValue placeholder="Sin asignar" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="unassigned">Sin asignar</SelectItem>
                                        {usersMock.map(u => (
                                            <SelectItem key={u.id} value={u.id}>
                                                {u.name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            )}
                        />
                        {errors.assignedUserId && <p className="text-xs text-destructive mt-1">{errors.assignedUserId.message}</p>}
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <Controller
                            control={control}
                            name="active"
                            render={({ field }) => (
                                <div className="flex items-center justify-between rounded-md border px-4 py-3 bg-muted/30">
                                    <div>
                                        <Label htmlFor="active" className="text-sm font-medium cursor-pointer">
                                            Caja activa
                                        </Label>
                                        <p className="text-xs text-muted-foreground mt-0.5">
                                            Disponible para uso
                                        </p>
                                    </div>
                                    <Switch
                                        id="active"
                                        checked={field.value}
                                        onCheckedChange={field.onChange}
                                    />
                                </div>
                            )}
                        />

                        <Controller
                            control={control}
                            name="requiresOpeningClosing"
                            render={({ field }) => (
                                <div className="flex items-center justify-between rounded-md border px-4 py-3 bg-muted/30">
                                    <div>
                                        <Label htmlFor="requiresOpeningClosing" className="text-sm font-medium cursor-pointer">
                                            Apertura/Cierre
                                        </Label>
                                        <p className="text-xs text-muted-foreground mt-0.5">
                                            Control manual
                                        </p>
                                    </div>
                                    <Switch
                                        id="requiresOpeningClosing"
                                        checked={field.value}
                                        onCheckedChange={field.onChange}
                                    />
                                </div>
                            )}
                        />
                    </div>

                    <DialogFooter className="gap-2">
                        <Button
                            type="button"
                            variant="ghost"
                            onClick={() => onOpenChange(false)}
                            disabled={isSubmitting}
                            className="h-9"
                        >
                            Cancelar
                        </Button>
                        <Button
                            type="submit"
                            disabled={isSubmitting}
                            className="h-9"
                        >
                            {isSubmitting ? 'Guardando...' : (initial ? 'Guardar cambios' : 'Crear caja')}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
