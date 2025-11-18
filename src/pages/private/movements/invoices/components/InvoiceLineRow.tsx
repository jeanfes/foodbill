import { motion } from 'framer-motion';
import type { InvoiceLine } from '@/interfaces/billing';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { NumberInput } from '@/components/ui/number-input';
import { TableCell } from '@/components/ui/table';
import { Trash2 } from 'lucide-react';

interface Props {
    line: InvoiceLine;
    onUpdate: (id: string, patch: Partial<InvoiceLine>) => void;
    onRemove: (id: string) => void;
}

export function InvoiceLineRow({ line, onUpdate, onRemove }: Props) {
    const fmt = (n: number) => new Intl.NumberFormat('es-CO', {
        style: 'currency',
        currency: 'COP',
        maximumFractionDigits: 2
    }).format(n);

    return (
        <motion.tr
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.2 }}
        >
            <TableCell className="align-top">
                <Input
                    value={line.description}
                    onChange={(e) => onUpdate(line.id, { description: e.target.value })}
                    placeholder="Descripción del producto"
                    className="mb-3"
                />
                <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1">
                        <label className="text-xs font-medium text-muted-foreground">Descuento %</label>
                        <NumberInput
                            value={line.discountPercent ?? 0}
                            min={0}
                            max={100}
                            step={0.5}
                            decimalScale={2}
                            onChange={(v) => onUpdate(line.id, {
                                discountPercent: Number(v || 0),
                                discountAmount: undefined
                            })}
                            className="h-9"
                        />
                    </div>
                    <div className="space-y-1">
                        <label className="text-xs font-medium text-muted-foreground">Descuento $</label>
                        <NumberInput
                            value={line.discountAmount ?? 0}
                            min={0}
                            step={100}
                            onChange={(v) => onUpdate(line.id, {
                                discountAmount: Number(v || 0),
                                discountPercent: undefined
                            })}
                            className="h-9"
                        />
                    </div>
                </div>
            </TableCell>
            <TableCell className="align-top">
                <NumberInput
                    value={line.qty}
                    min={0.0001}
                    step={1}
                    onChange={(v) => onUpdate(line.id, { qty: Number(v || 1) })}
                />
            </TableCell>
            <TableCell className="align-top">
                <NumberInput
                    value={line.unitPrice}
                    min={0}
                    step={100}
                    onChange={(v) => onUpdate(line.id, { unitPrice: Number(v || 0) })}
                />
            </TableCell>
            <TableCell className="align-top">
                <NumberInput
                    value={line.taxRate}
                    min={0}
                    max={30}
                    step={1}
                    onChange={(v) => onUpdate(line.id, { taxRate: Number(v || 0) })}
                />
            </TableCell>
            <TableCell className="align-top font-medium">
                {fmt(line.lineTotal)}
            </TableCell>
            <TableCell className="align-top">
                <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => onRemove(line.id)}
                    className="h-9 w-9"
                >
                    <Trash2 className="h-4 w-4" />
                </Button>
            </TableCell>
        </motion.tr>
    );
}
