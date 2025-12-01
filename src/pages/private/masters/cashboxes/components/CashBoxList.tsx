import { useState, useMemo, useEffect } from 'react';
import { Search, Plus, ChevronLeft, ChevronRight } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { CashBoxCard } from './CashBoxCard';
import type { CashBox } from '@/interfaces/cashbox';

const ITEMS_PER_PAGE = 10;

interface CashBoxListProps {
    cashBoxes: CashBox[];
    selectedId?: string;
    onSelect: (id: string) => void;
    onCreateNew: () => void;
    canCreate: boolean;
}

type FilterType = 'all' | 'open' | 'closed';

export function CashBoxList({
    cashBoxes,
    selectedId,
    onSelect,
    onCreateNew,
    canCreate
}: CashBoxListProps) {
    const [search, setSearch] = useState('');
    const [filter, setFilter] = useState<FilterType>('all');
    const [currentPage, setCurrentPage] = useState(1);

    const filteredBoxes = useMemo(() => {
        return cashBoxes.filter(box => {
            if (search) {
                const searchLower = search.toLowerCase();
                const matchesSearch =
                    box.name.toLowerCase().includes(searchLower) ||
                    box.code.toLowerCase().includes(searchLower) ||
                    box.location?.toLowerCase().includes(searchLower);
                if (!matchesSearch) return false;
            }

            if (filter === 'open' && box.status !== 'OPEN') return false;
            if (filter === 'closed' && box.status !== 'CLOSED') return false;

            return true;
        });
    }, [cashBoxes, search, filter]);

    const totalPages = Math.ceil(filteredBoxes.length / ITEMS_PER_PAGE);
    const paginatedBoxes = useMemo(() => {
        const start = (currentPage - 1) * ITEMS_PER_PAGE;
        return filteredBoxes.slice(start, start + ITEMS_PER_PAGE);
    }, [filteredBoxes, currentPage]);

    useEffect(() => {
        setCurrentPage(1);
    }, [search, filter]);

    return (
        <div className="flex flex-col h-full">
            <div className="mb-4">
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder="Buscar caja..."
                        className="pl-9 h-10"
                    />
                </div>
            </div>

            <div className="flex gap-2 mb-4">
                <Button
                    variant={filter === 'all' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setFilter('all')}
                    className="flex-1"
                >
                    Todas
                </Button>
                <Button
                    variant={filter === 'open' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setFilter('open')}
                    className="flex-1"
                >
                    Abiertas
                </Button>
                <Button
                    variant={filter === 'closed' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setFilter('closed')}
                    className="flex-1"
                >
                    Cerradas
                </Button>
            </div>

            {canCreate && (
                <Button
                    onClick={onCreateNew}
                    className="w-full mb-4 h-10"
                    variant="outline"
                >
                    <Plus className="h-4 w-4 mr-2" />
                    Nueva caja
                </Button>
            )}

            <div className="flex-1 overflow-y-auto space-y-3 pr-1" style={{
                overflow: "visible"
            }}>
                {filteredBoxes.length === 0 ? (
                    <div className="text-center py-8 text-sm text-muted-foreground">
                        {search || filter !== 'all'
                            ? 'No hay cajas que coincidan con el filtro'
                            : 'No hay cajas registradas. Crea una caja para empezar a registrar ventas y movimientos.'
                        }
                    </div>
                ) : (
                    paginatedBoxes.map(box => (
                        <CashBoxCard
                            key={box.id}
                            cashBox={box}
                            onClick={() => onSelect(box.id)}
                            isSelected={selectedId === box.id}
                        />
                    ))
                )}
            </div>

            {totalPages > 1 && (
                <div className="flex items-center justify-between pt-4 border-t mt-4">
                    <p className="text-xs text-muted-foreground">
                        {filteredBoxes.length} caja{filteredBoxes.length !== 1 ? 's' : ''}
                    </p>
                    <div className="flex items-center gap-2">
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                            disabled={currentPage === 1}
                        >
                            <ChevronLeft className="h-4 w-4" />
                        </Button>
                        <span className="text-xs text-muted-foreground">
                            {currentPage} / {totalPages}
                        </span>
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                            disabled={currentPage === totalPages}
                        >
                            <ChevronRight className="h-4 w-4" />
                        </Button>
                    </div>
                </div>
            )}
        </div>
    );
}
