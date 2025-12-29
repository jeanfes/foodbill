import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useForm } from 'react-hook-form';
import { useEffect } from 'react';
import type { Category, CategoryFormValues } from '@/interfaces/category';

interface CategoryFormDialogProps {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	onSubmit: (values: CategoryFormValues) => void;
	initial?: Category | null;
}

export function CategoryFormDialog({ open, onOpenChange, onSubmit, initial }: CategoryFormDialogProps) {
	const { register, handleSubmit, reset } = useForm<CategoryFormValues>({
		defaultValues: {
			name: '',
			description: ''
		}
	});

	// hydrate form when initial changes
	useEffect(() => {
		if (initial) {
			reset({ name: initial.name, description: initial.description ?? '' });
		} else {
			reset({ name: '', description: '' });
		}
	}, [initial, reset]);

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent className="sm:max-w-[520px]">
				<DialogHeader>
					<DialogTitle>{initial ? 'Editar categoría' : 'Nueva categoría'}</DialogTitle>
				</DialogHeader>
				<form
					className="space-y-4"
					onSubmit={handleSubmit((v) => onSubmit(v))}
				>
					<div className="space-y-2">
						<Label>Nombre</Label>
						<Input {...register('name', { required: true })} placeholder="Nombre de la categoría" />
					</div>
					<div className="space-y-2">
						<Label>Descripción</Label>
						<Input {...register('description')} placeholder="Descripción opcional" />
					</div>
					<div className="flex justify-end gap-2">
						<Button type="button" variant="outline" onClick={() => onOpenChange(false)}>Cancelar</Button>
						<Button type="submit">Guardar</Button>
					</div>
				</form>
			</DialogContent>
		</Dialog>
	);
}