import { useState } from 'react';
import type { Product } from '@/interfaces/product';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface AdjustStockModalProps {
    product: Product | null;
    open: boolean;
    onClose: () => void;
    onAdjust: (args: { productId: string; warehouseId: string; qty: number; reason?: string }) => void;
}

export function AdjustStockModal({ product, open, onClose, onAdjust }: AdjustStockModalProps) {
    const [selectedWarehouse, setSelectedWarehouse] = useState<string>('');
    const [quantity, setQuantity] = useState<string>('0');
    const [reason, setReason] = useState<string>('');
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!product || !selectedWarehouse) {
            setError('Selecciona una bodega');
            return;
        }

        const qty = Number(quantity);
        if (isNaN(qty)) {
            setError('Cantidad inválida');
            return;
        }

        const warehouse = product.stockByWarehouse?.find(w => w.warehouseId === selectedWarehouse);
        const currentStock = warehouse?.stock || 0;

        if (currentStock + qty < 0) {
            setError(`Stock insuficiente. Stock actual: ${currentStock}`);
            return;
        }

        onAdjust({
            productId: product.id,
            warehouseId: selectedWarehouse,
            qty,
            reason
        });

        setQuantity('0');
        setReason('');
        setSelectedWarehouse('');
        setError(null);
        onClose();
    };

    if (!product) return null;

    return (
        <Dialog open={open} onOpenChange={(v: boolean) => { if (!v) onClose(); }}>
            <DialogContent className="max-w-lg">
                <DialogHeader>
                    <DialogTitle className="text-xl">Ajustar Stock - {product.name}</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div className="space-y-2">
                            <Label>Bodega</Label>
                            <Select value={selectedWarehouse} onValueChange={setSelectedWarehouse}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Selecciona bodega" />
                                </SelectTrigger>
                                <SelectContent>
                                    {product.stockByWarehouse?.map((w) => (
                                        <SelectItem key={w.warehouseId} value={w.warehouseId}>
                                            {w.warehouseName || w.warehouseId} (Stock: {w.stock})
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-2">
                            <Label>Cantidad (+ agregar / - restar)</Label>
                            <Input
                                type="number"
                                value={quantity}
                                onChange={(e) => setQuantity(e.target.value)}
                                placeholder="Ej: +10 o -5"
                            />
                            <p className="text-xs text-muted-foreground">Usa números positivos para agregar o negativos para restar</p>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label>Motivo (opcional)</Label>
                        <Input
                            value={reason}
                            onChange={(e) => setReason(e.target.value)}
                            placeholder="Ej: Compra, Venta, Ajuste de inventario"
                        />
                    </div>

                    {error && <div className="text-destructive text-sm">{error}</div>}

                    <DialogFooter className="gap-2 sm:gap-3">
                        <Button type="button" variant="ghost" onClick={onClose}>Cancelar</Button>
                        <Button type="submit">Ajustar Stock</Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
