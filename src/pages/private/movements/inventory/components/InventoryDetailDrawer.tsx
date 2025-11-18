import { useMemo, useState } from 'react';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useInventoryMock } from '@/hooks/useInventoryMock';
import { Package, ArrowRight, ArrowDown, ArrowUp, RefreshCw, Trash2 } from 'lucide-react';
import { AdjustStockDialog } from './AdjustStockDialog';
import { TransferStockDialog } from './TransferStockDialog';
import { Can } from '@/components/Can';
import { Permission } from '@/interfaces/role';
import type { MovementType } from '@/interfaces/inventory';

interface InventoryDetailDrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  productId?: string | null;
}

const MOVEMENT_ICONS: Record<MovementType, any> = {
  in: ArrowDown,
  out: ArrowUp,
  transfer: ArrowRight,
  adjust: RefreshCw,
  consumption: Trash2
};

const MOVEMENT_LABELS: Record<MovementType, string> = {
  in: 'Entrada',
  out: 'Salida',
  transfer: 'Transferencia',
  adjust: 'Ajuste',
  consumption: 'Consumo'
};

const MOVEMENT_COLORS: Record<MovementType, string> = {
  in: 'text-green-600',
  out: 'text-red-600',
  transfer: 'text-blue-600',
  adjust: 'text-purple-600',
  consumption: 'text-orange-600'
};

