import { useState } from 'react';
import type { Product } from '@/interfaces/product';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { motion, AnimatePresence } from 'framer-motion';
import { MapPin, Package2, DollarSign, BarChart3, Tag } from 'lucide-react';

interface ProductDetailDrawerProps {
	product: Product | null;
	onClose: () => void;
}

export function ProductDetailDrawer({ product, onClose }: ProductDetailDrawerProps) {
	const [selectedImageIndex, setSelectedImageIndex] = useState(0);

	const images = product?.imageUrl
		? [product.imageUrl]
		: ['https://placehold.co/600x400?text=Sin+Imagen'];

	const totalStock = product?.stockByWarehouse
		? product.stockByWarehouse.reduce((sum, w) => sum + w.stock, 0)
		: 0;

	return (
		<Dialog open={!!product} onOpenChange={(open: boolean) => { if (!open) onClose(); }}>
			<DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
				<AnimatePresence mode="wait">
					{product && (
						<motion.div
							key={product.id}
							initial={{ opacity: 0, x: 20 }}
							animate={{ opacity: 1, x: 0 }}
							exit={{ opacity: 0, x: -20 }}
							transition={{ duration: 0.3 }}
						>
							<DialogHeader>
								<DialogTitle className="text-2xl">{product.name}</DialogTitle>
								<p className="text-sm text-muted-foreground">SKU: {product.sku}</p>
							</DialogHeader>
							<div className="space-y-6 mt-4">
								<div className="space-y-2">
									<motion.div
										className="relative aspect-video rounded-lg overflow-hidden bg-muted"
										layoutId={`product-image-${product.id}`}
									>
										<img
											src={images[selectedImageIndex]}
											alt={product.name}
											className="w-full h-full object-cover"
											onError={(e) => {
												const target = e.currentTarget as HTMLImageElement;
												target.onerror = null;
												target.src = `https://placehold.co/600x400?text=${encodeURIComponent(product.name)}`;
											}}
										/>
									</motion.div>
									{images.length > 1 && (
										<div className="flex gap-2">
											{images.map((img, idx) => (
												<button
													key={idx}
													onClick={() => setSelectedImageIndex(idx)}
													className={`w-20 h-20 rounded border-2 overflow-hidden ${idx === selectedImageIndex ? 'border-primary' : 'border-transparent'
														}`}
												>
													<img
														src={img}
														alt={`${product.name} ${idx + 1}`}
														className="w-full h-full object-cover"
														onError={(e) => {
															const target = e.currentTarget as HTMLImageElement;
															target.onerror = null;
															target.src = `https://placehold.co/600x400?text=${encodeURIComponent(product.name)}`;
														}}
													/>
												</button>
											))}
										</div>
									)}
								</div>
								<Separator />
								<div className="grid grid-cols-2 gap-4">
									<div className="space-y-2">
										<div className="flex items-center gap-2 text-muted-foreground">
											<DollarSign className="w-4 h-4" />
											<span className="text-sm">Precio</span>
										</div>
										<p className="text-2xl font-bold">${product.price.toFixed(2)}</p>
										{product.cost !== undefined && (
											<p className="text-sm text-muted-foreground">
												Costo: ${product.cost.toFixed(2)} | Margen: {((product.price - product.cost) / product.cost * 100).toFixed(1)}%
											</p>
										)}
									</div>
									<div className="space-y-2">
										<div className="flex items-center gap-2 text-muted-foreground">
											<Package2 className="w-4 h-4" />
											<span className="text-sm">Stock</span>
										</div>
										<p className="text-2xl font-bold">
											{product.trackInventory ? totalStock : 'N/A'}
										</p>
										{product.trackInventory && product.minStock !== undefined && totalStock <= product.minStock && (
											<Badge variant="destructive">Stock Bajo</Badge>
										)}
									</div>
								</div>
								<Separator />
								<div className="space-y-2">
									<div className="flex items-center gap-2 text-muted-foreground">
										<BarChart3 className="w-4 h-4" />
										<span className="text-sm">Categoría y Estado</span>
									</div>
									<div className="flex gap-2">
										<Badge>{product.categoryName}</Badge>
										<Badge variant={product.status === 'active' ? 'default' : 'secondary'}>
											{product.status === 'active' ? 'Activo' : 'Inactivo'}
										</Badge>
										{product.isComposite && <Badge variant="outline">Compuesto</Badge>}
									</div>
								</div>
								{product.tags && product.tags.length > 0 && (
									<div className="space-y-2">
										<div className="flex items-center gap-2 text-muted-foreground">
											<Tag className="w-4 h-4" />
											<span className="text-sm">Tags</span>
										</div>
										<div className="flex flex-wrap gap-2">
											{product.tags.map((tag) => (
												<Badge key={tag} variant="outline">
													{tag}
												</Badge>
											))}
										</div>
									</div>
								)}
								{product.description && (
									<div className="space-y-2">
										<h4 className="font-semibold">Descripción</h4>
										<p className="text-sm text-muted-foreground">{product.description}</p>
									</div>
								)}
								{product.trackInventory && product.stockByWarehouse && (
									<div className="space-y-2">
										<h4 className="font-semibold">Inventario por Almacén</h4>
										<div className="grid grid-cols-2 gap-2">
											{product.stockByWarehouse.map((warehouse) => (
												<div key={warehouse.warehouseId} className="bg-muted rounded p-2 flex justify-between">
													<span className="text-sm">{warehouse.warehouseName || warehouse.warehouseId}</span>
													<span className="font-medium">{warehouse.stock} unidades</span>
												</div>
											))}
										</div>
									</div>
								)}
								{product.isComposite && product.recipe && product.recipe.length > 0 && (
									<div className="space-y-2">
										<h4 className="font-semibold">Receta / Ingredientes</h4>
										<ul className="space-y-1">
											{product.recipe.map((item, idx) => (
												<li key={idx} className="text-sm bg-muted rounded p-2 flex justify-between">
													<span>Producto ID: {item.productId}</span>
													<span className="font-medium">{item.qty} unidades</span>
												</li>
											))}
										</ul>
									</div>
								)}
								<Separator />
								<Button variant="outline" className="w-full" disabled>
									<MapPin className="w-4 h-4 mr-2" />
									Ver Ubicación (Próximamente)
								</Button>
								{(product.createdAt || product.updatedAt) && (
									<div className="text-xs text-muted-foreground space-y-1">
										{product.createdAt && <p>Creado: {new Date(product.createdAt).toLocaleString('es-ES')}</p>}
										{product.updatedAt && <p>Actualizado: {new Date(product.updatedAt).toLocaleString('es-ES')}</p>}
									</div>
								)}
							</div>
						</motion.div>
					)}
				</AnimatePresence>
			</DialogContent>
		</Dialog>
	);
}