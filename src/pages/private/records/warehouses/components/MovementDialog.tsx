import { useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import type { MovementType, StockMovement } from "@/interfaces/stockMovement";
import type { Warehouse } from "@/interfaces/warehouse";

const schema = z.object({
    type: z.enum(["IN", "OUT", "ADJUST", "TRANSFER"]),
    productId: z.string().min(1, "Requerido"),
    productName: z.string().min(1),
    quantity: z.number().positive("Debe ser mayor a 0"),
    note: z.string().optional(),
    toWarehouseId: z.string().optional(),
});

export type MovementFormValues = z.infer<typeof schema>;

interface Props {
    open: boolean;
    onOpenChange: (v: boolean) => void;
    onSubmit: (movement: Omit<StockMovement, "id" | "date">) => void;
    typeDefault?: MovementType;
    products: Array<{ id: string; name: string }>;
    warehouses: Warehouse[];
}

export function MovementDialog({ open, onOpenChange, onSubmit, typeDefault = "IN", products, warehouses }: Props) {
    const { control, handleSubmit, watch, reset, formState: { errors } } = useForm<MovementFormValues>({
        resolver: zodResolver(schema),
        mode: "onBlur",
        defaultValues: { type: typeDefault, productId: "", productName: "", quantity: 1, note: "" },
    });

    useEffect(() => {
        reset({ type: typeDefault, productId: "", productName: "", quantity: 1, note: "" });
    }, [typeDefault, reset]);

    const values = watch();
    const isTransfer = values.type === "TRANSFER";

    const submit = (v: MovementFormValues) => {
        const product = products.find(p => p.id === v.productId);
        onSubmit({
            type: v.type,
            productId: v.productId,
            productName: product?.name ?? v.productName,
            quantity: v.quantity,
            note: v.note,
            warehouseId: "", // se completará por el contenedor
            toWarehouseId: isTransfer ? v.toWarehouseId : undefined,
        });
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-xl">
                <DialogHeader>
                    <DialogTitle>Nuevo movimiento</DialogTitle>
                    <DialogDescription>Registra una entrada, salida, ajuste o transferencia (simulado).</DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit(submit)} className="space-y-5">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                            <Label className="text-sm mb-1.5 block">Tipo</Label>
                            <Controller
                                control={control}
                                name="type"
                                render={({ field }) => (
                                    <Select value={field.value} onValueChange={field.onChange}>
                                        <SelectTrigger className="h-10">
                                            <SelectValue placeholder="Selecciona" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="IN">Entrada</SelectItem>
                                            <SelectItem value="OUT">Salida</SelectItem>
                                            <SelectItem value="ADJUST">Ajuste</SelectItem>
                                            <SelectItem value="TRANSFER">Transferencia</SelectItem>
                                        </SelectContent>
                                    </Select>
                                )}
                            />
                            {errors.type && <p className="text-sm text-destructive mt-1">{errors.type.message}</p>}
                        </div>

                        {isTransfer && (
                            <div>
                                <Label className="text-sm mb-1.5 block">Bodega destino</Label>
                                <Controller
                                    control={control}
                                    name="toWarehouseId"
                                    render={({ field }) => (
                                        <Select value={field.value} onValueChange={field.onChange}>
                                            <SelectTrigger className="h-10">
                                                <SelectValue placeholder="Selecciona" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {warehouses.map(w => (
                                                    <SelectItem key={w.id} value={w.id}>{w.name}</SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    )}
                                />
                            </div>
                        )}
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                            <Label className="text-sm mb-1.5 block">Producto</Label>
                            <Controller
                                control={control}
                                name="productId"
                                render={({ field }) => (
                                    <Select value={field.value} onValueChange={field.onChange}>
                                        <SelectTrigger className="h-10">
                                            <SelectValue placeholder="Selecciona un producto" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {products.map(p => (
                                                <SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                )}
                            />
                            {errors.productId && <p className="text-sm text-destructive mt-1">{errors.productId.message}</p>}
                        </div>
                        <div>
                            <Label className="text-sm mb-1.5 block">Cantidad</Label>
                            <Controller
                                control={control}
                                name="quantity"
                                render={({ field }) => (
                                    <Input className="h-10" type="number" min={0.01} step={0.01} value={field.value} onChange={e => field.onChange(Number(e.target.value))} />
                                )}
                            />
                            {errors.quantity && <p className="text-sm text-destructive mt-1">{errors.quantity.message}</p>}
                        </div>
                    </div>

                    <div>
                        <Label className="text-sm mb-1.5 block">Nota (opcional)</Label>
                        <Controller
                            control={control}
                            name="note"
                            render={({ field }) => (
                                <Input className="h-10" placeholder="Descripción breve" value={field.value ?? ""} onChange={field.onChange} />
                            )}
                        />
                    </div>

                    <DialogFooter>
                        <Button className="h-9" type="button" variant="outline" onClick={() => onOpenChange(false)}>Cancelar</Button>
                        <Button className="h-9" type="submit">Agregar</Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
