import { useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import type { Warehouse } from "@/interfaces/warehouse";

const schema = z.object({
    name: z.string().min(2, "Requerido"),
    code: z.string().min(2, "Requerido"),
    description: z.string().optional(),
    location: z.string().min(2, "Requerido"),
    status: z.enum(["ACTIVE", "INACTIVE"]),
    manager: z.string().min(2, "Requerido"),
});

export type WarehouseFormValues = z.infer<typeof schema>;

interface Props {
    open: boolean;
    onOpenChange: (v: boolean) => void;
    onSubmit: (values: WarehouseFormValues) => void;
    initial?: Warehouse | null;
    usedCodes: string[];
}

export function WarehouseFormDialog({ open, onOpenChange, onSubmit, initial, usedCodes }: Props) {
    const { register, handleSubmit, reset, control, formState: { errors } } = useForm<WarehouseFormValues>({
        resolver: zodResolver(schema),
        mode: "onBlur",
        defaultValues: initial ?? { name: "", code: "", description: "", location: "", status: "ACTIVE", manager: "" },
    });

    useEffect(() => {
        reset(initial ?? { name: "", code: "", description: "", location: "", status: "ACTIVE", manager: "" });
    }, [initial, reset]);

    const submit = (values: WarehouseFormValues) => {
        if (!initial && usedCodes.includes(values.code)) {

            alert("El código ya existe, elige otro.");
            return;
        }
        onSubmit(values);
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-xl">
                <DialogHeader>
                    <DialogTitle className="text-xl font-semibold">{initial ? "Editar bodega" : "Nueva bodega"}</DialogTitle>
                    <DialogDescription className="text-sm">Completa los datos requeridos.</DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit(submit)} className="flex flex-col gap-5">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                            <Label htmlFor="name" className="text-sm mb-1.5 block">Nombre</Label>
                            <Input className="h-10" id="name" placeholder="Bodega Principal" aria-label="Nombre" {...register("name")} />
                            {errors.name && <p className="text-xs text-destructive mt-1">{errors.name.message}</p>}
                        </div>
                        <div>
                            <Label htmlFor="code" className="text-sm mb-1.5 block">Código</Label>
                            <Input className="h-10" id="code" placeholder="BOD-001" aria-label="Código" {...register("code")} />
                            {errors.code && <p className="text-xs text-destructive mt-1">{errors.code.message}</p>}
                        </div>
                    </div>

                    <div>
                        <Label htmlFor="description" className="text-sm mb-1.5 block">Descripción</Label>
                        <Input className="h-10" id="description" placeholder="Opcional" aria-label="Descripción" {...register("description")} />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                            <Label htmlFor="location" className="text-sm mb-1.5 block">Ubicación</Label>
                            <Input className="h-10" id="location" placeholder="Sede Norte" aria-label="Ubicación" {...register("location")} />
                            {errors.location && <p className="text-xs text-destructive mt-1">{errors.location.message}</p>}
                        </div>
                        <div>
                            <Label htmlFor="status" className="text-sm mb-1.5 block">Estado</Label>
                            <Controller
                                control={control}
                                name="status"
                                render={({ field }) => (
                                    <Select value={field.value} onValueChange={field.onChange}>
                                        <SelectTrigger className="h-10">
                                            <SelectValue placeholder="Selecciona estado" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="ACTIVE">Activa</SelectItem>
                                            <SelectItem value="INACTIVE">Inactiva</SelectItem>
                                        </SelectContent>
                                    </Select>
                                )}
                            />
                            {errors.status && <p className="text-xs text-destructive mt-1">{errors.status.message}</p>}
                        </div>
                    </div>

                    <div>
                        <Label htmlFor="manager" className="text-sm mb-1.5 block">Responsable</Label>
                        <Input className="h-10" id="manager" placeholder="Nombre del responsable" aria-label="Responsable" {...register("manager")} />
                        {errors.manager && <p className="text-xs text-destructive mt-1">{errors.manager.message}</p>}
                    </div>

                    <DialogFooter>
                        <Button className="h-9" type="button" variant="ghost" onClick={() => onOpenChange(false)}>Cancelar</Button>
                        <Button className="h-9" type="submit">Guardar</Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
