import { useEffect, useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { NumberInput } from '@/components/ui/number-input';
import { Input } from '@/components/ui/input';
import type { Product } from '@/interfaces/product';

interface AdjustPayload {
	productId: string;
	warehouseId: string;
	qty: number;
	reason?: string;
}

interface AdjustStockModalProps {
	open: boolean;
	product: Product | null;
	onClose: () => void;
	onAdjust: (payload: AdjustPayload) => void;
}

export function AdjustStockModal({ open, product, onClose, onAdjust }: AdjustStockModalProps) {
	const [amount, setAmount] = useState(0);
	const [reason, setReason] = useState('');
	const [warehouseId, setWarehouseId] = useState<string>('');

	useEffect(() => {
		// default to first warehouse if available
		const first = product?.stockByWarehouse?.[0]?.warehouseId ?? '';
		setWarehouseId(first);
		setAmount(0);
		setReason('');
	}, [product, open]);
	return (
		<Dialog open={open} onOpenChange={(o: boolean) => { if (!o) onClose(); }}>
			<DialogContent className="sm:max-w-[480px]">
				<DialogHeader>
					<DialogTitle>Ajustar Stock {product ? `— ${product.name}` : ''}</DialogTitle>
				</DialogHeader>
				<div className="space-y-4">
					<div className="space-y-2">
						<Label>Cantidad</Label>
						<NumberInput
							min={-999999}
							max={999999}
							step={1}
							value={amount}
							onValueChange={(v) => setAmount(v ?? 0)}
						/>
					</div>
					<div className="space-y-2">
						<Label>Warehouse</Label>
						{product?.stockByWarehouse && product.stockByWarehouse.length > 0 ? (
							<select
								className="h-9 px-3 py-1 border rounded-md w-full"
								value={warehouseId}
								onChange={(e) => setWarehouseId(e.target.value)}
							>
								{product.stockByWarehouse.map(w => (
									<option key={w.warehouseId} value={w.warehouseId}>{w.warehouseName || w.warehouseId}</option>
								))}
							</select>
						) : (
							<Input value={warehouseId} onChange={(e) => setWarehouseId(e.target.value)} placeholder="Warehouse ID" />
						)}
					</div>
					<div className="space-y-2">
						<Label>Motivo (opcional)</Label>
						<Input value={reason} onChange={(e) => setReason(e.target.value)} placeholder="Adjustment reason (optional)" />
					</div>
					<div className="flex justify-end gap-2">
						<Button type="button" variant="outline" onClick={onClose}>Cancelar</Button>
						<Button type="button" onClick={() => {
							if (product?.id && warehouseId) {
								onAdjust({ productId: product.id, warehouseId, qty: amount, reason });
							}
							onClose();
						}} disabled={!product?.id || !warehouseId}>Aplicar</Button>
					</div>
				</div>
			</DialogContent>
		</Dialog>
	);
}