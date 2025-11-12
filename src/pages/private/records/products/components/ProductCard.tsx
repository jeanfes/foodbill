import type { Product } from '@/interfaces/product';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { motion } from 'framer-motion';
import { Eye, Edit, Package } from 'lucide-react';
import { } from 'react';

interface ProductCardProps {
    product: Product;
    onView: (product: Product) => void;
    onEdit: (product: Product) => void;
    onAdjustStock: (product: Product) => void;
}

export function ProductCard({ product, onView, onEdit, onAdjustStock }: ProductCardProps) {
    const stockTotal = product.stockByWarehouse?.reduce((sum, w) => sum + w.stock, 0) || 0;
    const isLowStock = product.trackInventory && product.minStock && stockTotal <= product.minStock;

    return (
        <motion.div
            whileHover={{ y: -4, scale: 1.01 }}
            transition={{ type: 'spring', stiffness: 260, damping: 22 }}
            className="group h-full"
        >
            <Card className="overflow-hidden h-full flex flex-col hover:shadow-lg transition-shadow duration-300 p-0">
                <div className="relative w-full bg-muted overflow-hidden aspect-video">
                    <img
                        src={product.imageUrl || `https://placehold.co/600x400?text=${encodeURIComponent(product.name)}`}
                        alt={product.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        loading="lazy"
                        onError={(e) => {
                            const target = e.currentTarget as HTMLImageElement;
                            target.onerror = null;
                            target.src = `https://placehold.co/600x400?text=${encodeURIComponent(product.name)}`;
                        }}
                    />

                    {product.status === 'inactive' && (
                        <Badge className="absolute top-2 left-2 bg-destructive">Inactivo</Badge>
                    )}
                    {isLowStock && (
                        <Badge className="absolute top-2 right-2 bg-orange-500">Stock Bajo</Badge>
                    )}
                </div>

                <CardContent className="flex-1 p-3 sm:p-4 flex flex-col gap-3">
                    <div className="flex-1">
                        <h3
                            className="font-semibold text-base sm:text-lg line-clamp-2 cursor-pointer hover:text-primary transition-colors"
                            onClick={() => onView(product)}
                            title={product.name}
                        >
                            {product.name}
                        </h3>

                        {product.categoryName && (
                            <Badge variant="outline" className="mt-2">
                                {product.categoryName}
                            </Badge>
                        )}

                        {product.sku && (
                            <p className="text-xs text-muted-foreground mt-1">SKU: {product.sku}</p>
                        )}

                        <div className="mt-2 flex flex-wrap gap-1">
                            {product.isComposite && (
                                <Badge variant="secondary" className="text-xs">Compuesto</Badge>
                            )}
                            {!product.trackInventory && (
                                <Badge variant="secondary" className="text-xs">Sin inventario</Badge>
                            )}
                            {product.tags?.slice(0, 2).map((tag) => (
                                <Badge key={tag} variant="outline" className="text-xs">
                                    {tag}
                                </Badge>
                            ))}
                            {product.tags && product.tags.length > 2 && (
                                <Badge variant="outline" className="text-xs">+{product.tags.length - 2}</Badge>
                            )}
                        </div>
                    </div>

                    <div className="border-t pt-2 mt-auto">
                        <div className="flex items-center justify-between mb-3">
                            <span className="text-xl sm:text-2xl font-bold text-primary">
                                ${product.price.toFixed(2)}
                            </span>
                            {product.trackInventory && (
                                <span className="text-sm text-muted-foreground">
                                    Stock: {stockTotal}
                                </span>
                            )}
                        </div>

                        <div className="flex gap-2 md:opacity-0 md:group-hover:opacity-100 transition-opacity duration-200">
                            <Button
                                size="sm"
                                variant="outline"
                                className="flex-1"
                                onClick={() => onView(product)}
                                aria-label="Ver detalle"
                            >
                                <Eye className="w-4 h-4 mr-1" />
                                Ver
                            </Button>
                            <Button
                                size="sm"
                                variant="outline"
                                onClick={() => onEdit(product)}
                                aria-label="Editar"
                                className="hidden sm:inline-flex"
                            >
                                <Edit className="w-4 h-4" />
                            </Button>
                            {product.trackInventory && (
                                <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={() => onAdjustStock(product)}
                                    aria-label="Ajustar stock"
                                    className="hidden sm:inline-flex"
                                >
                                    <Package className="w-4 h-4" />
                                </Button>
                            )}
                        </div>
                    </div>
                </CardContent>
            </Card>
        </motion.div>
    );
}
