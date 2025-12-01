import { useState, useMemo } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { NumberInput } from '@/components/ui/number-input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useInventoryMock } from '@/hooks/useInventoryMock';
import { useToast } from '@/components/ui/toast';
import { ArrowRight } from 'lucide-react';

interface TransferStockDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  productId?: string;
  productName?: string;
  fromWarehouseId?: string;
}

export function TransferStockDialog({
  open,
  onOpenChange,
  productId,
  productName,
  fromWarehouseId: initialFromWarehouseId
}: TransferStockDialogProps) {
  const { transferStock, warehouses, getStockByProduct } = useInventoryMock();
  const toast = useToast();

  const [fromWarehouseId, setFromWarehouseId] = useState(initialFromWarehouseId || '');
  const [toWarehouseId, setToWarehouseId] = useState('');
  const [qty, setQty] = useState('');
  const [reason, setReason] = useState('');

  const productStocks = useMemo(() => {
    return productId ? getStockByProduct(productId) : [];
  }, [productId, getStockByProduct]);

  const availableQty = useMemo(() => {
    const stock = productStocks.find(s => s.warehouseId === fromWarehouseId);
    return stock?.quantity || 0;
  }, [productStocks, fromWarehouseId]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!productId || !fromWarehouseId || !toWarehouseId || !qty) {
      toast.show('Complete todos los campos requeridos', 'error');
      return;
    }

    if (fromWarehouseId === toWarehouseId) {
      toast.show('Las bodegas origen y destino deben ser diferentes', 'error');
      return;
    }

    const qtyNum = Number(qty);
    if (isNaN(qtyNum) || qtyNum <= 0) {
      toast.show('Cantidad inválida', 'error');
      return;
    }

    if (qtyNum > availableQty) {
      toast.show(`No hay suficiente stock. Disponible: ${availableQty}`, 'error');
      return;
    }

    const success = transferStock({
      productId,
      fromWarehouseId,
      toWarehouseId,
      qty: qtyNum,
      reason: reason || undefined,
      userId: 'u-1'
    });

    if (success) {
      toast.show('Transferencia realizada correctamente', 'success');
      setQty('');
      setReason('');
      setToWarehouseId('');
      onOpenChange(false);
    } else {
      toast.show('Error al transferir stock', 'error');
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[520px]">
        <DialogHeader>
          <DialogTitle>Transferir stock entre bodegas</DialogTitle>
          {productName && (
            <p className="text-sm text-muted-foreground">{productName}</p>
          )}
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 mt-2">
          <div className="grid grid-cols-[1fr,auto,1fr] gap-3 items-end">
            <div>
              <Label htmlFor="from" className="text-sm mb-1.5 block">
                Desde *
              </Label>
              <Select value={fromWarehouseId} onValueChange={setFromWarehouseId}>
                <SelectTrigger className="h-10">
                  <SelectValue placeholder="Origen" />
                </SelectTrigger>
                <SelectContent>
                  {warehouses.map((w) => (
                    <SelectItem key={w.id} value={w.id}>
                      {w.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {fromWarehouseId && (
                <p className="text-xs text-muted-foreground mt-1">
                  Disponible: {availableQty}
                </p>
              )}
            </div>

            <ArrowRight className="h-5 w-5 text-muted-foreground mb-2" />

            <div>
              <Label htmlFor="to" className="text-sm mb-1.5 block">
                Hacia *
              </Label>
              <Select value={toWarehouseId} onValueChange={setToWarehouseId}>
                <SelectTrigger className="h-10">
                  <SelectValue placeholder="Destino" />
                </SelectTrigger>
                <SelectContent>
                  {warehouses
                    .filter(w => w.id !== fromWarehouseId)
                    .map((w) => (
                      <SelectItem key={w.id} value={w.id}>
                        {w.name}
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div>
            <Label htmlFor="qty" className="text-sm mb-1.5 block">
              Cantidad *
            </Label>
            <NumberInput
              id="qty"
              min={1}
              max={availableQty}
              value={qty ? Number(qty) : undefined}
              onChange={(val) => setQty(val?.toString() || '')}
              placeholder="Cantidad a transferir"
              className="h-10"
            />
          </div>

          <div>
            <Label htmlFor="reason" className="text-sm mb-1.5 block">
              Razón
            </Label>
            <Input
              id="reason"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="Reabastecimiento, reorganización..."
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
              Confirmar transferencia
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
