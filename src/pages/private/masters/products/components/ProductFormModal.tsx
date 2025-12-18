import { useEffect } from 'react';
import type { Product } from '@/interfaces/product';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { NumberInput } from '@/components/ui/number-input';
import { useForm } from 'react-hook-form';

interface ProductFormModalProps {
	open: boolean;
	initial?: Product;
	onClose: () => void;
	onSave: (data: Partial<Product>) => void;
}

type FormValues = Partial<Product>;

export function ProductFormModal({ open, initial, onClose, onSave }: ProductFormModalProps) {
	const { register, handleSubmit, setValue, watch, reset } = useForm<FormValues>({
		defaultValues: {
			name: '',
			sku: '',
			price: 0,
			cost: 0,
			categoryId: '',
			categoryName: '',
			status: 'active',
			trackInventory: true,
			minStock: 0,
			isComposite: false,
			description: '',
			imageUrl: ''
		}
	});

	useEffect(() => {
		if (initial) {
			const { stockByWarehouse, recipe, ...rest } = initial;
			reset(rest);
		}
	}, [initial, reset]);

	const isComposite = watch('isComposite');
	const trackInventory = watch('trackInventory');

	const submit = handleSubmit((values) => {
		const payload: Partial<Product> = {
			...values,
			price: Number(values.price) || 0,
			cost: Number(values.cost) || 0,
			minStock: Number(values.minStock) || 0,
			trackInventory: !!values.trackInventory,
			isComposite: !!values.isComposite,
		};
		onSave(payload);
		onClose();
	});

	return (
		<Dialog open={open} onOpenChange={(o: boolean) => { if (!o) onClose(); }}>
			<DialogContent className="sm:max-w-[600px]">
				<DialogHeader>
					<DialogTitle>{initial ? 'Editar Producto' : 'Nuevo Producto'}</DialogTitle>
				</DialogHeader>
				<form onSubmit={submit} className="space-y-4">
					<div className="grid grid-cols-2 gap-4">
						<div className="space-y-2">
							<Label>Nombre</Label>
							<Input {...register('name', { required: true })} placeholder="Nombre del producto" />
						</div>
						<div className="space-y-2">
							<Label>SKU</Label>
							<Input {...register('sku')} placeholder="SKU opcional" />
						</div>
						<div className="space-y-2">
							<Label>Precio</Label>
							<NumberInput
								value={Number(watch('price')) || 0}
								onValueChange={(v) => setValue('price', v ?? 0)}
								min={0}
								step={0.01}
								decimalScale={2}
								fixedDecimalScale
							/>
						</div>
						<div className="space-y-2">
							<Label>Costo</Label>
							<NumberInput
								value={Number(watch('cost')) || 0}
								onValueChange={(v) => setValue('cost', v ?? 0)}
								min={0}
								step={0.01}
								decimalScale={2}
								fixedDecimalScale
							/>
						</div>
						<div className="space-y-2">
							<Label>Categoría ID</Label>
							<Input {...register('categoryId')} placeholder="ID de categoría" />
						</div>
						<div className="space-y-2">
							<Label>Categoría</Label>
							<Input {...register('categoryName')} placeholder="Nombre de la categoría" />
						</div>
					</div>

					<div className="grid grid-cols-2 gap-4">
						<div className="flex items-center gap-2">
							<Checkbox checked={!!trackInventory} onCheckedChange={(v) => setValue('trackInventory', !!v)} />
							<Label>Controlar Inventario</Label>
						</div>
						<div className="flex items-center gap-2">
							<Checkbox checked={!!isComposite} onCheckedChange={(v) => setValue('isComposite', !!v)} />
							<Label>Producto Compuesto</Label>
						</div>
					</div>

					{trackInventory && (
						<div className="grid grid-cols-2 gap-4">
							<div className="space-y-2">
								<Label>Stock Mínimo</Label>
								<NumberInput
									value={Number(watch('minStock')) || 0}
									onValueChange={(v) => setValue('minStock', v ?? 0)}
									min={0}
								/>
							</div>
						</div>
					)}

					<div className="space-y-2">
						<Label>Imagen (URL)</Label>
						<Input {...register('imageUrl')} placeholder="https://" />
					</div>

					<div className="space-y-2">
						<Label>Descripción</Label>
						<Input {...register('description')} placeholder="Descripción opcional" />
					</div>

					<div className="flex justify-end gap-2 pt-2">
						<Button type="button" variant="outline" onClick={onClose}>Cancelar</Button>
						<Button type="submit">Guardar</Button>
					</div>
				</form>
			</DialogContent>
		</Dialog>
	);
}