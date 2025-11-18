import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import type { Warehouse } from "@/interfaces/warehouse";
import type { WarehouseProductStock } from "@/interfaces/warehouse";
import { AlertCircle, Package, Search, LayoutGrid, List, Plus, Upload, Settings2 } from "lucide-react";
import { useMemo, useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Can } from "@/components/Can";
import { Permission } from "@/interfaces/role";
import { Skeleton } from "@/components/ui/skeleton";

type StatusFilter = "all" | "active" | "inactive";
type ViewMode = "cards" | "list";

interface Props {
    warehouses: Warehouse[];
    stocks: WarehouseProductStock[];
    selectedId?: string | null;
    onSelect: (id: string) => void;
    onCreate: () => void;
    onEdit: (w: Warehouse) => void;
    onImportCSV?: () => void;
    loading?: boolean;
}

const STORAGE_KEY = "warehouses-ui-prefs";

export function WarehouseList({ warehouses, stocks, selectedId, onSelect, onCreate, onEdit, onImportCSV, loading }: Props) {
    const [q, setQ] = useState("");
    const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
    const [viewMode, setViewMode] = useState<ViewMode>("cards");

    useEffect(() => {
        const saved = localStorage.getItem(STORAGE_KEY);
        if (saved) {
            try {
                const prefs = JSON.parse(saved);
                if (prefs.statusFilter) setStatusFilter(prefs.statusFilter);
                if (prefs.viewMode) setViewMode(prefs.viewMode);
            } catch { }
        }
    }, []);

    useEffect(() => {
        localStorage.setItem(STORAGE_KEY, JSON.stringify({ statusFilter, viewMode }));
    }, [statusFilter, viewMode]);

    const lowStockByWarehouse = useMemo(() => {
        const map = new Map<string, number>();
        stocks.forEach(s => {
            if (s.stock < s.minStock) {
                map.set(s.warehouseId, (map.get(s.warehouseId) || 0) + 1);
            }
        });
        return map;
    }, [stocks]);

    const filtered = useMemo(() => {
        const term = q.toLowerCase();
        return warehouses.filter(w => {
            const matchesSearch = [w.name, w.code, w.location, w.manager].some(f => f?.toLowerCase().includes(term));
            const matchesStatus = statusFilter === "all" || (statusFilter === "active" && w.status === "ACTIVE") || (statusFilter === "inactive" && w.status === "INACTIVE");
            return matchesSearch && matchesStatus;
        });
    }, [q, warehouses, statusFilter]);

    return (
        <Card className="p-0 flex flex-col h-full">
            <div className="p-3 border-b space-y-2">
                <div className="flex items-start sm:items-center justify-between gap-2 flex-col sm:flex-row mb-4">
                    <h2 className="font-semibold text-lg">Bodegas</h2>
                    <div className="flex items-center gap-1">
                        <Button
                            variant={viewMode === "cards" ? "default" : "outline"}
                            size="icon"
                            onClick={() => setViewMode("cards")}
                            aria-label="Vista de tarjetas"
                            className="h-9 w-9"
                        >
                            <LayoutGrid className="w-4 h-4" />
                        </Button>
                        <Button
                            variant={viewMode === "list" ? "default" : "outline"}
                            size="icon"
                            onClick={() => setViewMode("list")}
                            aria-label="Vista de lista"
                            className="h-9 w-9"
                        >
                            <List className="w-4 h-4" />
                        </Button>
                        <Can permission={Permission.CREATE_INVENTORY}>
                            <Button size="sm" onClick={onCreate} className="ml-1 h-9">
                                <Plus className="w-4 h-4 mr-1" />
                                Nueva
                            </Button>
                        </Can>
                    </div>
                </div>
                {loading ? (
                    <>
                        <Skeleton className="h-9 w-full" />
                        <Skeleton className="h-9 w-full" />
                    </>
                ) : (
                    <>
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input value={q} onChange={e => setQ(e.target.value)} placeholder="Buscar por nombre o código" className="pl-9 h-9" />
                        </div>
                        <Select value={statusFilter} onValueChange={(v) => setStatusFilter(v as StatusFilter)}>
                            <SelectTrigger className="h-9">
                                <SelectValue placeholder="Filtrar por estado" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">Todas</SelectItem>
                                <SelectItem value="active">Activas</SelectItem>
                                <SelectItem value="inactive">Inactivas</SelectItem>
                            </SelectContent>
                        </Select>
                    </>
                )}
            </div>

            <div className="flex-1 overflow-auto">
                {loading && (
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
                )}
                {!loading && filtered.length === 0 && (
                    <div className="p-12 text-center flex flex-col items-center gap-3">
                        <Package className="h-12 w-12 text-muted-foreground/50" />
                        <div>
                            <p className="text-sm font-medium text-muted-foreground">No hay bodegas</p>
                            <p className="text-xs text-muted-foreground">Crea la primera bodega para comenzar</p>
                        </div>
                        <Button size="sm" onClick={onCreate}>Crear bodega</Button>
                    </div>
                )}
                {!loading && viewMode === "cards" ? (
                    filtered.map(w => {
                        const lowStock = lowStockByWarehouse.get(w.id) || 0;
                        return (
                            <motion.div
                                key={w.id}
                                role="button"
                                tabIndex={0}
                                onClick={() => onSelect(w.id)}
                                onKeyDown={(e) => {
                                    if (e.key === "Enter" || e.key === " ") {
                                        e.preventDefault();
                                        onSelect(w.id);
                                    }
                                }}
                                whileHover={{ y: -2 }}
                                transition={{ type: "spring", stiffness: 300 }}
                                className={`relative w-full text-left p-3 border-b flex items-start gap-3 transition hover:bg-accent/10 ${selectedId === w.id ? "bg-accent/10" : ""}`}
                            >
                                {selectedId === w.id && (
                                    <span aria-hidden className="absolute left-0 top-0 bottom-0 w-0.5 bg-primary" />
                                )}
                                <Package className="mt-0.5 h-6 w-6 shrink-0 text-muted-foreground" />
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-2">
                                        <span className="font-semibold truncate">{w.name}</span>
                                        <span className="text-xs text-muted-foreground shrink-0">{w.code}</span>
                                    </div>
                                    <div className="text-xs text-muted-foreground truncate">{w.location}</div>
                                    <div className="flex items-center gap-2 mt-1">
                                        <Badge variant={w.status === "ACTIVE" ? "default" : "secondary"} className="text-[10px] uppercase">
                                            {w.status === "ACTIVE" ? "Activa" : "Inactiva"}
                                        </Badge>
                                        {lowStock > 0 && (
                                            <Badge variant="destructive" className="text-[10px] flex items-center gap-1">
                                                <AlertCircle className="h-3 w-3" />
                                                {lowStock} bajo stock
                                            </Badge>
                                        )}
                                    </div>
                                </div>
                                <Can permission={Permission.UPDATE_INVENTORY}>
                                    <Button
                                        size="icon"
                                        variant="ghost"
                                        onClick={(e) => { e.stopPropagation(); onEdit(w); }}
                                        className="shrink-0 h-8 w-8"
                                        aria-label="Configurar bodega"
                                    >
                                        <Settings2 className="w-4 h-4" />
                                    </Button>
                                </Can>
                            </motion.div>
                        );
                    })
                ) : !loading ? (
                    <div className="p-2 overflow-x-auto">
                        <table className="w-full min-w-[560px]">
                            <thead>
                                <tr className="border-b">
                                    <th className="text-left py-2 px-2 font-medium">Nombre</th>
                                    <th className="text-left py-2 px-2 font-medium">Código</th>
                                    <th className="text-left py-2 px-2 font-medium">Estado</th>
                                    <th className="text-center py-2 px-2 font-medium">Bajo stock</th>
                                    <th className="py-1.5 px-2"></th>
                                </tr>
                            </thead>
                            <tbody className="divide-y">
                                {filtered.map(w => {
                                    const lowStock = lowStockByWarehouse.get(w.id) || 0;
                                    return (
                                        <motion.tr
                                            key={w.id}
                                            onClick={() => onSelect(w.id)}
                                            className={`cursor-pointer hover:bg-accent/5 transition relative ${selectedId === w.id ? "bg-accent/10 font-medium" : ""}`}
                                        >
                                            <td className="py-2 px-2 text-sm font-medium relative">
                                                {selectedId === w.id && (
                                                    <span aria-hidden className="absolute left-0 top-0 bottom-0 w-0.5 bg-primary" />
                                                )}
                                                {w.name}
                                            </td>
                                            <td className="py-2 px-2 text-sm text-muted-foreground">{w.code}</td>
                                            <td className="py-2 px-2">
                                                <Badge variant={w.status === "ACTIVE" ? "default" : "secondary"} className="text-[10px]">
                                                    {w.status === "ACTIVE" ? "Activa" : "Inactiva"}
                                                </Badge>
                                            </td>
                                            <td className="py-2 px-2 text-center">
                                                {lowStock > 0 && (
                                                    <Badge variant="destructive" className="text-[10px]">
                                                        {lowStock}
                                                    </Badge>
                                                )}
                                            </td>
                                            <td className="py-2 px-2">
                                                <Can permission={Permission.UPDATE_INVENTORY}>
                                                    <Button
                                                        size="icon"
                                                        variant="ghost"
                                                        onClick={(e) => { e.stopPropagation(); onEdit(w); }}
                                                        className="h-8 w-8 p-0"
                                                        aria-label="Configurar bodega"
                                                    >
                                                        <Settings2 className="w-4 h-4" />
                                                    </Button>
                                                </Can>
                                            </td>
                                        </motion.tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                ) : null}
            </div>

            <div className="p-2 border-t flex items-center justify-between text-xs text-muted-foreground">
                <span>{filtered.length} bodega{filtered.length !== 1 ? 's' : ''}</span>
                {onImportCSV && (
                    <Can permission={Permission.UPDATE_INVENTORY}>
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={onImportCSV}
                            className="h-7 text-xs"
                        >
                            <Upload className="w-3.5 h-3.5 mr-1" />
                            Importar CSV
                        </Button>
                    </Can>
                )}
            </div>
        </Card>
    );
}
