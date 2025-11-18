import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { Customer } from '@/interfaces/billing';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Search, Plus } from 'lucide-react';

interface Props {
    customers: Customer[];
    selectedCustomerId: string;
    onSelect: (customerId: string) => void;
    onCreateNew: () => void;
    disabled?: boolean;
}

export function CustomerTypeahead({ customers, selectedCustomerId, onSelect, onCreateNew, disabled }: Props) {
    const [query, setQuery] = useState('');
    const [showDropdown, setShowDropdown] = useState(false);

    const selected = useMemo(
        () => customers.find(c => c.id === selectedCustomerId),
        [customers, selectedCustomerId]
    );

    const filtered = useMemo(() => {
        const q = query.trim().toLowerCase();
        if (!q) return customers.slice(0, 8);
        return customers.filter(c =>
            c.name.toLowerCase().includes(q) ||
            c.documentNumber.toLowerCase().includes(q) ||
            c.email?.toLowerCase().includes(q)
        ).slice(0, 8);
    }, [customers, query]);

    return (
        <div className="relative">
            <div className="relative">
                <Input
                    value={selected ? selected.name : query}
                    onChange={(e) => {
                        setQuery(e.target.value);
                        setShowDropdown(true);
                    }}
                    onFocus={() => setShowDropdown(true)}
                    onBlur={() => setTimeout(() => setShowDropdown(false), 200)}
                    placeholder="Buscar cliente..."
                    disabled={disabled}
                    className="pr-10"
                />
                <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            </div>

            <AnimatePresence>
                {showDropdown && !disabled && (
                    <motion.div
                        initial={{ opacity: 0, y: -6 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -6 }}
                        transition={{ duration: 0.15 }}
                        className="absolute z-50 w-full mt-1"
                    >
                        <Card className="p-2 shadow-lg max-h-72 overflow-auto">
                            <div className="space-y-1">
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    className="w-full justify-start"
                                    onMouseDown={() => {
                                        onCreateNew();
                                        setShowDropdown(false);
                                    }}
                                >
                                    <Plus className="h-4 w-4 mr-2" /> Nuevo cliente
                                </Button>
                                <Separator />
                                {filtered.map(c => (
                                    <button
                                        key={c.id}
                                        className="w-full text-left px-3 py-2 rounded hover:bg-accent text-sm transition-colors"
                                        onMouseDown={() => {
                                            onSelect(c.id);
                                            setQuery('');
                                            setShowDropdown(false);
                                        }}
                                    >
                                        <div className="font-medium">{c.name}</div>
                                        <div className="text-xs text-muted-foreground">
                                            {c.documentType}-{c.documentNumber}
                                            {c.email && ` • ${c.email}`}
                                        </div>
                                    </button>
                                ))}
                                {filtered.length === 0 && (
                                    <div className="px-3 py-4 text-center text-sm text-muted-foreground">
                                        No se encontraron clientes
                                    </div>
                                )}
                            </div>
                        </Card>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
