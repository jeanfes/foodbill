import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search, Download, Upload, LayoutGrid, List } from 'lucide-react';
import { useInventoryMock } from '@/hooks/useInventoryMock';
import { InventoryKpis } from './components/InventoryKpis';
import { InventoryCard } from './components/InventoryCard';
import { InventoryDetailDrawer } from './components/InventoryDetailDrawer';
import { ImportInventoryDialog } from './components/ImportInventoryDialog';
import { exportInventoryToCSV } from './utils/csvExport';
import { Can } from '@/components/Can';
import { Permission } from '@/interfaces/role';
import type { InventoryFilters } from '@/interfaces/inventory';

export default function Inventory() {
  const {
    filteredItems,
    getStockLowCount,
    preferences,
    setPreferences,
    warehouses
  } = useInventoryMock();

  const [filters, setFilters] = useState<InventoryFilters>(
    preferences.lastFilters || {}
  );
  const [viewMode, setViewMode] = useState<'cards' | 'list'>(
    (preferences.viewMode === 'cards' || preferences.viewMode === 'list' 
      ? preferences.viewMode 
      : 'cards')
  );
  const [selectedProductId, setSelectedProductId] = useState<string | null>(null);
  const [importDialogOpen, setImportDialogOpen] = useState(false);

  const items = useMemo(() => filteredItems(filters), [filteredItems, filters]);
  const stockLowCount = useMemo(() => getStockLowCount(), [getStockLowCount]);

  const handleApplyFilters = () => {
    setPreferences({
      ...preferences,
      lastFilters: filters,
      viewMode
    });
  };

  return (
    <div className="space-y-4">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col md:flex-row md:items-center md:justify-between gap-3"
      >
        <div>
          <h1 className="text-2xl font-bold">Inventario</h1>
          <p className="text-sm text-muted-foreground">
            Gestiona el stock de productos por bodega
          </p>
        </div>
        <div className="flex gap-2">
          <Can permission={Permission.IMPORT_INVENTORY}>
            <Button variant="outline" size="sm" onClick={() => setImportDialogOpen(true)}>
              <Upload className="h-4 w-4 mr-2" />
              Importar
            </Button>
          </Can>
          <Can permission={Permission.EXPORT_INVENTORY}>
            <Button variant="outline" size="sm" onClick={() => exportInventoryToCSV(items)}>
              <Download className="h-4 w-4 mr-2" />
              Exportar
            </Button>
          </Can>
        </div>
      </motion.div>

      <InventoryKpis totalItems={items.length} stockLowCount={stockLowCount} />

      <Card className="p-3">
        <div className="flex flex-col sm:flex-row gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              value={filters.search || ''}
              onChange={(e) => setFilters({ ...filters, search: e.target.value })}
              placeholder="Buscar por nombre o SKU..."
              className="pl-9 h-10"
            />
          </div>

          <Select
            value={filters.warehouseId || 'all'}
            onValueChange={(v) =>
              setFilters({ ...filters, warehouseId: v === 'all' ? undefined : v })
            }
          >
            <SelectTrigger className="w-full sm:w-48 h-10">
              <SelectValue placeholder="Todas las bodegas" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todas las bodegas</SelectItem>
              {warehouses.map((w) => (
                <SelectItem key={w.id} value={w.id}>
                  {w.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select
            value={
              filters.stockLowOnly
                ? 'low'
                : filters.trackableOnly
                ? 'tracked'
                : 'all'
            }
            onValueChange={(v) => {
              if (v === 'low') {
                setFilters({ ...filters, stockLowOnly: true, trackableOnly: undefined });
              } else if (v === 'tracked') {
                setFilters({ ...filters, trackableOnly: true, stockLowOnly: undefined });
              } else {
                setFilters({ ...filters, stockLowOnly: undefined, trackableOnly: undefined });
              }
            }}
          >
            <SelectTrigger className="w-full sm:w-48 h-10">
              <SelectValue placeholder="Filtros" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos</SelectItem>
              <SelectItem value="tracked">Solo rastreados</SelectItem>
              <SelectItem value="low">Stock bajo</SelectItem>
            </SelectContent>
          </Select>

          <Button onClick={handleApplyFilters} className="h-10">
            Buscar
          </Button>
        </div>
      </Card>

      <div className="flex justify-end gap-2">
        <Button
          variant={viewMode === 'cards' ? 'default' : 'outline'}
          size="icon"
          onClick={() => setViewMode('cards')}
        >
          <LayoutGrid className="w-4 h-4" />
        </Button>
        <Button
          variant={viewMode === 'list' ? 'default' : 'outline'}
          size="icon"
          onClick={() => setViewMode('list')}
        >
          <List className="w-4 h-4" />
        </Button>
      </div>

      {items.length > 0 ? (
        <div
          className={
            viewMode === 'cards'
              ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4'
              : 'flex flex-col gap-2'
          }
        >
          {items.map((item) => (
            <InventoryCard
              key={item.productId}
              item={item}
              onViewDetail={setSelectedProductId}
            />
          ))}
        </div>
      ) : (
        <Card className="p-16 text-center">
          <p className="text-muted-foreground">
          No se encontraron productos que coincidan con los filtros
        </p>
      </Card>
      )}

      <InventoryDetailDrawer
        open={!!selectedProductId}
        onOpenChange={(open) => !open && setSelectedProductId(null)}
        productId={selectedProductId}
      />

      <ImportInventoryDialog
        open={importDialogOpen}
        onOpenChange={setImportDialogOpen}
      />
    </div>
  );
}