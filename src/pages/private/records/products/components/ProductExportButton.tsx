import { Button } from '@/components/ui/button';
import type { Product } from '@/interfaces/product';

interface ProductExportButtonProps {
    products: Product[];
    onExport: (products: Product[]) => void;
}

export function ProductExportButton({ products, onExport }: ProductExportButtonProps) {
    return (
        <Button onClick={() => onExport(products)} variant="outline">
            Exportar CSV
        </Button>
    );
}
