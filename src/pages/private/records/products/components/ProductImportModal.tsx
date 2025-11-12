import { useRef, useState } from 'react';
import Papa from 'papaparse';
import type { ParseResult } from 'papaparse';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogClose } from '../../../../../components/ui/dialog';
import { Button } from '../../../../../components/ui/button';
import type { Product } from '../../../../../lib/mockData/products';

interface ProductImportModalProps {
    open: boolean;
    onClose: () => void;
    onImport: (rows: Partial<Product>[]) => void;
}

export function ProductImportModal({ open, onClose, onImport }: ProductImportModalProps) {
    const [preview, setPreview] = useState<any[]>([]);
    const [errors, setErrors] = useState<string[]>([]);
    const fileRef = useRef<HTMLInputElement>(null);

    function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
        const file = e.target.files?.[0];
        if (!file) return;
        Papa.parse(file, {
            header: true,
            skipEmptyLines: true,
            complete: (result: ParseResult<any>) => {
                const rows = result.data as any[];
                setPreview(rows.slice(0, 10));
                const errs: string[] = [];
                rows.forEach((row: any, i: number) => {
                    if (!row.name || row.name.length < 2) errs.push(`Fila ${i + 2}: nombre requerido`);
                    if (!row.price || isNaN(Number(row.price))) errs.push(`Fila ${i + 2}: precio inválido`);
                });
                setErrors(errs);
            }
        });
    }

    function handleImport() {
        if (errors.length) return;
        onImport(preview);
        onClose();
    }

    return (
        <Dialog open={open} onOpenChange={(v: boolean) => { if (!v) onClose(); }}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Importar productos (CSV)</DialogTitle>
                </DialogHeader>
                <input type="file" accept=".csv" ref={fileRef} onChange={handleFile} />
                {preview.length > 0 && (
                    <div className="mt-2">
                        <div className="font-semibold mb-1">Preview (primeras 10 filas):</div>
                        <pre className="bg-muted p-2 rounded text-xs max-h-40 overflow-auto">{JSON.stringify(preview, null, 2)}</pre>
                    </div>
                )}
                {errors.length > 0 && (
                    <div className="text-destructive text-sm mt-2">
                        {errors.map((e, i) => <div key={i}>{e}</div>)}
                    </div>
                )}
                <DialogFooter>
                    <Button type="button" onClick={handleImport} disabled={errors.length > 0 || preview.length === 0}>
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
