import type { Product } from '@/interfaces/product';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface ProductListProps {
	products: Product[];
	onSelect: (product: Product) => void;
}

export function ProductList({ products, onSelect }: ProductListProps) {
	return (
		<Card className="overflow-x-auto">
			<table className="w-full text-sm">
				<thead>
					<tr className="text-left border-b">
						<th className="p-2">Nombre</th>
						<th className="p-2">SKU</th>
						<th className="p-2">Categoría</th>
						<th className="p-2">Precio</th>
						<th className="p-2">Inventario</th>
						<th className="p-2 w-28">Acciones</th>
					</tr>
				</thead>
				<tbody>
					{products.map((p) => (
						<tr key={p.id} className="border-b">
							<td className="p-2">{p.name}</td>
							<td className="p-2">{p.sku || '—'}</td>
							<td className="p-2">{p.categoryName || '—'}</td>
							<td className="p-2">${(p.price ?? 0).toFixed(2)}</td>
							<td className="p-2">{p.trackInventory ? (p.stockByWarehouse?.reduce((s,w)=>s+w.stock,0) ?? 0) : 'Sin control'}</td>
							<td className="p-2">
								<Button size="sm" variant="outline" onClick={() => onSelect(p)}>Ver</Button>
							</td>
						</tr>
					))}
				</tbody>
			</table>
		</Card>
	);
}
