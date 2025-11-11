import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useState } from "react";

interface Props {
    open: boolean;
    onOpenChange: (value: boolean) => void;
}

const ImportCsvDialog = ({ open, onOpenChange }: Props) => {
    const [file, setFile] = useState<File | null>(null);

    const handleImport = () => {
        // TODO: implementar parse & servicio
        onOpenChange(false);
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Importar clientes CSV</DialogTitle>
                </DialogHeader>
                <div className="space-y-4 text-sm">
                    <input
                        type="file"
                        accept=".csv"
                        onChange={(e) => setFile(e.target.files?.[0] || null)}
                    />
                    <div className="text-muted-foreground">Formato esperado: tipoDocumento,documento,nombre,email,telefono</div>
                    <div className="flex justify-end gap-2">
                        <Button variant="outline" onClick={() => onOpenChange(false)}>Cancelar</Button>
                        <Button disabled={!file} onClick={handleImport}>Importar</Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
};

export default ImportCsvDialog;
