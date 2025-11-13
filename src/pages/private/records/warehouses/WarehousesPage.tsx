import { useMemo, useState, useEffect } from "react";
import { WarehouseList } from "./components/WarehouseList";
import { WarehouseDetailPanel } from "./components/WarehouseDetailPanel";
import { WarehouseFormDialog, type WarehouseFormValues } from "./components/WarehouseFormDialog";
import { MovementDialog } from "./components/MovementDialog";
import { ImportStockDialog } from "./components/ImportStockDialog";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { Skeleton } from "@/components/ui/skeleton";
import { Card } from "@/components/ui/card";
import { useToast } from "@/components/ui/toast";
import { warehousesMock, warehouseStocksMock, stockMovementsMock } from "./mock";
import type { Warehouse, WarehouseProductStock } from "@/interfaces/warehouse";
import type { StockMovement } from "@/interfaces/stockMovement";
import { motion } from "framer-motion";

export default function WarehousesPage() {
    const toast = useToast();
    const [loading, setLoading] = useState(true);
    const [warehouses, setWarehouses] = useState<Warehouse[]>([]);
    const [stocks, setStocks] = useState<WarehouseProductStock[]>([]);
    const [movements, setMovements] = useState<StockMovement[]>([]);

    const [selectedId, setSelectedId] = useState<string | null>(null);



    useEffect(() => {
        const timer = setTimeout(() => {
            setWarehouses(warehousesMock);
            setStocks(warehouseStocksMock);
            setMovements(stockMovementsMock);
            setSelectedId(warehousesMock[0]?.id ?? null);
            setLoading(false);
        }, 800);
        return () => clearTimeout(timer);
    }, []);

    const selectedWarehouse = useMemo(() => warehouses.find(w => w.id === selectedId) || null, [warehouses, selectedId]);
    const selectedStocks = useMemo(() => stocks.filter(s => s.warehouseId === selectedId), [stocks, selectedId]);
    const selectedMovements = useMemo(() => movements.filter(m => m.warehouseId === selectedId), [movements, selectedId]);

    const [formOpen, setFormOpen] = useState(false);
    const [editing, setEditing] = useState<Warehouse | null>(null);

    const [movOpen, setMovOpen] = useState(false);
    const [importOpen, setImportOpen] = useState(false);

    const [confirmDialog, setConfirmDialog] = useState<{ open: boolean; title: string; description: string; onConfirm: () => void } | null>(null);

    const usedCodes = useMemo(() => warehouses.map(w => w.code), [warehouses]);

    const handleCreate = () => { setEditing(null); setFormOpen(true); };
    const handleEdit = (w: Warehouse) => { setEditing(w); setFormOpen(true); };
    const handleSubmit = (values: WarehouseFormValues) => {
        if (editing) {
            setWarehouses(prev => prev.map(w => w.id === editing.id ? { ...w, ...values, updatedAt: new Date().toISOString() } : w));
            toast.show("Bodega actualizada correctamente", "success");
        } else {
            const w: Warehouse = {
                id: crypto.randomUUID(),
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
                ...values,
            };
            setWarehouses(prev => [w, ...prev]);
            setSelectedId(w.id);
            toast.show("Bodega creada exitosamente", "success");
        }
        setFormOpen(false);
    };

    const handleToggleActive = (w: Warehouse) => {
        const action = w.status === "ACTIVE" ? "desactivar" : "activar";
        setConfirmDialog({
            open: true,
            title: `¿${action.charAt(0).toUpperCase() + action.slice(1)} bodega?`,
            description: `Estás a punto de ${action} la bodega "${w.name}". ${w.status === "ACTIVE" ? "No se podrán realizar operaciones hasta reactivarla." : ""}`,
            onConfirm: () => {
                setWarehouses(prev => prev.map(x => x.id === w.id ? ({ ...x, status: x.status === "ACTIVE" ? "INACTIVE" : "ACTIVE", updatedAt: new Date().toISOString() }) : x));
                toast.show(`Bodega ${action === "desactivar" ? "desactivada" : "activada"}`, "success");
            },
        });
    };

    const handleNewMovement = () => setMovOpen(true);
    const handleSubmitMovement = (mov: Omit<StockMovement, "id" | "date">) => {
        if (!selectedWarehouse) return;
        const fullMov: StockMovement = { ...mov, id: crypto.randomUUID(), date: new Date().toISOString(), warehouseId: selectedWarehouse.id };
        setMovements(prev => [fullMov, ...prev]);
        setStocks(prev => {
            const idx = prev.findIndex(s => s.warehouseId === selectedWarehouse.id && s.productId === mov.productId);
            const sign = mov.type === "OUT" ? -1 : 1;
            if (idx >= 0) {
                const next = [...prev];
                next[idx] = { ...next[idx], stock: Math.max(0, next[idx].stock + sign * mov.quantity), lastUpdated: new Date().toISOString() };
                return next;
            } else {
                return [
                    ...prev,
                    { warehouseId: selectedWarehouse.id, productId: mov.productId, productName: mov.productName, unit: "und", stock: Math.max(0, sign * mov.quantity), minStock: 0, lastUpdated: new Date().toISOString() },
                ];
            }
        });
        setMovOpen(false);
        toast.show("Movimiento registrado correctamente", "success");
    };

    const handleImportStock = (imported: Omit<WarehouseProductStock, "lastUpdated">[]) => {
        const withDate = imported.map(s => ({ ...s, lastUpdated: new Date().toISOString() }));
        setStocks(prev => {
            const filtered = prev.filter(s => s.warehouseId !== imported[0]?.warehouseId || !imported.some(i => i.productId === s.productId));
            return [...filtered, ...withDate];
        });
        toast.show(`${imported.length} productos importados correctamente`, "success");
    };

    const productsForSelect = useMemo(() => {
        const map = new Map<string, string>();
        stocks.forEach(s => { map.set(s.productId, s.productName); });
        return Array.from(map.entries()).map(([id, name]) => ({ id, name }));
    }, [stocks]);

    return (
        <div className="space-y-4">
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex flex-col md:flex-row md:items-center md:justify-between gap-3"
            >
                <div>
                    <h1 className="text-2xl font-bold">Bodegas</h1>
                    <p className="text-sm text-muted-foreground">Gestiona tus bodegas y su inventario por almacén</p>
                </div>
            </motion.div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                <div className="lg:col-span-1">
                    <WarehouseList
                        loading={loading}
                        warehouses={warehouses}
                        stocks={stocks}
                        selectedId={selectedId}
                        onSelect={setSelectedId}
                        onCreate={handleCreate}
                        onEdit={handleEdit}
                        onImportCSV={selectedWarehouse ? () => setImportOpen(true) : undefined}
                    />
                </div>
                <div className="lg:col-span-2">
                    {selectedWarehouse ? (
                        <WarehouseDetailPanel
                            warehouse={selectedWarehouse}
                            stocks={selectedStocks}
                            movements={selectedMovements}
                            onEdit={handleEdit}
                            onToggleActive={handleToggleActive}
                            onNewMovement={handleNewMovement}
                        />
                    ) : loading ? (
                        <Card className="p-0 flex flex-col h-full">
                            {/* Header skeleton */}
                            <div className="p-3 border-b space-y-2">
                                <div className="flex items-center justify-between gap-2">
                                    <Skeleton className="h-6 w-48" />
                                    <div className="flex items-center gap-2">
                                        <Skeleton className="h-9 w-24" />
                                        <Skeleton className="h-9 w-24" />
                                    </div>
                                </div>
                                <Skeleton className="h-4 w-full max-w-md" />
                            </div>

                            {/* Tabs skeleton */}
                            <div className="px-4 py-2 border-b flex items-center justify-between gap-3">
                                <Skeleton className="h-9 w-72" />
                                <Skeleton className="h-4 w-32" />
                            </div>

                            {/* Content skeleton - igual que el panel izquierdo */}
                            <div className="flex-1 overflow-auto">
                                <div className="divide-y">
                                    {Array.from({ length: 6 }).map((_, i) => (
                                        <div key={i} className="p-3 flex items-start gap-3">
                                            <Skeleton className="h-6 w-6 rounded-md" />
                                            <div className="flex-1 min-w-0 space-y-2">
                                                <Skeleton className="h-4 w-1/3" />
                                                <Skeleton className="h-3 w-1/2" />
                                                <div className="flex gap-2">
                                                    <Skeleton className="h-5 w-16 rounded-full" />
                                                    <Skeleton className="h-5 w-20 rounded-full" />
                                                </div>
                                            </div>
                                            <Skeleton className="h-8 w-8 rounded-md" />
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </Card>
                    ) : (
                        <div className="h-full flex items-center justify-center text-muted-foreground">
                            Selecciona una bodega
                        </div>
                    )}
                </div>

                <WarehouseFormDialog
                    open={formOpen}
                    onOpenChange={setFormOpen}
                    onSubmit={handleSubmit}
                    initial={editing}
                    usedCodes={usedCodes}
                />

                <MovementDialog
                    open={movOpen}
                    onOpenChange={setMovOpen}
                    onSubmit={handleSubmitMovement}
                    products={productsForSelect}
                    warehouses={warehouses}
                />

                {selectedWarehouse && (
                    <ImportStockDialog
                        open={importOpen}
                        onOpenChange={setImportOpen}
                        warehouseId={selectedWarehouse.id}
                        onImport={handleImportStock}
                    />
                )}

                {confirmDialog && (
                    <ConfirmDialog
                        open={confirmDialog.open}
                        onOpenChange={(v) => !v && setConfirmDialog(null)}
                        title={confirmDialog.title}
                        description={confirmDialog.description}
                        onConfirm={confirmDialog.onConfirm}
                        variant="destructive"
                        confirmLabel="Continuar"
                    />
                )}
            </div>
        </div>
    );
}
