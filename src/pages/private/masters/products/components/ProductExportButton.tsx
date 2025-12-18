import type { Product } from '@/interfaces/product';

interface ProductExportButtonProps {
	products: Product[];
	onExport?: (products: Product[]) => void;
}

export function ProductExportButton({ products, onExport }: ProductExportButtonProps) {
	const downloadCSV = () => {
		if (onExport) {
			onExport(products);
			return;
		}
		const headers = ['id','name','sku','price','cost','categoryId','categoryName','status','trackInventory','minStock','isComposite'];
		const rows = products.map(p => [
			p.id,
			p.name,
			p.sku ?? '',
			String(p.price ?? ''),
			String(p.cost ?? ''),
			p.categoryId ?? '',
			p.categoryName ?? '',
			p.status ?? '',
			String(!!p.trackInventory),
			String(p.minStock ?? ''),
			String(!!p.isComposite)
		]);
		const csv = [headers.join(','), ...rows.map(r => r.map(v => String(v).replace(/"/g, '""')).join(','))].join('\n');
		const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
		const url = URL.createObjectURL(blob);
		const a = document.createElement('a');
		a.href = url;
		a.download = 'productos.csv';
		a.click();
		URL.revokeObjectURL(url);
	};

	return (
		<button className="text-sm underline" onClick={downloadCSV}>Exportar CSV</button>
	);
}