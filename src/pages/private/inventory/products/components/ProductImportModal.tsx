import { useRef, useState } from 'react';
import Papa from 'papaparse';
import type { ParseResult } from 'papaparse';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogClose } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import type { Product } from '@/interfaces/product';

interface ProductImportModalProps {
    open: boolean;
    onClose: () => void;
    onImport: (rows: Partial<Product>[]) => void;
}

export function ProductImportModal({ open, onClose, onImport }: ProductImportModalProps) {
    const [rows, setRows] = useState<any[]>([]);
    const [preview, setPreview] = useState<any[]>([]);
    const [errors, setErrors] = useState<string[]>([]);
    const [fileName, setFileName] = useState<string>('');
    const fileRef = useRef<HTMLInputElement>(null);

    function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
        const file = e.target.files?.[0];
        if (!file) return;
        setFileName(file.name);
        Papa.parse(file, {
            header: true,
            skipEmptyLines: true,
            complete: (result: ParseResult<any>) => {
                const parsed = (result.data as any[]).filter(Boolean);
                setRows(parsed);
                setPreview(parsed.slice(0, 10));
                const errs: string[] = [];
                parsed.forEach((row: any, i: number) => {
                    const displayRow = i + 2; // considerando cabecera
                    if (!row.name || String(row.name).trim().length < 2) errs.push(`Fila ${displayRow}: nombre requerido`);
                    if (row.price === undefined || row.price === null || isNaN(Number(row.price))) errs.push(`Fila ${displayRow}: precio inválido`);
                });
                setErrors(errs);
            }
        });
    }

    function clearFile() {
        if (fileRef.current) {
            fileRef.current.value = '';
        }
        setFileName('');
        setRows([]);
        setPreview([]);
        setErrors([]);
    }

    function handleImport() {
        if (errors.length || rows.length === 0) return;
        onImport(rows as Partial<Product>[]);
        onClose();
        clearFile();
    }

    const columns = preview.length > 0 ? Object.keys(preview[0]) : [];

    return (
        <Dialog open={open} onOpenChange={(v: boolean) => { if (!v) onClose(); }}>
            <DialogContent className="max-w-2xl">
                <DialogHeader>
                    <DialogTitle className="text-xl">Importar productos (CSV)</DialogTitle>
                </DialogHeader>

                <div className="space-y-3">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                        <div>
                            <div className="text-sm font-medium">Archivo CSV</div>
                            <p className="text-xs text-muted-foreground">Formato sugerido: name, price, sku, category, stock</p>
                        </div>
                        <div className="flex items-center gap-2">
                            <input
                                ref={fileRef}
                                type="file"
                                accept=".csv"
                                onChange={handleFile}
                                className="hidden"
                            />
                            <Button type="button" variant="secondary" onClick={() => fileRef.current?.click()}>
                                {fileName ? 'Cambiar archivo' : 'Seleccionar CSV'}
                            </Button>
                            {fileName && (
                                <Button type="button" variant="ghost" onClick={clearFile}>
                                    Limpiar
                                </Button>
                            )}
                        </div>
                    </div>
                    {fileName && <div className="text-xs text-muted-foreground">Seleccionado: {fileName}</div>}

                    {preview.length > 0 && (
                        <div className="mt-2">
                            <div className="font-semibold mb-2 text-sm">Vista previa (primeras 10 filas)</div>
                            <div className="border rounded-md overflow-hidden">
                                <div className="max-h-[60vh] overflow-auto">
                                    <table className="w-full text-sm">
                                        <thead className="bg-muted sticky top-0 z-10">
                                            <tr>
                                                {columns.map((c) => (
                                                    <th key={c} className="text-left px-3 py-2 font-medium">{c}</th>
                                                ))}
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {preview.map((row, idx) => (
                                                <tr key={idx} className="border-t">
                                                    {columns.map((c) => (
                                                        <td key={c} className="px-3 py-2 align-top">
                                                            {String(row[c] ?? '')}
                                                        </td>
                                                    ))}
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    )}

                    {errors.length > 0 && (
                        <div className="mt-3">
                            <div className="font-semibold text-sm mb-1">Errores</div>
                            <div className="text-destructive/90 text-sm bg-destructive/5 border border-destructive/30 rounded p-2 space-y-1 max-h-44 overflow-auto">
                                {errors.map((e, i) => (
                                    <div key={i}>• {e}</div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                <DialogFooter className="gap-2 sm:gap-3">
                    <Button type="button" onClick={handleImport} disabled={errors.length > 0 || rows.length === 0}>
                        Importar
                    </Button>
                    <DialogClose asChild>
                        <Button type="button" variant="ghost">Cancelar</Button>
                    </DialogClose>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
