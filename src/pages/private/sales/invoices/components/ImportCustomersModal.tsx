import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Upload, FileSpreadsheet, AlertCircle, CheckCircle2, Download, Loader2 } from 'lucide-react';
import { useInvoicesMock } from '@/hooks/useInvoicesMock';

interface Props {
    open: boolean;
    onOpenChange: (v: boolean) => void;
}

interface CsvRow {
    [key: string]: string;
}

interface MappedRow {
    raw: CsvRow;
    mapped: {
        name: string;
        documentType: string;
        documentNumber: string;
        email?: string;
        phone?: string;
        address?: string;
        type: string;
    };
    errors: string[];
    valid: boolean;
}

interface ColumnMapping {
    name: string;
    documentType: string;
    documentNumber: string;
    email: string;
    phone: string;
    address: string;
    type: string;
}

export function ImportCustomersModal({ open, onOpenChange }: Props) {
    const { importCustomers } = useInvoicesMock();
    const [file, setFile] = useState<File | null>(null);
    const [csvData, setCsvData] = useState<CsvRow[]>([]);
    const [csvHeaders, setCsvHeaders] = useState<string[]>([]);
    const [step, setStep] = useState<1 | 2 | 3>(1);
    const [mapping, setMapping] = useState<ColumnMapping>({
        name: '',
        documentType: '',
        documentNumber: '',
        email: '',
        phone: '',
        address: '',
        type: '',
    });
    const [previewData, setPreviewData] = useState<MappedRow[]>([]);
    const [importing, setImporting] = useState(false);
    const [importResult, setImportResult] = useState<{ success: number; errors: number } | null>(null);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFile = e.target.files?.[0];
        if (!selectedFile) return;

        setFile(selectedFile);

        const reader = new FileReader();
        reader.onload = (event) => {
            const text = event.target?.result as string;
            const lines = text.split('\n').filter(line => line.trim());

            if (lines.length === 0) return;

            const headers = lines[0].split(',').map(h => h.trim());
            setCsvHeaders(headers);

            const data = lines.slice(1).map(line => {
                const values = line.split(',').map(v => v.trim());
                const row: CsvRow = {};
                headers.forEach((header, idx) => {
                    row[header] = values[idx] || '';
                });
                return row;
            });

            setCsvData(data);
            setStep(2);
        };

        reader.readAsText(selectedFile);
    };

    const handleMappingComplete = () => {
        if (!mapping.name) {
            alert('Debes mapear al menos el campo "Nombre"');
            return;
        }

        const preview: MappedRow[] = csvData.slice(0, 10).map(row => {
            const errors: string[] = [];
            const name = row[mapping.name] || '';
            const documentNumber = mapping.documentNumber ? row[mapping.documentNumber] : '';
            const email = mapping.email ? row[mapping.email] : undefined;
            const phone = mapping.phone ? row[mapping.phone] : undefined;

            if (!name.trim()) {
                errors.push('Nombre vacío');
            }

            return {
                raw: row,
                mapped: {
                    name,
                    documentType: mapping.documentType ? row[mapping.documentType] : 'CC',
                    documentNumber,
                    email,
                    phone,
                    address: mapping.address ? row[mapping.address] : undefined,
                    type: mapping.type ? row[mapping.type] : 'individual',
                },
                errors,
                valid: errors.length === 0,
            };
        });

        setPreviewData(preview);
        setStep(3);
    };

    const handleImport = () => {
        setImporting(true);

        const rows = csvData.map(row => ({
            name: row[mapping.name] || '',
            documentType: (mapping.documentType ? row[mapping.documentType] : 'CC') as 'CC' | 'NIT' | 'CE' | 'PAS',
            documentNumber: mapping.documentNumber ? row[mapping.documentNumber] : '',
            email: mapping.email ? row[mapping.email] : undefined,
            phone: mapping.phone ? row[mapping.phone] : undefined,
            address: mapping.address ? row[mapping.address] : undefined,
            type: (mapping.type ? row[mapping.type] : 'individual') as 'individual' | 'company',
        }));

        const result = importCustomers(rows);
        setImportResult({ success: result.success, errors: result.errors.length });
        setImporting(false);
    };

    const handleClose = () => {
        setFile(null);
        setCsvData([]);
        setCsvHeaders([]);
        setStep(1);
        setMapping({
            name: '',
            documentType: '',
            documentNumber: '',
            email: '',
            phone: '',
            address: '',
            type: '',
        });
        setPreviewData([]);
        setImportResult(null);
        onOpenChange(false);
    };

    const downloadTemplate = () => {
        const template = 'nombre,documentType,documentNumber,email,phone,address,type\nJuan Pérez,CC,123456,juan@example.com,3001234567,Calle 123,individual\nEmpresa XYZ,NIT,900123456,contacto@xyz.com,6012345678,Av 456,company';
        const blob = new Blob([template], { type: 'text/csv' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'plantilla_clientes.csv';
        a.click();
        URL.revokeObjectURL(url);
    };

    return (
        <Dialog open={open} onOpenChange={handleClose}>
            <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>Importar clientes desde CSV</DialogTitle>
                    <DialogDescription>
                        Sigue los pasos para importar múltiples clientes desde un archivo CSV
                    </DialogDescription>
                </DialogHeader>

                {importResult ? (
                    <div className="py-8 text-center space-y-4">
                        <div className="text-2xl font-bold">
                            {importResult.success > 0 && (
                                <div className="text-green-600 dark:text-green-400">
                                    ✓ {importResult.success} clientes importados
                                </div>
                            )}
                            {importResult.errors > 0 && (
                                <div className="text-red-600 dark:text-red-400 mt-2">
                                    ✗ {importResult.errors} filas con error
                                </div>
                            )}
                        </div>
                        <Button onClick={handleClose}>Cerrar</Button>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {step === 1 && (
                            <>
                                <div className="border-2 border-dashed rounded-lg p-8 text-center space-y-4">
                                    <FileSpreadsheet className="h-12 w-12 mx-auto text-muted-foreground" />
                                    <div>
                                        <h3 className="font-semibold mb-2">Selecciona un archivo CSV</h3>
                                        <p className="text-sm text-muted-foreground mb-4">
                                            El archivo debe contener las columnas necesarias para importar clientes
                                        </p>
                                        <input
                                            type="file"
                                            accept=".csv"
                                            onChange={handleFileChange}
                                            className="hidden"
                                            id="csv-upload"
                                        />
                                        <Label htmlFor="csv-upload">
                                            <Button asChild variant="secondary">
                                                <span>
                                                    <Upload className="h-4 w-4 mr-2" />
                                                    Seleccionar archivo
                                                </span>
                                            </Button>
                                        </Label>
                                    </div>
                                    {file && (
                                        <div className="text-sm text-muted-foreground">
                                            Archivo seleccionado: <span className="font-medium">{file.name}</span>
                                        </div>
                                    )}
                                </div>

                                <div className="bg-muted rounded-lg p-4 space-y-2">
                                    <h4 className="font-semibold text-sm">Formato esperado</h4>
                                    <p className="text-xs text-muted-foreground">
                                        El CSV debe contener al menos: <span className="font-semibold">nombre</span>
                                    </p>
                                    <Button variant="link" size="sm" className="h-auto p-0" onClick={downloadTemplate}>
                                        <Download className="h-3 w-3 mr-1" />
                                        Descargar plantilla de ejemplo
                                    </Button>
                                </div>
                            </>
                        )}

                        {step === 2 && (
                            <>
                                <div className="space-y-3">
                                    <h3 className="font-semibold">Mapeo de columnas</h3>
                                    <p className="text-sm text-muted-foreground">
                                        Asigna las columnas de tu CSV a los campos del sistema
                                    </p>

                                    <div className="grid grid-cols-2 gap-3">
                                        <div className="space-y-2">
                                            <Label>Nombre *</Label>
                                            <Select value={mapping.name} onValueChange={v => setMapping(m => ({ ...m, name: v }))}>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Seleccionar columna" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {csvHeaders.map(h => <SelectItem key={h} value={h}>{h}</SelectItem>)}
                                                </SelectContent>
                                            </Select>
                                        </div>

                                        <div className="space-y-2">
                                            <Label>Tipo documento</Label>
                                            <Select value={mapping.documentType} onValueChange={v => setMapping(m => ({ ...m, documentType: v }))}>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="(Opcional)" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {csvHeaders.map(h => <SelectItem key={h} value={h}>{h}</SelectItem>)}
                                                </SelectContent>
                                            </Select>
                                        </div>

                                        <div className="space-y-2">
                                            <Label>Número documento</Label>
                                            <Select value={mapping.documentNumber} onValueChange={v => setMapping(m => ({ ...m, documentNumber: v }))}>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="(Opcional)" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {csvHeaders.map(h => <SelectItem key={h} value={h}>{h}</SelectItem>)}
                                                </SelectContent>
                                            </Select>
                                        </div>

                                        <div className="space-y-2">
                                            <Label>Teléfono</Label>
                                            <Select value={mapping.phone} onValueChange={v => setMapping(m => ({ ...m, phone: v }))}>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="(Opcional)" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {csvHeaders.map(h => <SelectItem key={h} value={h}>{h}</SelectItem>)}
                                                </SelectContent>
                                            </Select>
                                        </div>

                                        <div className="space-y-2">
                                            <Label>Email</Label>
                                            <Select value={mapping.email} onValueChange={v => setMapping(m => ({ ...m, email: v }))}>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="(Opcional)" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {csvHeaders.map(h => <SelectItem key={h} value={h}>{h}</SelectItem>)}
                                                </SelectContent>
                                            </Select>
                                        </div>

                                        <div className="space-y-2">
                                            <Label>Dirección</Label>
                                            <Select value={mapping.address} onValueChange={v => setMapping(m => ({ ...m, address: v }))}>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="(Opcional)" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {csvHeaders.map(h => <SelectItem key={h} value={h}>{h}</SelectItem>)}
                                                </SelectContent>
                                            </Select>
                                        </div>

                                        <div className="space-y-2">
                                            <Label>Tipo cliente</Label>
                                            <Select value={mapping.type} onValueChange={v => setMapping(m => ({ ...m, type: v }))}>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="(Opcional)" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {csvHeaders.map(h => <SelectItem key={h} value={h}>{h}</SelectItem>)}
                                                </SelectContent>
                                            </Select>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex gap-2 justify-end pt-4">
                                    <Button variant="outline" onClick={() => setStep(1)}>Atrás</Button>
                                    <Button onClick={handleMappingComplete}>Continuar a preview</Button>
                                </div>
                            </>
                        )}

                        {step === 3 && (
                            <>
                                <div className="space-y-3">
                                    <div className="flex items-center justify-between">
                                        <h3 className="font-semibold">Preview (primeras 10 filas)</h3>
                                        <div className="flex gap-2 text-sm">
                                            <Badge variant="default" className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                                                {previewData.filter(r => r.valid).length} válidas
                                            </Badge>
                                            <Badge variant="destructive">
                                                {previewData.filter(r => !r.valid).length} con errores
                                            </Badge>
                                        </div>
                                    </div>

                                    <div className="border rounded-lg overflow-hidden">
                                        <Table>
                                            <TableHeader>
                                                <TableRow>
                                                    <TableHead className="w-12"></TableHead>
                                                    <TableHead>Nombre</TableHead>
                                                    <TableHead>Documento</TableHead>
                                                    <TableHead>Contacto</TableHead>
                                                    <TableHead>Tipo</TableHead>
                                                    <TableHead>Estado</TableHead>
                                                </TableRow>
                                            </TableHeader>
                                            <TableBody>
                                                {previewData.map((row, idx) => (
                                                    <TableRow key={idx}>
                                                        <TableCell>
                                                            {row.valid ? (
                                                                <CheckCircle2 className="h-4 w-4 text-green-600" />
                                                            ) : (
                                                                <AlertCircle className="h-4 w-4 text-red-600" />
                                                            )}
                                                        </TableCell>
                                                        <TableCell>{row.mapped.name}</TableCell>
                                                        <TableCell className="text-sm text-muted-foreground">
                                                            {row.mapped.documentType} {row.mapped.documentNumber || '-'}
                                                        </TableCell>
                                                        <TableCell className="text-sm">
                                                            {row.mapped.phone || row.mapped.email || '-'}
                                                        </TableCell>
                                                        <TableCell>
                                                            <Badge variant="secondary">{row.mapped.type}</Badge>
                                                        </TableCell>
                                                        <TableCell>
                                                            {row.valid ? (
                                                                <span className="text-xs text-green-600">OK</span>
                                                            ) : (
                                                                <span className="text-xs text-red-600">{row.errors.join(', ')}</span>
                                                            )}
                                                        </TableCell>
                                                    </TableRow>
                                                ))}
                                            </TableBody>
                                        </Table>
                                    </div>

                                    <p className="text-sm text-muted-foreground">
                                        Se importarán {csvData.length} filas en total. Las filas con errores serán omitidas.
                                    </p>
                                </div>

                                <div className="flex gap-2 justify-end pt-4">
                                    <Button variant="outline" onClick={() => setStep(2)}>Atrás</Button>
                                    <Button onClick={handleImport} disabled={importing}>
                                        {importing && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                                        Importar {csvData.length} clientes
                                    </Button>
                                </div>
                            </>
                        )}
                    </div>
                )}
            </DialogContent>
        </Dialog>
    );
}
