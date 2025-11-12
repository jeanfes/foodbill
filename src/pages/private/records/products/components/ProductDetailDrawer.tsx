import type { Product } from '../../../../../lib/mockData/products';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogClose } from '../../../../../components/ui/dialog';
import { Badge } from '../../../../../components/ui/badge';
import { motion } from 'framer-motion';

interface ProductDetailDrawerProps {
    product: Product | null;
    onClose: () => void;
}

export function ProductDetailDrawer({ product, onClose }: ProductDetailDrawerProps) {
    return (
        <Dialog open={!!product} onOpenChange={(open: boolean) => { if (!open) onClose(); }}>
            <DialogContent className="max-w-md ml-auto h-full flex flex-col" showCloseButton>
                {product && (
                    <motion.div
                        initial={{ x: 100, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        exit={{ x: 100, opacity: 0 }}
                        transition={{ type: 'spring', stiffness: 300 }}
                    >
                        <DialogHeader>
                            <DialogTitle>{product.name}</DialogTitle>
                            <DialogClose aria-label="Cerrar detalle" />
                        </DialogHeader>
                        <div className="p-4 flex flex-col gap-2">
                            {product.imageUrl ? (
                                <img src={product.imageUrl} alt={product.name} className="h-32 w-32 object-cover rounded mb-2" />
                            ) : (
                                <div className="h-32 w-32 bg-gray-200 rounded flex items-center justify-center text-4xl text-gray-400 mb-2">📦</div>
                            )}
                            <div className="text-sm text-muted-foreground">{product.categoryName}</div>
                            <div className="font-bold text-xl">${product.price.toFixed(2)}</div>
                            {product.tags && product.tags.length > 0 && (
                                <div className="flex gap-1 flex-wrap">
                                    {product.tags.map((tag: string) => <Badge key={tag}>{tag}</Badge>)}
                                </div>
                            )}
                            <div className="text-sm mt-2">{product.description}</div>
                            {product.isComposite && product.recipe && (
                                <div className="mt-2">
                                    <div className="font-semibold">Ingredientes:</div>
                                    <ul className="list-disc ml-5">
                                        {product.recipe.map((r: { productId: string; qty: number }, i: number) => (
                                            <li key={i}>ID: {r.productId} x{r.qty}</li>
                                        ))}
                                    </ul>
                                </div>
                            )}
                        </div>
                    </motion.div>
                )}
            </DialogContent>
        </Dialog>
    );
}
