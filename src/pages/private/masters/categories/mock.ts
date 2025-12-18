import type { Category } from '@/interfaces/category';

export const categoriesMock: Category[] = [
	{
		id: 'cat-1',
		name: 'Bebidas',
		description: 'Refrescos, jugos y cocteles',
		icon: 'cup-soda',
		color: '#0EA5E9',
		productCount: 24,
		createdAt: new Date().toISOString(),
		updatedAt: new Date().toISOString(),
	},
	{
		id: 'cat-2',
		name: 'Platos',
		description: 'Entradas y platos fuertes',
		icon: 'utensils',
		color: '#22C55E',
		productCount: 42,
		createdAt: new Date().toISOString(),
		updatedAt: new Date().toISOString(),
	},
	{
		id: 'cat-3',
		name: 'Postres',
		description: 'Dulces y repostería',
		icon: 'cake',
		color: '#F97316',
		productCount: 12,
		createdAt: new Date().toISOString(),
		updatedAt: new Date().toISOString(),
	}
];