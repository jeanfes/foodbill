import type { Product } from '@/interfaces/product';
import { ProductCard } from './ProductCard';
import { AnimatePresence, motion } from 'framer-motion';

interface ProductGridProps {
    products: Product[];
    onView: (product: Product) => void;
    onEdit: (product: Product) => void;
    onAdjustStock: (product: Product) => void;
}

export function ProductGrid({ products, onView, onEdit, onAdjustStock }: ProductGridProps) {
    if (!products.length) {
        return (
            <div className="text-center py-12 text-muted-foreground">
                <div className="text-6xl mb-4">📦</div>
                <p className="text-lg">No se encontraron productos</p>
                <p className="text-sm mt-2">Intenta ajustar los filtros o crea un nuevo producto</p>
            </div>
        );
    }

    return (
        <motion.div
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-5 lg:gap-6 items-stretch"
            initial={false}
            animate="visible"
            variants={{
                visible: {
                    transition: {
                        staggerChildren: 0.05
                    }
                }
            }}
        >
            <AnimatePresence mode="popLayout">
                {products.map((product) => (
                    <motion.div
                        key={product.id}
                        layout
                        variants={{
                            hidden: { opacity: 0, y: 20 },
                            visible: { opacity: 1, y: 0 }
                        }}
                        exit={{ opacity: 0, y: -10 }}
                        className="h-full"
                    >
                        <ProductCard
                            product={product}
                            onView={onView}
                            onEdit={onEdit}
                            onAdjustStock={onAdjustStock}
                        />
                    </motion.div>
                ))}
            </AnimatePresence>
        </motion.div>
    );
}
