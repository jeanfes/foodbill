import type { Category } from '@/interfaces/category';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface CategoryCardProps {
	category: Category;
	onEdit: (category: Category) => void;
	onDelete: (category: Category) => void;
}

export function CategoryCard({ category, onEdit, onDelete }: CategoryCardProps) {
	return (
		<Card className="p-4 space-y-2">
			<div className="flex items-center justify-between">
				<h3 className="font-semibold">{category.name}</h3>
				<span className="text-xs text-muted-foreground">{category.productCount ?? 0} productos</span>
			</div>
			{category.description && (
				<p className="text-sm text-muted-foreground">{category.description}</p>
			)}
			<div className="flex justify-end gap-2">
				<Button size="sm" variant="outline" onClick={() => onEdit(category)}>Editar</Button>
				<Button size="sm" variant="destructive" onClick={() => onDelete(category)}>Eliminar</Button>
			</div>
		</Card>
	);
}