export function InventoryDetailDrawer({
  open,
  onOpenChange,
  productId
}: InventoryDetailDrawerProps) {
  const { getInventoryItems, getStockByProduct, getMovementsByProduct } = useInventoryMock();
  const [adjustDialogOpen, setAdjustDialogOpen] = useState(false);
  const [transferDialogOpen, setTransferDialogOpen] = useState(false);
  const [imageError, setImageError] = useState(false);

  const product = useMemo(() => {
    if (!productId) return null;
    const items = getInventoryItems();
    return items.find(i => i.productId === productId);
  }, [productId, getInventoryItems]);

  const stocks = useMemo(() => {
    return productId ? getStockByProduct(productId) : [];
  }, [productId, getStockByProduct]);

  const movements = useMemo(() => {
    return productId ? getMovementsByProduct(productId) : [];
  }, [productId, getMovementsByProduct]);

  if (!product) return null;

  const isLowStock = product.minQuantity !== undefined && product.totalQuantity <= product.minQuantity;

  return (
    <>
      <Sheet open={open} onOpenChange={onOpenChange}>
        <SheetContent className="w-full sm:max-w-2xl overflow-y-auto p-0">
          <SheetHeader className="px-6 pt-6 pb-4 border-b sticky top-0 bg-background z-10">
            <div className="flex items-start gap-4">
              {product.imageUrl && !imageError ? (
                <img
                  src={product.imageUrl}
                  alt={product.name}
                  className="w-16 h-16 rounded-lg object-cover shadow-sm"
                  onError={() => setImageError(true)}
                />
              ) : (
                <div className="w-16 h-16 rounded-lg bg-muted flex items-center justify-center">
                  <Package className="w-8 h-8 text-muted-foreground" />
                </div>
              )}
              <div className="flex-1 min-w-0">
                <SheetTitle className="text-xl mb-2">{product.name}</SheetTitle>
                <div className="flex flex-wrap items-center gap-2 mb-3">
                  {product.sku && (
                    <Badge variant="outline" className="font-mono text-xs">
                      {product.sku}
                    </Badge>
                  )}
                  {product.categoryName && (
                    <Badge variant="secondary" className="text-xs">
                      {product.categoryName}
                    </Badge>
                  )}
                  {!product.isTrackable && (
                    <Badge variant="outline" className="text-xs">
                      No rastreado
                    </Badge>
                  )}
                </div>
                <div className="flex items-baseline gap-3">
                  <span className="text-3xl font-bold">{product.totalQuantity}</span>
                  <span className="text-lg text-muted-foreground">{product.unit}</span>
                  {isLowStock && (
                    <Badge variant="destructive">Stock bajo</Badge>
                  )}
                </div>
                {product.minQuantity !== undefined && (
                  <p className="text-sm text-muted-foreground mt-2">
                    Stock mínimo: {product.minQuantity} {product.unit}
                  </p>
                )}
              </div>
            </div>
          </SheetHeader>

          <div className="px-6 py-6 space-y-8 h-full">
            <div className="flex flex-wrap gap-3">
              <Can permission={Permission.ADJUST_INVENTORY}>
                <Button
                  variant="default"
                  size="default"
                  onClick={() => setAdjustDialogOpen(true)}
                  className="flex-1 min-w-[150px]"
                >
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Ajustar stock
                </Button>
              </Can>
              <Can permission={Permission.TRANSFER_INVENTORY}>
                <Button
                  variant="outline"
                  size="default"
                  onClick={() => setTransferDialogOpen(true)}
                  className="flex-1 min-w-[150px]"
                >
                  <ArrowRight className="h-4 w-4 mr-2" />
                  Transferir
                </Button>
              </Can>
            </div>

            <div>
              <h4 className="font-bold text-base mb-4">Stock por bodega</h4>
              {stocks.length > 0 ? (
                <div className="space-y-3">
                  {stocks.map((stock) => (
                    <Card key={stock.id} className="p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <p className="font-semibold text-base mb-1">{stock.warehouseName}</p>
                          {stock.minQuantity !== undefined && (
                            <p className="text-sm text-muted-foreground">
                              Stock mínimo: {stock.minQuantity} {stock.unit || product.unit}
                            </p>
                          )}
                        </div>
                        <div className="text-right">
                          <p className="text-2xl font-bold">{stock.quantity}</p>
                          <p className="text-sm text-muted-foreground">{stock.unit || product.unit}</p>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              ) : (
                <Card className="p-8 text-center">
                  <Package className="h-12 w-12 text-muted-foreground/40 mx-auto mb-3" />
                  <p className="text-sm text-muted-foreground">
                    No hay stock registrado en ninguna bodega
                  </p>
                </Card>
              )}
            </div>

            <Separator />

            <div>
              <h4 className="font-bold text-base mb-4">Historial de movimientos</h4>
              <ScrollArea className="h-[450px]">
                {movements.length > 0 ? (
                  <div className="space-y-3 pr-4">
                    {movements.map((movement) => {
                      const Icon = MOVEMENT_ICONS[movement.type];
                      const color = MOVEMENT_COLORS[movement.type];

                      return (
                        <Card key={movement.id} className="p-4">
                          <div className="flex gap-4">
                            <div className={`p-2 rounded-lg bg-muted ${color}`}>
                              <Icon className="h-5 w-5" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-start justify-between gap-3 mb-2">
                                <div>
                                  <p className="font-semibold text-base">
                                    {MOVEMENT_LABELS[movement.type]}
                                  </p>
                                  <p className="text-xs text-muted-foreground mt-1">
                                    {new Date(movement.createdAt).toLocaleString('es-ES', {
                                      day: '2-digit',
                                      month: 'long',
                                      year: 'numeric',
                                      hour: '2-digit',
                                      minute: '2-digit'
                                    })}
                                  </p>
                                </div>
                                <Badge className={`${movement.qty >= 0 ? 'bg-green-600' : 'bg-red-600'} text-white`}>
                                  {movement.qty >= 0 ? '+' : ''}{movement.qty} {movement.unit}
                                </Badge>
                              </div>

                              {movement.type === 'transfer' && (
                                <div className="flex items-center gap-2 text-sm mb-2">
                                  <span className="text-muted-foreground">De:</span>
                                  <Badge variant="outline">{movement.fromWarehouseName}</Badge>
                                  <ArrowRight className="h-3 w-3 text-muted-foreground" />
                                  <span className="text-muted-foreground">A:</span>
                                  <Badge variant="outline">{movement.toWarehouseName}</Badge>
                                </div>
                              )}

                              {(movement.type === 'in' || movement.type === 'adjust') && movement.toWarehouseName && (
                                <p className="text-sm text-muted-foreground mb-2">
                                  <span className="font-medium">Bodega:</span> {movement.toWarehouseName}
                                </p>
                              )}

                              {(movement.type === 'out' || movement.type === 'consumption') && movement.fromWarehouseName && (
                                <p className="text-sm text-muted-foreground mb-2">
                                  <span className="font-medium">Bodega:</span> {movement.fromWarehouseName}
                                </p>
                              )}

                              {movement.reason && (
                                <p className="text-sm text-muted-foreground italic mt-2 p-2 bg-muted/50 rounded">
                                  "{movement.reason}"
                                </p>
                              )}

                              {movement.userName && (
                                <p className="text-xs text-muted-foreground mt-2">
                                  Realizado por: <span className="font-medium">{movement.userName}</span>
                                </p>
                              )}
                            </div>
                          </div>
                        </Card>
                      );
                    })}
                  </div>
                ) : (
                  <Card className="p-8 text-center">
                    <Package className="h-12 w-12 text-muted-foreground/40 mx-auto mb-3" />
                    <p className="text-sm text-muted-foreground">
                      No hay movimientos registrados para este producto
                    </p>
                  </Card>
                )}
              </ScrollArea>
            </div>
          </div>
        </SheetContent>
      </Sheet>

      <AdjustStockDialog
        open={adjustDialogOpen}
        onOpenChange={setAdjustDialogOpen}
        productId={product.productId}
        productName={product.name}
      />

      <TransferStockDialog
        open={transferDialogOpen}
        onOpenChange={setTransferDialogOpen}
        productId={product.productId}
        productName={product.name}
      />
    </>
  );
}
