import { useState } from 'react';
import type { Product } from '@/interfaces/product';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogClose } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';

interface ProductFormModalProps {
    open: boolean;
    onClose: () => void;
    onSave: (product: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>) => void;
    initial?: Partial<Product>;
}

export function ProductFormModal({ open, onClose, onSave, initial }: ProductFormModalProps) {
    const [form, setForm] = useState<Omit<Product, 'id' | 'createdAt' | 'updatedAt'>>({
        name: initial?.name || '',
        price: initial?.price || 0,
        categoryId: initial?.categoryId || '',
        categoryName: initial?.categoryName || '',
        status: initial?.status || 'active',
        trackInventory: initial?.trackInventory ?? true,
        stockByWarehouse: initial?.stockByWarehouse || [],
        minStock: initial?.minStock,
        isComposite: initial?.isComposite || false,
        recipe: initial?.recipe || [],
        tags: initial?.tags || [],
        imageUrl: initial?.imageUrl || '',
        sku: initial?.sku || '',
        description: initial?.description || '',
        cost: initial?.cost,
        visibility: initial?.visibility
    });
    const [error, setError] = useState<string | null>(null);

    function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) {
        const { name, value, type } = e.target;
        let val: any = value;
        if (type === 'checkbox') {
            val = (e.target as HTMLInputElement).checked;
        }
        setForm(f => ({
            ...f,
            [name]: val
        }));
    }

    function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        if (!form.name || form.name.length < 2) {
            setError('El nombre es requerido (mínimo 2 caracteres)');
            return;
        }
        if (typeof form.price !== 'number' || Number(form.price) < 0.01) {
            setError('El precio debe ser mayor a 0');
            return;
        }
        setError(null);
        onSave({ ...form, price: Number(form.price) });
        onClose();
    }

    return (
        <Dialog open={open} onOpenChange={(v: boolean) => { if (!v) onClose(); }}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>{initial ? 'Editar producto' : 'Nuevo producto'}</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="flex flex-col gap-3">
                    <Input
                        name="name"
                        className=""
                        placeholder="Nombre"
                        value={form.name}
                        onChange={handleChange}
                        required
                        minLength={2}
                        aria-label="Nombre"
                    />
                    <Input
                        name="sku"
                        className=""
                        placeholder="SKU (opcional)"
                        value={form.sku}
                        onChange={handleChange}
                        aria-label="SKU"
                    />
                    <Input
                        name="price"
                        className=""
                        placeholder="Precio"
                        type="number"
                        min={0.01}
                        step={0.01}
                        value={form.price}
                        onChange={handleChange}
                        aria-label="Precio"
                        required
                    />
                    <Input
                        name="categoryName"
                        className=""
                        placeholder="Categoría"
                        value={form.categoryName}
                        onChange={handleChange}
                        aria-label="Categoría"
                    />
                    <div className="flex items-center gap-2">
                        <Checkbox
                            id="trackInventory"
                            checked={form.trackInventory}
                            onCheckedChange={(v) => setForm(f => ({ ...f, trackInventory: !!v }))}
                            aria-label="Gestiona inventario"
                        />
                        <Label htmlFor="trackInventory" className="cursor-pointer">Gestiona inventario</Label>
                    </div>
                    <div className="flex items-center gap-2">
                        <Checkbox
                            id="isComposite"
                            checked={form.isComposite}
                            onCheckedChange={(v) => setForm(f => ({ ...f, isComposite: !!v }))}
                            aria-label="Es compuesto"
                        />
                        <Label htmlFor="isComposite" className="cursor-pointer">Es compuesto</Label>
                    </div>
                    {error && <div className="text-destructive text-sm">{error}</div>}
                    <DialogFooter>
                        <Button type="submit">Guardar</Button>
                        <DialogClose asChild>
                            <Button type="button" variant="ghost">Cancelar</Button>
                        </DialogClose>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
