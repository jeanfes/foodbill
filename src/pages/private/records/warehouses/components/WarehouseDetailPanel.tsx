import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { AlertTriangle, Package, TrendingUp, Search, Settings2, Power, PlusCircle } from "lucide-react";
import { useMemo, useState, useEffect } from "react";
import type { Warehouse, WarehouseProductStock } from "@/interfaces/warehouse";
import type { StockMovement } from "@/interfaces/stockMovement";
import { Can } from "@/components/Can";
import { Permission } from "@/interfaces/role";

interface Props {
    warehouse: Warehouse;
    stocks: WarehouseProductStock[];
    movements: StockMovement[];
    onEdit: (w: Warehouse) => void;
    onToggleActive: (w: Warehouse) => void;
    onNewMovement: () => void;
}

const STORAGE_KEY = "warehouse-detail-prefs";

export function WarehouseDetailPanel({ warehouse, stocks, movements, onEdit, onToggleActive, onNewMovement }: Props) {
    const [tab, setTab] = useState<"details" | "stock" | "movements">("details");
    const [stockSearch, setStockSearch] = useState("");
    const [showLowStockOnly, setShowLowStockOnly] = useState(false);

    useEffect(() => {
        const saved = localStorage.getItem(STORAGE_KEY);
        if (saved) {
            try {
                const prefs = JSON.parse(saved);
                if (prefs.tab) setTab(prefs.tab);
                if (prefs.showLowStockOnly !== undefined) setShowLowStockOnly(prefs.showLowStockOnly);
            } catch { /* ignore */ }
        }
    }, []);

    useEffect(() => {
        localStorage.setItem(STORAGE_KEY, JSON.stringify({ tab, showLowStockOnly }));
    }, [tab, showLowStockOnly]);

    const lowStockCount = useMemo(() => stocks.filter(s => s.stock < s.minStock).length, [stocks]);
    const lastUpdate = useMemo(() => {
        if (stocks.length === 0) return null;
        return new Date(Math.max(...stocks.map(s => new Date(s.lastUpdated).getTime())));
    }, [stocks]);

    const filteredStocks = useMemo(() => {
        return stocks.filter(s => {
            const matchesSearch = s.productName.toLowerCase().includes(stockSearch.toLowerCase());
            const matchesLowStock = !showLowStockOnly || s.stock < s.minStock;
            return matchesSearch && matchesLowStock;
        });
    }, [stocks, stockSearch, showLowStockOnly]);

    return (
        <Card className="p-0 flex flex-col h-full">
            <div className="flex items-start justify-between gap-3 p-4 border-b">
                <div className="min-w-0 flex-1">
                    <h2 className="text-xl font-semibold flex items-center gap-2 truncate">
                        <span className="truncate">{warehouse.name}</span>
                        <Badge variant={warehouse.status === "ACTIVE" ? "default" : "secondary"} className="uppercase text-[10px]">
                            {warehouse.status === "ACTIVE" ? "Activa" : "Inactiva"}
                        </Badge>
                    </h2>
                    <p className="text-xs text-muted-foreground">{warehouse.code} • {warehouse.location} • Responsable: {warehouse.manager}</p>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                    <Can permission={Permission.UPDATE_INVENTORY}>
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => onEdit(warehouse)}
                        >
                            <Settings2 className="w-4 h-4 mr-1" />
                            Configurar
                        </Button>
                    </Can>
                    <Can permission={Permission.UPDATE_INVENTORY}>
                        <Button
                            variant={warehouse.status === "ACTIVE" ? "destructive" : "default"}
                            size="sm"
                            onClick={() => onToggleActive(warehouse)}
                        >
                            <Power className="w-4 h-4 mr-1" />
                            {warehouse.status === "ACTIVE" ? "Desactivar" : "Activar"}
                        </Button>
                    </Can>
                </div>
            </div>

            <div className="px-4 py-2 border-b flex items-center justify-between gap-3 flex-wrap">
                <div className="inline-flex h-9 items-center justify-center rounded-lg bg-muted p-1 text-muted-foreground">
                    {(["details", "stock", "movements"] as const).map(v => (
                        <button
                            key={v}
                            type="button"
                            onClick={() => setTab(v)}
                            className={`inline-flex items-center justify-center whitespace-nowrap rounded-md px-3 py-1 text-sm font-medium transition ${tab === v ? "bg-background text-foreground shadow" : "hover:text-foreground/80"}`}
                        >
                            {v === "details" ? "Detalles" : v === "stock" ? `Stock ${lowStockCount > 0 ? `(${lowStockCount} bajo)` : ""}` : "Movimientos"}
                        </button>
                    ))}
                </div>

                <div className="flex items-center gap-4 text-xs flex-wrap">
                    <div className="flex items-center gap-1.5">
                        <Package className="h-4 w-4 text-muted-foreground" />
                        <span className="text-muted-foreground">{stocks.length} productos</span>
                    </div>
                    {lowStockCount > 0 && (
                        <div className="flex items-center gap-1.5">
                            <AlertTriangle className="h-4 w-4 text-destructive" />
                            <span className="text-destructive font-medium">{lowStockCount} bajo stock</span>
                        </div>
                    )}
                    {lastUpdate && (
                        <div className="flex items-center gap-1.5">
                            <TrendingUp className="h-4 w-4 text-muted-foreground" />
                            <span className="text-muted-foreground">{lastUpdate.toLocaleDateString()}</span>
                        </div>
                    )}
                </div>
            </div>

            {tab === "details" && (
                <div className="flex-1 overflow-auto">
                    <div className="p-4 space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <Card className="p-3">
                                <div className="text-xs text-muted-foreground mb-1">Descripción</div>
                                <div className="text-sm">{warehouse.description || "Sin descripción"}</div>
                            </Card>
                            <Card className="p-3">
                                <div className="text-xs text-muted-foreground mb-1">Responsable</div>
                                <div className="text-sm font-medium">{warehouse.manager || "-"}</div>
                            </Card>
                            <Card className="p-3">
                                <div className="text-xs text-muted-foreground mb-1">Fecha de creación</div>
                                <div className="text-sm">{new Date(warehouse.createdAt).toLocaleString()}</div>
                            </Card>
                            <Card className="p-3">
                                <div className="text-xs text-muted-foreground mb-1">Última actualización</div>
                                <div className="text-sm">{new Date(warehouse.updatedAt).toLocaleString()}</div>
                            </Card>
                        </div>
                    </div>
                </div>
            )}

            {tab === "stock" && (
                <div className="flex-1 overflow-auto">
                    <div className="p-3 border-b flex flex-col sm:flex-row sm:items-center gap-2">
                        <div className="relative flex-1 w-full">
                            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input
                                placeholder="Buscar producto..."
                                value={stockSearch}
                                onChange={(e) => setStockSearch(e.target.value)}
                                className="pl-8 h-9"
                            />
                        </div>
                        <Button
                            size="sm"
                            variant={showLowStockOnly ? "default" : "outline"}
                            onClick={() => setShowLowStockOnly(!showLowStockOnly)}
                            className="w-full sm:w-auto"
                        >
                            Solo bajo stock
                        </Button>
                    </div>
                    {filteredStocks.length === 0 && (
                        <div className="p-12 text-center flex flex-col items-center gap-3">
                            <Package className="h-12 w-12 text-muted-foreground/50" />
                            <div>
                                <p className="text-sm font-medium text-muted-foreground">Sin productos</p>
                                <p className="text-xs text-muted-foreground">No hay productos en esta bodega</p>
                            </div>
                        </div>
                    )}
                    {filteredStocks.length > 0 && (
                        <div className="rounded-md border m-3 overflow-x-auto">
                            <Table className="min-w-[640px]">
                                <TableHeader>
                                    <TableRow>
                                        <TableHead className="w-[45%]">Producto</TableHead>
                                        <TableHead className="w-[10%]">Unidad</TableHead>
                                        <TableHead className="w-[15%] text-right">Stock</TableHead>
                                        <TableHead className="w-[15%] text-right">Mínimo</TableHead>
                                        <TableHead className="w-[15%]">Últ. actualización</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {filteredStocks.map(s => (
                                        <TableRow key={`${s.warehouseId}-${s.productId}`}>
                                            <TableCell className="font-medium truncate" title={s.productName}>{s.productName}</TableCell>
                                            <TableCell className="text-muted-foreground">{s.unit}</TableCell>
                                            <TableCell className="text-right">
                                                <span className={s.stock < s.minStock ? "text-destructive font-semibold" : undefined}>{s.stock}</span>
                                                {s.stock < s.minStock && (
                                                    <Badge variant="outline" className="ml-2 text-[10px]">Bajo</Badge>
                                                )}
                                            </TableCell>
                                            <TableCell className="text-right">{s.minStock}</TableCell>
                                            <TableCell className="text-xs">{new Date(s.lastUpdated).toLocaleDateString()}</TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </div>
                    )}
                </div>
            )}

            {tab === "movements" && (
                <div className="flex-1 overflow-auto">
                    <div className="p-3 border-b flex items-center justify-between">
                        <div className="text-sm text-muted-foreground">Historial de movimientos (más recientes primero)</div>
                        <Can permission={Permission.UPDATE_INVENTORY}>
                            <Button
                                size="sm"
                                onClick={onNewMovement}
                            >
                                <PlusCircle className="w-4 h-4 mr-1" />
                                Nuevo movimiento
                            </Button>
                        </Can>
                    </div>
                    {movements.length === 0 && (
                        <div className="p-12 text-center flex flex-col items-center gap-3">
                            <TrendingUp className="h-12 w-12 text-muted-foreground/50" />
                            <div>
                                <p className="text-sm font-medium text-muted-foreground">Sin movimientos</p>
                                <p className="text-xs text-muted-foreground">Registra el primer movimiento para esta bodega</p>
                            </div>
                            <Can permission={Permission.UPDATE_INVENTORY}>
                                <Button
                                    size="sm"
                                    onClick={onNewMovement}
                                >
                                    <PlusCircle className="w-4 h-4 mr-1" />
                                    Nuevo movimiento
                                </Button>
                            </Can>
                        </div>
                    )}
                    {movements.length > 0 && (
                        <div className="rounded-md border m-3">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Fecha</TableHead>
                                        <TableHead>Tipo</TableHead>
                                        <TableHead>Producto</TableHead>
                                        <TableHead className="text-right">Cantidad</TableHead>
                                        <TableHead>Nota</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {movements.map(m => (
                                        <TableRow key={m.id}>
                                            <TableCell className="text-xs">{new Date(m.date).toLocaleString()}</TableCell>
                                            <TableCell>
                                                <Badge variant={m.type === "IN" ? "default" : m.type === "OUT" ? "destructive" : "secondary"} className="text-[10px]">
                                                    {m.type === "IN" ? "Entrada" : m.type === "OUT" ? "Salida" : m.type === "ADJUST" ? "Ajuste" : "Transferencia"}
                                                </Badge>
                                            </TableCell>
                                            <TableCell className="font-medium">{m.productName}</TableCell>
                                            <TableCell className="text-right font-mono">{m.quantity}</TableCell>
                                            <TableCell className="text-sm text-muted-foreground">{m.note || "-"}</TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </div>
                    )}
                </div>
            )}
        </Card>
    );
}
