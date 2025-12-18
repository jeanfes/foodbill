import { useRef } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';

interface ProductImportModalProps {
	open: boolean;
	onClose: () => void;
	onImport: (rows: Array<Record<string, unknown>>) => void;
}

export function ProductImportModal({ open, onClose, onImport }: ProductImportModalProps) {
	const inputRef = useRef<HTMLInputElement | null>(null);

	const handleFile = async (file: File) => {
		const text = await file.text();
		const rows = text
			.split(/\r?\n/)
			.map((line) => line.split(',').map((c) => c.trim()))
			.filter((cols) => cols.length > 1);
		const headers = rows.shift() || [];
		const data = rows.map((cols) => Object.fromEntries(headers.map((h, i) => [h, cols[i] ?? null])));
		onImport(data);
		onClose();
	};

	return (
		<Dialog open={open} onOpenChange={(o: boolean) => { if (!o) onClose(); }}>
			<DialogContent className="sm:max-w-[520px]">
				<DialogHeader>
					<DialogTitle>Importar Productos (CSV)</DialogTitle>
				</DialogHeader>
				<div className="space-y-4">
					<p className="text-sm text-muted-foreground">Selecciona un archivo CSV con encabezados como: name, sku, price, cost, categoryId, categoryName.</p>
					<Separator />
					<input
						ref={inputRef}
						type="file"
						accept=".csv,text/csv"
						onChange={(e) => {
							const file = e.target.files?.[0];
							if (file) handleFile(file);
						}}
					/>
					<div className="flex justify-end gap-2">
						<Button type="button" variant="outline" onClick={onClose}>Cancelar</Button>
						<Button type="button" onClick={() => inputRef.current?.click()}>Seleccionar archivo</Button>
					</div>
				</div>
			</DialogContent>
		</Dialog>
	);
}