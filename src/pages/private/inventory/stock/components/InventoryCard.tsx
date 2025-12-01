import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Package, Eye, AlertTriangle } from 'lucide-react';
import type { InventoryItem } from '@/interfaces/inventory';
import { motion } from 'framer-motion';

interface InventoryCardProps {
  item: InventoryItem;
  onViewDetail: (productId: string) => void;
}

export function InventoryCard({ item, onViewDetail }: InventoryCardProps) {
  const isLowStock = item.minQuantity !== undefined && item.totalQuantity <= item.minQuantity;
  const [imageError, setImageError] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -4 }}
      transition={{ duration: 0.2 }}
      className="h-full"
    >
      <Card className="h-full flex flex-col overflow-hidden group cursor-pointer hover:shadow-xl transition-all duration-300 border-2 hover:border-primary/20 pt-0 pb-1">
        {/* Header con imagen */}
        <div className="relative h-44 overflow-hidden bg-muted">
          {item.imageUrl && !imageError ? (
            <img
              src={item.imageUrl}
              alt={item.name}
              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
              onError={() => setImageError(true)}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <Package className="w-16 h-16 text-muted-foreground/30" />
            </div>
          )}

          {/* Overlay con badges */}
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors duration-300" />

          {/* Badges flotantes */}
          <div className="absolute top-3 left-3 flex flex-col gap-2">
            {item.sku && (
              <Badge className="shadow-lg bg-black/80 text-white font-mono text-xs border-0">
                {item.sku}
              </Badge>
            )}
            {!item.isTrackable && (
              <Badge className="shadow-lg bg-blue-600 text-white text-xs border-0">
                No rastreado
              </Badge>
            )}
            {item.isComposite && (
              <Badge className="shadow-lg bg-purple-600 text-white text-xs border-0">
                Compuesto
              </Badge>
            )}
          </div>

          {isLowStock && (
            <div className="absolute top-3 right-3">
              <Badge variant="destructive" className="shadow-lg animate-pulse flex items-center gap-1">
                <AlertTriangle className="h-3 w-3" />
                Stock bajo
              </Badge>
            </div>
          )}
        </div>

        {/* Contenido */}
        <div className="flex-1 flex flex-col p-4">
          <h3 className="font-bold text-base mb-2 line-clamp-2 min-h-12 group-hover:text-primary transition-colors">
            {item.name}
          </h3>

          {/* Separador decorativo */}
          <div className="w-12 h-1 bg-primary/20 rounded-full mb-3 group-hover:w-full group-hover:bg-primary/40 transition-all duration-300" />

          {/* Info de stock */}
          <div className="flex-1">
            <div className="flex items-end justify-between mb-1">
              <div>
                <p className="text-xs text-muted-foreground uppercase tracking-wide mb-1">Stock disponible</p>
                <div className="flex items-baseline gap-2">
                  <span className={`text-3xl font-bold ${isLowStock
                    ? 'text-amber-600 dark:text-amber-400'
                    : 'text-primary'
                    }`}>
                    {item.totalQuantity}
                  </span>
                  <span className="text-sm text-muted-foreground font-medium">{item.unit}</span>
                </div>
              </div>
            </div>

            {item.minQuantity !== undefined && (
              <div className="flex items-center gap-1.5 mt-2">
                <div className="w-full bg-muted rounded-full h-1.5 overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all ${isLowStock ? 'bg-amber-500' : 'bg-primary'
                      }`}
                    style={{
                      width: `${Math.min((item.totalQuantity / (item.minQuantity * 3)) * 100, 100)}%`
                    }}
                  />
                </div>
              </div>
            )}

            {item.minQuantity !== undefined && (
              <p className="text-xs text-muted-foreground mt-1.5">
                Stock mínimo: <span className="font-semibold">{item.minQuantity} {item.unit}</span>
              </p>
            )}
          </div>

          {/* Botón de acción */}
          <Button
            onClick={() => onViewDetail(item.productId)}
            className="w-full mt-4 group-hover:bg-primary group-hover:text-primary-foreground transition-colors"
            variant="outline"
          >
            <Eye className="h-4 w-4 mr-2" />
            Ver detalles
          </Button>
        </div>
      </Card>
    </motion.div>
  );
}
