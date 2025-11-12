import { useState } from 'react';
import { useProductsMock } from '../../../../hooks/useProductsMock';
import type { Product } from '../../../../lib/mockData/products';
import { Button } from '../../../../components/ui/button';
import { ProductList } from './components/ProductList';
import { ProductDetailDrawer } from './components/ProductDetailDrawer';
import { ProductFormModal } from './components/ProductFormModal';
import { ProductImportModal } from './components/ProductImportModal';
import { ProductExportButton } from './components/ProductExportButton';

export default function ProductsPage() {
    const {
        filteredProducts,
        createProduct,
        importProducts,
        exportProductsCSV
    } = useProductsMock();

    const [selected, setSelected] = useState<Product | null>(null);
    const [search, setSearch] = useState('');
    const [showForm, setShowForm] = useState(false);
    const [showImport, setShowImport] = useState(false);

    const filtered = filteredProducts({ search });

    return (
        <div className="p-4">
            <div className="flex items-center justify-between mb-4">
                <h1 className="text-2xl font-bold">Productos</h1>
                <div className="flex gap-2">
                    <Button onClick={() => setShowForm(true)} variant="default">Nuevo producto</Button>
                    <Button onClick={() => setShowImport(true)} variant="outline">Importar CSV</Button>
                    <ProductExportButton products={filtered} onExport={exportProductsCSV} />
                </div>
            </div>
            <div className="mb-4">
                <input
                    className="input input-bordered w-full max-w-xs"
                    placeholder="Buscar producto..."
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                    aria-label="Buscar producto"
                />
            </div>
            <ProductList products={filtered} onSelect={setSelected} />
            <ProductDetailDrawer product={selected} onClose={() => setSelected(null)} />
            <ProductFormModal
                open={showForm}
                onClose={() => setShowForm(false)}
                onSave={p => createProduct({
                    ...p,
                    id: `p-${Date.now()}-${Math.floor(Math.random() * 10000)}`,
                    name: p.name,
                    price: Number(p.price),
                    trackInventory: p.trackInventory,
                    status: p.status || 'active',
                    createdAt: new Date().toISOString(),
                    updatedAt: new Date().toISOString()
                })}
            />
            <ProductImportModal open={showImport} onClose={() => setShowImport(false)} onImport={importProducts} />
        </div>
    );
}
