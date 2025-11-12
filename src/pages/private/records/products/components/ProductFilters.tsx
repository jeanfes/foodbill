import { useState } from 'react';
import { Button } from '../../../../../components/ui/button';

interface ProductFiltersProps {
    onSearch: (q: string) => void;
}

export function ProductFilters({ onSearch }: ProductFiltersProps) {
    const [q, setQ] = useState('');
    // Debounce simple
    function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
        setQ(e.target.value);
        clearTimeout((window as any)._debounce);
        (window as any)._debounce = setTimeout(() => onSearch(e.target.value), 300);
    }
    return (
        <div className="flex gap-2 mb-4">
            <input
                className="input input-bordered w-full max-w-xs"
                placeholder="Buscar producto..."
                value={q}
                onChange={handleChange}
                aria-label="Buscar producto"
            />
            <Button type="button" variant="ghost" onClick={() => { setQ(''); onSearch(''); }}>
                Limpiar
            </Button>
        </div>
    );
}
