import { useState, useMemo, useCallback } from 'react';
import { Check, ChevronsUpDown, Package } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from '@/components/ui/command';
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from '@/components/ui/popover';
import type { Product } from '@/interfaces/product';
import { useProductsMock } from '@/hooks/useProductsMock';

interface ProductComboboxProps {
    value?: string;
    onSelect: (product: Product | null) => void;
    disabled?: boolean;
    placeholder?: string;
}

export function ProductCombobox({ value, onSelect, disabled, placeholder = "Seleccionar producto..." }: ProductComboboxProps) {
    const [open, setOpen] = useState(false);
    const [search, setSearch] = useState('');
    const { products } = useProductsMock();

    const selectedProduct = useMemo(
        () => products.find((p) => p.id === value),
        [products, value]
    );

    const filteredProducts = useMemo(() => {
        if (!search) return products.slice(0, 50);

        const query = search.toLowerCase();
        return products
            .filter(p =>
                p.name.toLowerCase().includes(query) ||
                p.sku?.toLowerCase().includes(query) ||
                p.categoryName?.toLowerCase().includes(query)
            )
            .slice(0, 50);
    }, [products, search]);

    const handleSelect = useCallback((productId: string) => {
        const product = products.find(p => p.id === productId);
        onSelect(product || null);
        setOpen(false);
        setSearch('');
    }, [products, onSelect]);

    const fmt = (n: number) => new Intl.NumberFormat('es-CO', {
        style: 'currency',
        currency: 'COP',
        maximumFractionDigits: 0
    }).format(n);

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={open}
                    className="w-full justify-between"
                    disabled={disabled}
                >
                    {selectedProduct ? (
                        <div className="flex items-center gap-2 flex-1 min-w-0">
                            <Package className="h-4 w-4 shrink-0 text-primary" />
                            <span className="truncate">{selectedProduct.name}</span>
                            {selectedProduct.sku && (
                                <span className="text-xs text-muted-foreground">({selectedProduct.sku})</span>
                            )}
                        </div>
                    ) : (
                        <span className="text-muted-foreground">{placeholder}</span>
                    )}
                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[400px] p-0" align="start">
                <Command shouldFilter={false}>
                    <CommandInput
                        placeholder="Buscar producto por nombre o SKU..."
                        value={search}
                        onValueChange={setSearch}
                    />
                    <CommandList>
                        <CommandEmpty>No se encontraron productos</CommandEmpty>
                        <CommandGroup>
                            {filteredProducts.map((product) => (
                                <CommandItem
                                    key={product.id}
                                    value={product.id}
                                    onSelect={handleSelect}
                                    className="flex items-start gap-3 py-2"
                                >
                                    <Check
                                        className={cn(
                                            "h-4 w-4 mt-1 shrink-0",
                                            value === product.id ? "opacity-100" : "opacity-0"
                                        )}
                                    />
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-2">
                                            <span className="font-medium truncate">{product.name}</span>
                                            {product.sku && (
                                                <span className="text-xs text-muted-foreground shrink-0">
                                                    {product.sku}
                                                </span>
                                            )}
                                        </div>
                                        <div className="flex items-center gap-3 mt-1 text-xs text-muted-foreground">
                                            <span>{fmt(product.price)}</span>
                                            {product.categoryName && (
                                                <span className="truncate">• {product.categoryName}</span>
                                            )}
                                        </div>
                                    </div>
                                </CommandItem>
                            ))}
                        </CommandGroup>
                    </CommandList>
                </Command>
            </PopoverContent>
        </Popover>
    );
}
