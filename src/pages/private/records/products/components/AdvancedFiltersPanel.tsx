import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { X, Filter, ChevronDown, ChevronUp } from 'lucide-react';
import { Checkbox } from '@/components/ui/checkbox';
import { Card } from '@/components/ui/card';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';

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
    expanded?: boolean;
    onExpandedChange?: (open: boolean) => void;
}

const MOCK_CATEGORIES = [
    { id: 'c-1', name: 'Platos' },
    { id: 'c-2', name: 'Bebidas' },
    { id: 'c-3', name: 'Servicios' },
    { id: 'c-4', name: 'Postres' },
    { id: 'c-5', name: 'Snacks' },
];

const MOCK_TAGS = ['popular', 'vegano', 'sin_gluten', 'nuevo', 'promo'];

export function AdvancedFiltersPanel({ filters, onFiltersChange, onApply, onClear, expanded, onExpandedChange }: AdvancedFiltersPanelProps) {
    const [internalOpen, setInternalOpen] = useState(false);
    const open = expanded !== undefined ? expanded : internalOpen;
    const setOpen = (v: boolean) => {
        onExpandedChange?.(v);
        if (expanded === undefined) setInternalOpen(v);
    };

    const activeFiltersCount = [
        filters.categoryIds.length > 0,
        filters.status !== 'all',
        filters.trackInventory !== undefined,
        filters.stockLowOnly,
        filters.priceMin !== undefined,
        filters.priceMax !== undefined,
        filters.tags.length > 0,
    ].filter(Boolean).length;

    return (
        <Card className="p-0 border-b-0">
            <Collapsible open={open} onOpenChange={setOpen}>
                <CollapsibleTrigger asChild>
                    <Button variant="ghost" className="w-full justify-between p-4 hover:bg-accent">
                        <div className="flex items-center gap-2">
                            <Filter className="h-4 w-4" />
                            <span className="font-medium">Filtros avanzados</span>
                            {activeFiltersCount > 0 && (
                                <span className="ml-2 bg-primary text-primary-foreground text-xs px-2 py-0.5 rounded-full">
                                    {activeFiltersCount}
                                </span>
                            )}
                        </div>
                        {open ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                    </Button>
                </CollapsibleTrigger>

                <CollapsibleContent className="px-4 pb-4">
                    <div className="space-y-4 pt-4 border-t">
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                            <div className="space-y-2">
                                <Label>Categoría</Label>
                                <Select
                                    value={filters.categoryIds[0] || 'all'}
                                    onValueChange={(v) => {
                                        onFiltersChange({
                                            ...filters,
                                            categoryIds: v === 'all' ? [] : [v]
                                        });
                                    }}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Todas" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">Todas</SelectItem>
                                        {MOCK_CATEGORIES.map((cat) => (
                                            <SelectItem key={cat.id} value={cat.id}>
                                                {cat.name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="space-y-2">
                                <Label>Estado</Label>
                                <Select
                                    value={filters.status}
                                    onValueChange={(v: 'all' | 'active' | 'inactive') => {
                                        onFiltersChange({ ...filters, status: v });
                                    }}
                                >
                                    <SelectTrigger>
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">Todos</SelectItem>
                                        <SelectItem value="active">Activos</SelectItem>
                                        <SelectItem value="inactive">Inactivos</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="space-y-2">
                                <Label>Precio mínimo</Label>
                                <Input
                                    type="number"
                                    placeholder="Min"
                                    value={filters.priceMin || ''}
                                    onChange={(e) => {
                                        onFiltersChange({
                                            ...filters,
                                            priceMin: e.target.value ? Number(e.target.value) : undefined
                                        });
                                    }}
                                />
                            </div>

                            <div className="space-y-2">
                                <Label>Precio máximo</Label>
                                <Input
                                    type="number"
                                    placeholder="Max"
                                    value={filters.priceMax || ''}
                                    onChange={(e) => {
                                        onFiltersChange({
                                            ...filters,
                                            priceMax: e.target.value ? Number(e.target.value) : undefined
                                        });
                                    }}
                                />
                            </div>
                        </div>

                        <div className="flex items-center gap-2">
                            <Checkbox
                                id="stockLow"
                                checked={filters.stockLowOnly}
                                onCheckedChange={(v) => onFiltersChange({ ...filters, stockLowOnly: !!v })}
                            />
                            <Label htmlFor="stockLow" className="cursor-pointer">Solo stock bajo</Label>
                        </div>

                        <div>
                            <Label>Tags</Label>
                            <div className="flex flex-wrap gap-2 mt-2">
                                {MOCK_TAGS.map((tag) => {
                                    const isSelected = filters.tags.includes(tag);
                                    return (
                                        <Badge
                                            key={tag}
                                            variant={isSelected ? 'default' : 'outline'}
                                            className="cursor-pointer"
                                            onClick={() => {
                                                const newTags = isSelected
                                                    ? filters.tags.filter(t => t !== tag)
                                                    : [...filters.tags, tag];
                                                onFiltersChange({ ...filters, tags: newTags });
                                            }}
                                        >
                                            {tag}
                                            {isSelected && <X className="w-3 h-3 ml-1" />}
                                        </Badge>
                                    );
                                })}
                            </div>
                        </div>

                        <Separator />

                        <div className="flex gap-2 pt-2">
                            <Button onClick={onApply}>
                                <Filter className="h-4 w-4 mr-2" />
                                Aplicar filtros
                            </Button>
                            <Button onClick={onClear} variant="outline">
                                <X className="h-4 w-4 mr-2" />
                                Limpiar
                            </Button>
                        </div>
                    </div>
                </CollapsibleContent>
            </Collapsible>
        </Card>
    );
}
