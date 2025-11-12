import type { Product } from '../../../../../lib/mockData/products';
import { Card } from '../../../../../components/ui/card';
import { Button } from '../../../../../components/ui/button';
import { motion } from 'framer-motion';

interface ProductListProps {
    products: Product[];
    onSelect: (product: Product) => void;
}

export function ProductList({ products, onSelect }: ProductListProps) {
    if (!products.length) return <div className="text-muted-foreground">Sin productos.</div>;
    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {products.map(product => (
                <motion.div
                    key={product.id}
                    whileHover={{ scale: 1.03 }}
                    transition={{ type: 'spring', stiffness: 300 }}
                >
                    <Card className="flex flex-col h-full">
                        <div className="h-32 flex items-center justify-center bg-muted rounded-t">
                            {product.imageUrl ? (
                                <img src={product.imageUrl} alt={product.name} className="h-20 w-20 object-cover rounded" />
                            ) : (
                                <div className="h-20 w-20 bg-gray-200 rounded flex items-center justify-center text-2xl text-gray-400">📦</div>
                            )}
                        </div>
                        <div className="flex-1 p-3 flex flex-col gap-1">
                            <div className="font-semibold truncate" title={product.name}>{product.name}</div>
                            <div className="text-xs text-muted-foreground">{product.categoryName}</div>
                            <div className="text-lg font-bold">${product.price.toFixed(2)}</div>
                        </div>
                        <div className="flex gap-2 p-3 pt-0">
                            <Button size="sm" variant="outline" aria-label="Ver detalle" onClick={() => onSelect(product)}>
                                Ver
                            </Button>
                        </div>
                    </Card>
                </motion.div>
            ))}
        </div>
    );
}
