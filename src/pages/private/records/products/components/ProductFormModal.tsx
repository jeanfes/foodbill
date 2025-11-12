import { useState } from 'react';
import type { Product } from '../../../../../lib/mockData/products';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogClose } from '../../../../../components/ui/dialog';
import { Button } from '../../../../../components/ui/button';

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
                    <input
                        name="name"
                        className="input input-bordered"
                        placeholder="Nombre"
                        value={form.name}
                        onChange={handleChange}
                        required
                        minLength={2}
                        aria-label="Nombre"
                    />
                    <input
                        name="sku"
                        className="input input-bordered"
                        placeholder="SKU (opcional)"
                        value={form.sku}
                        onChange={handleChange}
                        aria-label="SKU"
                    />
                    <input
                        name="price"
                        className="input input-bordered"
                        placeholder="Precio"
                        type="number"
                        min={0.01}
                        step={0.01}
                        value={form.price}
                        onChange={handleChange}
                        aria-label="Precio"
                        required
                    />
                    <input
                        name="categoryName"
                        className="input input-bordered"
                        placeholder="Categoría"
                        value={form.categoryName}
                        onChange={handleChange}
                        aria-label="Categoría"
                    />
                    <label className="flex items-center gap-2">
                        <input
                            type="checkbox"
                            name="trackInventory"
                            checked={form.trackInventory}
                            onChange={handleChange}
                            aria-label="Gestiona inventario"
                        /> Gestiona inventario
                    </label>
                    <label className="flex items-center gap-2">
                        <input
                            type="checkbox"
                            name="isComposite"
                            checked={form.isComposite}
                            onChange={handleChange}
                            aria-label="Es compuesto"
                        /> Es compuesto
                    </label>
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
