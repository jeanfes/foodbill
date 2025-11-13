import { useState, useRef } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Upload, AlertCircle, CheckCircle } from "lucide-react";
import Papa from "papaparse";
import type { WarehouseProductStock } from "@/interfaces/warehouse";

interface ImportRow {
    productId?: string;
    productName?: string;
    unit?: string;
    stock?: string;
    minStock?: string;
    error?: string;
}

interface Props {
    open: boolean;
    onOpenChange: (v: boolean) => void;
    warehouseId: string;
    onImport: (stocks: Omit<WarehouseProductStock, "lastUpdated">[]) => void;
}

export function ImportStockDialog({ open, onOpenChange, warehouseId, onImport }: Props) {
    const [rows, setRows] = useState<ImportRow[]>([]);
    const [importing, setImporting] = useState(false);
    const fileRef = useRef<HTMLInputElement>(null);

    const handleFile = (file: File) => {
        Papa.parse<ImportRow>(file, {
            header: true,
            skipEmptyLines: true,
            complete: (results) => {
                const validated = results.data.map((row) => {
                    const errors: string[] = [];
                    if (!row.productId || row.productId.trim() === "") errors.push("productId requerido");
                    if (!row.productName || row.productName.trim() === "") errors.push("productName requerido");
                    if (!row.stock || isNaN(Number(row.stock))) errors.push("stock inválido");
                    if (!row.unit || row.unit.trim() === "") errors.push("unit requerido");
                    return { ...row, error: errors.length > 0 ? errors.join(", ") : undefined };
                });
                setRows(validated);
            },
        });
    };

    const handleImport = () => {
        const valid = rows.filter(r => !r.error);
        const stocks: Omit<WarehouseProductStock, "lastUpdated">[] = valid.map(r => ({
            warehouseId,
            productId: r.productId!,
            productName: r.productName!,
            unit: r.unit!,
            stock: Number(r.stock!),
            minStock: r.minStock ? Number(r.minStock) : 0,
        }));
        setImporting(true);
        setTimeout(() => {
            onImport(stocks);
            setImporting(false);
            setRows([]);
            onOpenChange(false);
        }, 500);
    };

    const errorsCount = rows.filter(r => r.error).length;
    const validCount = rows.length - errorsCount;

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-4xl max-h-[80vh] flex flex-col">
                <DialogHeader>
                    <DialogTitle>Importar stock desde CSV</DialogTitle>
                    <DialogDescription className="text-xs">
                        Sube un archivo CSV con columnas: productId, productName, unit, stock, minStock (opcional).
                    </DialogDescription>
                </DialogHeader>

                <div className="flex-1 overflow-auto">
                    {rows.length === 0 && (
                        <div
                            className="border-2 border-dashed rounded-lg p-12 text-center cursor-pointer hover:border-primary transition"
                            onClick={() => fileRef.current?.click()}
                        >
                            <Upload className="h-12 w-12 mx-auto text-muted-foreground mb-3" />
                            <p className="text-sm font-medium">Haz clic o arrastra un archivo CSV</p>
                            <p className="text-xs text-muted-foreground mt-1">Máximo 10 MB</p>
                            <input
                                ref={fileRef}
                                type="file"
                                accept=".csv"
                                className="hidden"
                                onChange={(e) => {
                                    const file = e.target.files?.[0];
                                    if (file) handleFile(file);
                                }}
                            />
                        </div>
                    )}

                    {rows.length > 0 && (
                        <div className="space-y-3">
                            <div className="flex items-center gap-2">
                                <Badge variant="default" className="flex items-center gap-1">
                                    <CheckCircle className="h-3 w-3" />
                                    {validCount} válidos
                                </Badge>
                                {errorsCount > 0 && (
                                    <Badge variant="destructive" className="flex items-center gap-1">
                                        <AlertCircle className="h-3 w-3" />
                                        {errorsCount} con errores
                                    </Badge>
                                )}
                            </div>

                            <div className="rounded-md border max-h-96 overflow-auto">
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>#</TableHead>
                                            <TableHead>Producto ID</TableHead>
                                            <TableHead>Nombre</TableHead>
                                            <TableHead>Unidad</TableHead>
                                            <TableHead className="text-right">Stock</TableHead>
                                            <TableHead className="text-right">Min</TableHead>
                                            <TableHead>Estado</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {rows.slice(0, 10).map((r, i) => (
                                            <TableRow key={i} className={r.error ? "bg-destructive/5" : undefined}>
                                                <TableCell className="text-xs">{i + 1}</TableCell>
                                                <TableCell className="text-xs">{r.productId || "-"}</TableCell>
                                                <TableCell className="text-xs">{r.productName || "-"}</TableCell>
                                                <TableCell className="text-xs">{r.unit || "-"}</TableCell>
                                                <TableCell className="text-xs text-right">{r.stock || "-"}</TableCell>
                                                <TableCell className="text-xs text-right">{r.minStock || "0"}</TableCell>
                                                <TableCell>
                                                    {r.error ? (
                                                        <Badge variant="outline" className="text-[10px] text-destructive">{r.error}</Badge>
                                                    ) : (
                                                        <Badge variant="outline" className="text-[10px]">✓</Badge>
                                                    )}
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </div>
                            {rows.length > 10 && (
                                <p className="text-xs text-muted-foreground text-center">Mostrando 10 de {rows.length} filas</p>
                            )}
                        </div>
                    )}
                </div>

                <DialogFooter>
                    {rows.length > 0 && (
                        <>
                            <Button
                                variant="outline"
                                onClick={() => {
                                    setRows([]);
                                    if (fileRef.current) fileRef.current.value = "";
                                }}
                            >
                                Limpiar
                            </Button>
                            <Button onClick={handleImport} disabled={validCount === 0 || importing}>
                                {importing ? "Importando..." : `Importar ${validCount} producto${validCount !== 1 ? "s" : ""}`}
                            </Button>
                        </>
                    )}
                    {rows.length === 0 && (
                        <Button variant="outline" onClick={() => onOpenChange(false)}>
                            Cancelar
                        </Button>
                    )}
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
