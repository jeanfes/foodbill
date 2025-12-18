import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { NumberInput } from '@/components/ui/number-input';

interface FiltersState {
	search: string;
	categoryIds: string[];
	status: 'all' | 'active' | 'inactive';
	trackInventory?: boolean;
	stockLowOnly: boolean;
	priceMin?: number;
	priceMax?: number;
	tags: string[];
}

interface AdvancedFiltersPanelProps {
	filters: FiltersState;
	onFiltersChange: (filters: FiltersState) => void;
	onApply: () => void;
	onClear: () => void;
}

export function AdvancedFiltersPanel({ filters, onFiltersChange, onApply, onClear }: AdvancedFiltersPanelProps) {
	const [local, setLocal] = useState<FiltersState>(filters);
	useEffect(() => { setLocal(filters); }, [filters]);

	const update = (patch: Partial<FiltersState>) => {
		const v = { ...local, ...patch } as FiltersState;
		setLocal(v);
		onFiltersChange(v);
	};

	return (
		<div className="space-y-4">
			<div className="grid grid-cols-2 gap-4">
				<div className="space-y-2">
					<Label>Precio mínimo</Label>
					<NumberInput
						value={local.priceMin ?? 0}
						onValueChange={(v) => update({ priceMin: v ?? 0 })}
						min={0}
						step={0.01}
						decimalScale={2}
						fixedDecimalScale
					/>
				</div>
				<div className="space-y-2">
					<Label>Precio máximo</Label>
					<NumberInput
						value={local.priceMax ?? 0}
						onValueChange={(v) => update({ priceMax: v ?? 0 })}
						min={0}
						step={0.01}
						decimalScale={2}
						fixedDecimalScale
					/>
				</div>
				<div className="flex items-center gap-2">
					<Checkbox checked={!!local.trackInventory} onCheckedChange={(v) => update({ trackInventory: !!v })} />
					<Label>Solo con inventario</Label>
				</div>
				<div className="flex items-center gap-2">
					<Checkbox checked={!!local.stockLowOnly} onCheckedChange={(v) => update({ stockLowOnly: !!v })} />
					<Label>Stock bajo</Label>
				</div>
			</div>
			<div className="flex justify-end gap-2">
				<Button variant="outline" onClick={onClear}>Limpiar filtros</Button>
				<Button onClick={onApply}>Aplicar</Button>
			</div>
		</div>
	);
}