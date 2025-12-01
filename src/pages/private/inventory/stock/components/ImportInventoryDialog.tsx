import { useRef, useState } from 'react';
import Papa from 'papaparse';
import type { ParseResult } from 'papaparse';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { useInventoryMock } from '@/hooks/useInventoryMock';
import { useToast } from '@/components/ui/toast';

interface ImportInventoryDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ImportInventoryDialog({ open, onOpenChange }: ImportInventoryDialogProps) {
  const { addMovement, getInventoryItems } = useInventoryMock();
  const toast = useToast();
  const [rows, setRows] = useState<any[]>([]);
  const [preview, setPreview] = useState<any[]>([]);
  const [errors, setErrors] = useState<string[]>([]);
  const [fileName, setFileName] = useState('');
  const fileRef = useRef<HTMLInputElement>(null);

  const products = getInventoryItems();

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
          const rowNum = i + 2;
          if (!row.productId) errs.push(`Fila ${rowNum}: productId requerido`);
          if (!row.type) errs.push(`Fila ${rowNum}: type requerido (in/out/adjust/transfer/consumption)`);
          if (!row.qty || isNaN(Number(row.qty))) errs.push(`Fila ${rowNum}: qty inválida`);
          if ((row.type === 'in' || row.type === 'adjust') && !row.toWarehouseId) {
            errs.push(`Fila ${rowNum}: toWarehouseId requerido para tipo ${row.type}`);
          }
          if ((row.type === 'out' || row.type === 'consumption') && !row.fromWarehouseId) {
            errs.push(`Fila ${rowNum}: fromWarehouseId requerido para tipo ${row.type}`);
          }
          if (row.type === 'transfer' && (!row.fromWarehouseId || !row.toWarehouseId)) {
            errs.push(`Fila ${rowNum}: fromWarehouseId y toWarehouseId requeridos para transfer`);
          }
        });
        
        setErrors(errs);
      }
    });
  }

  function clearFile() {
    if (fileRef.current) fileRef.current.value = '';
    setFileName('');
    setRows([]);
    setPreview([]);
    setErrors([]);
  }

  function handleImport() {
    if (errors.length || rows.length === 0) {
      toast.show('Corrija los errores antes de importar', 'error');
      return;
    }

    let imported = 0;
    rows.forEach((row: any) => {
      const product = products.find(p => p.productId === row.productId);
      const success = addMovement({
        type: row.type,
        productId: row.productId,
        productName: product?.name || row.productName,
        fromWarehouseId: row.fromWarehouseId || undefined,
        toWarehouseId: row.toWarehouseId || undefined,
        qty: Number(row.qty),
        unit: row.unit || 'und',
        reason: row.reason || undefined,
        userId: 'u-1',
        userName: 'Usuario'
      });
      if (success) imported++;
    });

    toast.show(`${imported} de ${rows.length} movimientos importados`, 'success');
    onOpenChange(false);
    clearFile();
  }

  const columns = preview.length > 0 ? Object.keys(preview[0]) : [];

  return (
    <Dialog open={open} onOpenChange={(v) => { if (!v) onOpenChange(false); }}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>Importar movimientos de inventario (CSV)</DialogTitle>
          <p className="text-sm text-muted-foreground">
            Formato: productId, type, qty, fromWarehouseId?, toWarehouseId?, reason?, unit?
          </p>
        </DialogHeader>

        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <input
              ref={fileRef}
              type="file"
              accept=".csv"
              onChange={handleFile}
              className="hidden"
            />
            <Button variant="secondary" onClick={() => fileRef.current?.click()}>
              {fileName ? 'Cambiar archivo' : 'Seleccionar CSV'}
            </Button>
            {fileName && (
              <Button variant="ghost" onClick={clearFile}>Limpiar</Button>
            )}
          </div>
          
          {fileName && (
            <p className="text-xs text-muted-foreground">Archivo: {fileName}</p>
          )}

          {errors.length > 0 && (
            <div className="border border-red-200 bg-red-50 p-3 rounded text-sm max-h-32 overflow-auto">
              <p className="font-semibold text-red-800 mb-1">Errores ({errors.length}):</p>
              <ul className="list-disc list-inside text-red-700 space-y-0.5">
                {errors.slice(0, 20).map((err, idx) => <li key={idx}>{err}</li>)}
              </ul>
            </div>
          )}

          {preview.length > 0 && (
            <div>
              <p className="font-semibold mb-2 text-sm">
                Vista previa (primeras 10 filas de {rows.length})
              </p>
              <div className="border rounded overflow-auto max-h-64">
                <table className="w-full text-xs">
                  <thead className="bg-muted sticky top-0">
                    <tr>
                      {columns.map(col => (
                        <th key={col} className="px-2 py-1 text-left font-medium">{col}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {preview.map((row, i) => (
                      <tr key={i} className="border-t">
                        {columns.map(col => (
                          <td key={col} className="px-2 py-1">{String(row[col] || '')}</td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          <div className="flex justify-end gap-2 pt-2">
            <Button variant="ghost" onClick={() => onOpenChange(false)}>
              Cancelar
            </Button>
            <Button
              onClick={handleImport}
              disabled={rows.length === 0 || errors.length > 0}
            >
              Importar {rows.length} movimientos
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
