import { useState, useEffect } from 'react';
import { useProductsMock } from '@/hooks/useProductsMock';
import type { Product } from '@/interfaces/product';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { ProductList } from './components/ProductList';
import { ProductGrid } from './components/ProductGrid';
import { ProductDetailDrawer } from './components/ProductDetailDrawer';
import { ProductFormModal } from './components/ProductFormModal';
import { ProductImportModal } from './components/ProductImportModal';
import { ProductExportButton } from './components/ProductExportButton';
import { AdjustStockModal } from './components/AdjustStockModal';
import { AdvancedFiltersPanel } from './components/AdvancedFiltersPanel';
import { LayoutGrid, Table, Search } from 'lucide-react';
import { motion } from 'framer-motion';

type ViewMode = 'grid' | 'table';

interface FiltersState {
    search: string;
    categoryIds: string[];
    status: 'all' | 'active' | 'inactive';
    trackInventory?: boolean;
    stockLowOnly: boolean;
    priceMin?: number;
    priceMax?: number;
    tags: string[];
}

export default function ProductsPage() {
    const {
        filteredProducts,
        createProduct,
        updateProduct,
        adjustStock,
        importProducts,
        exportProductsCSV,
        preferences,
        setPreferences
    } = useProductsMock();

    const [selected, setSelected] = useState<Product | null>(null);
    const [editingProduct, setEditingProduct] = useState<Product | null>(null);
    const [adjustingProduct, setAdjustingProduct] = useState<Product | null>(null);
    const [showForm, setShowForm] = useState(false);
    const [showImport, setShowImport] = useState(false);

    // View mode with localStorage persistence
    const [viewMode, setViewMode] = useState<ViewMode>(() => {
        const saved = localStorage.getItem('products_view_mode');
        return (saved as ViewMode) || 'grid';
    });

    useEffect(() => {
        localStorage.setItem('products_view_mode', viewMode);
    }, [viewMode]);

    // Filters state
    const [filters, setFilters] = useState<FiltersState>(() => ({
        search: preferences.lastFilters?.search || '',
        categoryIds: preferences.lastFilters?.categoryIds || [],
        status: preferences.lastFilters?.status || 'all',
        trackInventory: preferences.lastFilters?.trackInventory,
        stockLowOnly: preferences.lastFilters?.stockLowOnly || false,
        priceMin: preferences.lastFilters?.priceMin,
        priceMax: preferences.lastFilters?.priceMax,
        tags: preferences.lastFilters?.tags || []
    }));

    const handleFiltersChange = (newFilters: FiltersState) => {
        setFilters(newFilters);
    };

    const handleApplyFilters = () => {
        setPreferences({
            ...preferences,
            lastFilters: filters
        });
    };

    const handleClearFilters = () => {
        const emptyFilters: FiltersState = {
            search: '',
            categoryIds: [],
            status: 'all',
            trackInventory: undefined,
            stockLowOnly: false,
            priceMin: undefined,
            priceMax: undefined,
            tags: []
        };
        setFilters(emptyFilters);
        setPreferences({
            ...preferences,
            lastFilters: emptyFilters
        });
    };

    // Panel de filtros auto-contenido (control interno)

    // Apply filters to get filtered products
    const filtered = filteredProducts({
        search: filters.search,
        categoryIds: filters.categoryIds.length > 0 ? filters.categoryIds : undefined,
        status: filters.status !== 'all' ? filters.status : undefined,
        trackInventory: filters.trackInventory,
        stockLowOnly: filters.stockLowOnly,
        priceMin: filters.priceMin,
        priceMax: filters.priceMax,
        tags: filters.tags.length > 0 ? filters.tags : undefined
    });

    const handleCreateProduct = (p: Partial<Product>) => {
        createProduct({
            ...p,
            id: `p-${Date.now()}-${Math.floor(Math.random() * 10000)}`,
            name: p.name!,
            price: Number(p.price),
            trackInventory: p.trackInventory || false,
            status: p.status || 'active',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        } as Product);
        setShowForm(false);
    };

    const handleEditProduct = (product: Product) => {
        setEditingProduct(product);
        setShowForm(true);
    };

    const handleUpdateProduct = (p: Partial<Product>) => {
        if (editingProduct) {
            updateProduct({ ...editingProduct, ...p, updatedAt: new Date().toISOString() });
            setShowForm(false);
            setEditingProduct(null);
        }
    };

    return (
        <div className="space-y-4">
            {/* Header */}
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center justify-between"
            >
                <div>
                    <h1 className="text-2xl font-bold">Productos</h1>
                    <p className="text-sm text-muted-foreground">Gestiona tu base de productos y su información</p>
                </div>
                <div className="flex gap-2">
                    <Button onClick={() => setShowForm(true)} variant="default">Nuevo producto</Button>
                    <Button onClick={() => setShowImport(true)} variant="outline">Importar CSV</Button>
                    <ProductExportButton products={filtered} onExport={exportProductsCSV} />
                </div>
            </motion.div>

            {/* Buscador (estilo similar a Clientes) */}
            <Card className="p-4">
                <div className="flex gap-2">
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <Input
                            className="pl-10"
                            placeholder="Buscar por nombre, SKU o categoría..."
                            value={filters.search}
                            onChange={e => setFilters({ ...filters, search: e.target.value })}
                            aria-label="Buscar producto"
                        />
                    </div>
                    <Button onClick={() => setPreferences({ ...preferences, lastFilters: { ...filters } })}>
                        Buscar
                    </Button>
                </div>
            </Card>

            {/* Filters Panel */}
            <AdvancedFiltersPanel
                filters={filters}
                onFiltersChange={handleFiltersChange}
                onApply={handleApplyFilters}
                onClear={handleClearFilters}
            />

            {/* Toggle de vista */}
            <div className="flex justify-end gap-2">
                <Button
                    variant={viewMode === 'grid' ? 'default' : 'outline'}
                    size="icon"
                    onClick={() => setViewMode('grid')}
                    aria-label="Vista de grid"
                >
                    <LayoutGrid className="w-4 h-4" />
                </Button>
                <Button
                    variant={viewMode === 'table' ? 'default' : 'outline'}
                    size="icon"
                    onClick={() => setViewMode('table')}
                    aria-label="Vista de tabla"
                >
                    <Table className="w-4 h-4" />
                </Button>
            </div>

            {/* Products Display */}
            <motion.div
                key={`${viewMode}-${filtered.map(p => p.id).join(',')}`}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
            >
                {viewMode === 'grid' ? (
                    <ProductGrid
                        products={filtered}
                        onView={setSelected}
                        onEdit={handleEditProduct}
                        onAdjustStock={setAdjustingProduct}
                    />
                ) : (
                    <ProductList products={filtered} onSelect={setSelected} />
                )}
            </motion.div>

            {/* Modals and Drawers */}
            <ProductDetailDrawer product={selected} onClose={() => setSelected(null)} />

            <ProductFormModal
                open={showForm}
                initial={editingProduct || undefined}
                onClose={() => {
                    setShowForm(false);
                    setEditingProduct(null);
                }}
                onSave={editingProduct ? handleUpdateProduct : handleCreateProduct}
            />

            <ProductImportModal
                open={showImport}
                onClose={() => setShowImport(false)}
                onImport={importProducts}
            />

            <AdjustStockModal
                product={adjustingProduct}
                open={!!adjustingProduct}
                onClose={() => setAdjustingProduct(null)}
                onAdjust={({ productId, warehouseId, qty, reason }) => {
                    adjustStock({ productId, warehouseId, qty, reason });
                    setAdjustingProduct(null);
                }}
            />
        </div>
    );
}
