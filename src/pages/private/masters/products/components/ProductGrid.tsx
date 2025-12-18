import type { Product } from '@/interfaces/product';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface ProductGridProps {
	products: Product[];
	onView: (product: Product) => void;
	onEdit: (product: Product) => void;
	onAdjustStock: (product: Product) => void;
}

export function ProductGrid({ products, onView, onEdit, onAdjustStock }: ProductGridProps) {
	return (
		<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
			{products.map((p) => (
				<Card key={p.id} className="p-4 space-y-3">
					<div className="aspect-video rounded bg-muted overflow-hidden">
						<img
							alt={p.name}
							src={p.imageUrl || `https://placehold.co/600x400?text=${encodeURIComponent(p.name)}`}
							className="w-full h-full object-cover"
							onError={(e) => { const t=e.currentTarget as HTMLImageElement; t.onerror=null; t.src=`https://placehold.co/600x400?text=${encodeURIComponent(p.name)}`; }}
						/>
					</div>
					<div className="flex items-center justify-between">
						<div>
							<h3 className="font-semibold">{p.name}</h3>
							<p className="text-xs text-muted-foreground">SKU: {p.sku || '—'}</p>
						</div>
						<Badge>{p.categoryName || 'Sin categoría'}</Badge>
					</div>
					<div className="flex items-center justify-between">
						<span className="text-lg font-bold">${(p.price ?? 0).toFixed(2)}</span>
						{p.trackInventory ? (
							<span className="text-sm">Stock: {p.stockByWarehouse?.reduce((s,w)=>s+w.stock,0) ?? 0}</span>
						) : (
							<span className="text-sm text-muted-foreground">Sin control</span>
						)}
					</div>
					<div className="flex gap-2 justify-end">
						<Button size="sm" variant="outline" onClick={() => onView(p)}>Ver</Button>
						<Button size="sm" variant="outline" onClick={() => onEdit(p)}>Editar</Button>
						<Button size="sm" onClick={() => onAdjustStock(p)}>Stock</Button>
					</div>
				</Card>
			))}
		</div>
	);
}
