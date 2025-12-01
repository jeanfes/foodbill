import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import * as LucideIcons from "lucide-react";
import type { Category, CategoryFormValues } from "@/interfaces/category";
import { iconOptions, colorOptions } from "../mock";
import { useState } from "react";

const schema = z.object({
    name: z.string().min(1, "El nombre es requerido"),
    description: z.string().optional(),
    icon: z.string().min(1, "Selecciona un ícono"),
    color: z.string().min(1, "Selecciona un color"),
});

interface CategoryFormDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onSubmit: (values: CategoryFormValues) => void;
    initial?: Category | null;
}

export function CategoryFormDialog({ open, onOpenChange, onSubmit, initial }: CategoryFormDialogProps) {
    const [selectedIcon, setSelectedIcon] = useState(initial?.icon || iconOptions[0].value);
    const [selectedColor, setSelectedColor] = useState(initial?.color || colorOptions[0].value);

    const { register, handleSubmit, formState: { errors }, reset } = useForm<CategoryFormValues>({
        resolver: zodResolver(schema),
        defaultValues: {
            name: initial?.name || "",
            description: initial?.description || "",
            icon: initial?.icon || iconOptions[0].value,
            color: initial?.color || colorOptions[0].value,
        },
    });

    const handleFormSubmit = (data: CategoryFormValues) => {
        onSubmit({ ...data, icon: selectedIcon, color: selectedColor });
        reset();
        setSelectedIcon(iconOptions[0].value);
        setSelectedColor(colorOptions[0].value);
    };

    const handleClose = (open: boolean) => {
        if (!open) {
            reset();
            setSelectedIcon(initial?.icon || iconOptions[0].value);
            setSelectedColor(initial?.color || colorOptions[0].value);
        }
        onOpenChange(open);
    };

    return (
        <Dialog open={open} onOpenChange={handleClose}>
            <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                    <DialogTitle>{initial ? "Editar categoría" : "Nueva categoría"}</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-5">
                    <div>
                        <Label htmlFor="name" className="text-sm mb-1.5 block">Nombre</Label>
                        <Input
                            id="name"
                            placeholder="Ej. Bebidas, Carnes, Postres..."
                            className="h-10"
                            {...register("name")}
                        />
                        {errors.name && <p className="text-xs text-destructive mt-1">{errors.name.message}</p>}
                    </div>

                    <div>
                        <Label htmlFor="description" className="text-sm mb-1.5 block">Descripción (opcional)</Label>
                        <Textarea
                            id="description"
                            placeholder="Describe brevemente esta categoría..."
                            className="resize-none min-h-20"
                            {...register("description")}
                        />
                    </div>

                    <div>
                        <Label className="text-sm mb-1.5 block">Ícono</Label>
                        <div className="grid grid-cols-8 gap-2">
                            {iconOptions.map((option) => {
                                const IconComponent = (LucideIcons as any)[option.value] || LucideIcons.Package;
                                return (
                                    <button
                                        key={option.value}
                                        type="button"
                                        onClick={() => setSelectedIcon(option.value)}
                                        className={`h-12 w-12 rounded-lg border-2 flex items-center justify-center transition hover:scale-105 ${selectedIcon === option.value
                                            ? "border-primary bg-primary/10"
                                            : "border-border hover:border-primary/50"
                                            }`}
                                        title={option.label}
                                    >
                                        <IconComponent className="h-5 w-5" />
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    <div>
                        <Label className="text-sm mb-1.5 block">Color</Label>
                        <div className="grid grid-cols-5 gap-2">
                            {colorOptions.map((option) => {
                                const PreviewIcon = (LucideIcons as any)[selectedIcon] || LucideIcons.Package;
                                return (
                                    <button
                                        key={option.value}
                                        type="button"
                                        onClick={() => setSelectedColor(option.value)}
                                        className={`h-10 rounded-lg border-2 flex items-center justify-center transition hover:scale-105 ${option.value} ${selectedColor === option.value
                                            ? "border-primary ring-2 ring-primary ring-offset-2"
                                            : "border-border"
                                            }`}
                                        title={option.label}
                                    >
                                        <PreviewIcon className="h-4 w-4" />
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    <DialogFooter className="gap-2">
                        <Button type="button" variant="outline" onClick={() => handleClose(false)} className="h-9">
                            Cancelar
                        </Button>
                        <Button type="submit" className="h-9">
                            {initial ? "Guardar cambios" : "Crear categoría"}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
