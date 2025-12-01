import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { NumberInput } from '@/components/ui/number-input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useInventoryMock } from '@/hooks/useInventoryMock';
import { useToast } from '@/components/ui/toast';

interface AdjustStockDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  productId?: string;
  productName?: string;
  warehouseId?: string;
}

export function AdjustStockDialog({
  open,
  onOpenChange,
  productId,
  productName,
  warehouseId: initialWarehouseId
}: AdjustStockDialogProps) {
  const { adjustStock, warehouses } = useInventoryMock();
  const toast = useToast();

  const [warehouseId, setWarehouseId] = useState(initialWarehouseId || '');
  const [qty, setQty] = useState('');
  const [reason, setReason] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!productId || !warehouseId || !qty) {
      toast.show('Complete todos los campos requeridos', 'error');
      return;
    }

    const qtyNum = Number(qty);
    if (isNaN(qtyNum)) {
      toast.show('Cantidad inválida', 'error');
      return;
    }

    if (qtyNum < 0 && Math.abs(qtyNum) > 100) {
      if (!confirm(`¿Está seguro de ajustar ${Math.abs(qtyNum)} unidades negativas? Esta operación es irreversible.`)) {
        return;
      }
    }

    const success = adjustStock({
      productId,
      warehouseId,
      qty: qtyNum,
      reason: reason || undefined,
      userId: 'u-1'
    });

    if (success) {
      toast.show('Stock ajustado correctamente', 'success');
      setQty('');
      setReason('');
      onOpenChange(false);
    } else {
      toast.show('Error al ajustar stock', 'error');
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[480px]">
        <DialogHeader>
          <DialogTitle>Ajustar stock</DialogTitle>
          {productName && (
            <p className="text-sm text-muted-foreground">{productName}</p>
          )}
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 mt-2">
          <div>
            <Label htmlFor="warehouse" className="text-sm mb-1.5 block">
              Bodega *
            </Label>
            <Select value={warehouseId} onValueChange={setWarehouseId}>
              <SelectTrigger className="h-10">
                <SelectValue placeholder="Seleccionar bodega" />
              </SelectTrigger>
              <SelectContent>
                {warehouses.map((w) => (
                  <SelectItem key={w.id} value={w.id}>
                    {w.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="qty" className="text-sm mb-1.5 block">
              Cantidad (±) *
            </Label>
            <NumberInput
              id="qty"
              value={qty ? Number(qty) : undefined}
              onChange={(val) => setQty(val?.toString() || '')}
              placeholder="Ej: 10 o -5"
              className="h-10"
              allowNegative
            />
            <p className="text-xs text-muted-foreground mt-1">
              Positivo para agregar, negativo para reducir
            </p>
          </div>

          <div>
            <Label htmlFor="reason" className="text-sm mb-1.5 block">
              Razón
            </Label>
            <Input
              id="reason"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="Merma, conteo físico, error..."
              className="h-10"
            />
          </div>

          <div className="flex justify-end gap-2">
            <Button
              type="button"
              variant="ghost"
              onClick={() => onOpenChange(false)}
              className="h-9"
            >
              Cancelar
            </Button>
            <Button type="submit" className="h-9">
              Confirmar ajuste
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
