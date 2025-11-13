export interface Category {
    id: string;
    name: string;
    description?: string;
    icon: string; // Nombre del ícono de lucide-react
    color: string;
    productCount: number;
    createdAt: string;
    updatedAt: string;
}

export type CategoryFormValues = Omit<Category, 'id' | 'productCount' | 'createdAt' | 'updatedAt'>;
