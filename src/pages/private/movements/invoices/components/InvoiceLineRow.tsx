import { useState, useCallback, useRef, useEffect } from 'react';
import { Reorder, useDragControls } from 'framer-motion';
import type { InvoiceLine } from '@/interfaces/billing';
import type { Product } from '@/interfaces/product';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { NumberInput } from '@/components/ui/number-input';
import { Badge } from '@/components/ui/badge';
import {
    Trash2,
    GripVertical,
    Copy,
    AlertCircle,
    Package,
    Percent,
    DollarSign
} from 'lucide-react';
import { ProductCombobox } from './ProductCombobox';
import { cn } from '@/lib/utils';
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from '@/components/ui/tooltip';

interface Props {
    line: InvoiceLine;
    index: number;
    onUpdate: (id: string, patch: Partial<InvoiceLine>) => void;
    onRemove: (id: string) => void;
    onDuplicate: (id: string) => void;
    disabled?: boolean;
    selected?: boolean;
    onSelect?: (id: string, multiSelect: boolean) => void;
    dragHandleProps?: any;
    products?: Product[];
}

export function InvoiceLineRow({
    line,
    onUpdate,
    onRemove,
    onDuplicate,
    disabled = false,
    selected = false,
    onSelect,
}: Props) {
    const dragControls = useDragControls();
    const [discountMode, setDiscountMode] = useState<'percent' | 'amount'>(
        line.discountPercent !== undefined ? 'percent' : 'amount'
    );
    const [hasChanges, setHasChanges] = useState(false);
    const rowRef = useRef<HTMLLIElement>(null);

    const fmt = (n: number) =>
        new Intl.NumberFormat('es-CO', {
            style: 'currency',
            currency: 'COP',
            maximumFractionDigits: 2,
        }).format(n);

    const discountAmount = line.discountAmount ||
        (line.discountPercent ? (line.lineBase * line.discountPercent / 100) : 0);

    const errors: string[] = [];
    if (!line.description?.trim()) errors.push('Descripción requerida');
    if (line.qty <= 0) errors.push('Cantidad debe ser > 0');
    if (line.unitPrice < 0) errors.push('Precio no puede ser negativo');

    const discountValue = line.discountPercent || line.discountAmount || 0;
    const maxDiscount = line.lineBase;
    if (discountMode === 'amount' && discountValue > maxDiscount) {
        errors.push('Descuento excede el subtotal');
    }

    const hasErrors = errors.length > 0;

    const handleProductSelect = useCallback(
        (product: Product | null) => {
            if (!product) {
                onUpdate(line.id, { productId: undefined });
                return;
            }
            onUpdate(line.id, {
                productId: product.id,
                description: product.name,
                unitPrice: product.price,
                unit: 'u',
                taxRate: product.name.toLowerCase().includes('bebida') ? 19 :
                    product.name.toLowerCase().includes('servicio') ? 19 :
                        product.name.toLowerCase().includes('postre') ? 5 : 5,
            });
            setHasChanges(true);
        },
        [line.id, onUpdate]
    );

    const handleFieldChange = useCallback(
        (field: keyof InvoiceLine, value: any) => {
            onUpdate(line.id, { [field]: value });
            setHasChanges(true);
        },
        [line.id, onUpdate]
    );

    const toggleDiscountMode = useCallback(() => {
        setDiscountMode((prev) => {
            const newMode = prev === 'percent' ? 'amount' : 'percent';
            if (newMode === 'percent') {
                handleFieldChange('discountPercent', 0);
                handleFieldChange('discountAmount', undefined);
            } else {
                handleFieldChange('discountAmount', 0);
                handleFieldChange('discountPercent', undefined);
            }
            return newMode;
        });
    }, [handleFieldChange]);

    const handleRowClick = useCallback(
        (e: React.MouseEvent) => {
            if (onSelect && (e.ctrlKey || e.metaKey)) {
                e.preventDefault();
                onSelect(line.id, true);
            }
        },
        [line.id, onSelect]
    );

    useEffect(() => {
        if (hasChanges) {
            const timer = setTimeout(() => setHasChanges(false), 2000);
            return () => clearTimeout(timer);
        }
    }, [hasChanges]);

    const showTooltip = line.discountPercent || line.discountAmount || line.taxRate > 0;

    return (
        <Reorder.Item
            ref={rowRef}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, x: -20, height: 0 }}
            transition={{ duration: 0.2 }}
            value={line}
            dragListener={false}
            dragControls={dragControls}
            className={cn(
                "group relative border rounded-lg p-4 bg-background hover:bg-accent/5 transition-colors",
                selected && "ring-2 ring-primary bg-accent/10",
                hasErrors && "border-destructive/50 bg-destructive/5",
                disabled && "opacity-60 pointer-events-none"
            )}
            onClick={handleRowClick}
        >
            {/* Header: Drag handle + Product selector + Actions */}
            <div className="flex items-start gap-3 mb-3">
                <div
                    className="touch-none cursor-grab active:cursor-grabbing pt-2 opacity-30 group-hover:opacity-100 transition-opacity"
                    aria-label="Arrastrar para reordenar"
                    onPointerDown={(e) => {
                        if (disabled) return;
                        e.preventDefault();
                        dragControls.start(e);
                    }}
                >
                    <GripVertical className="h-5 w-5 text-foreground/60" />
                </div>

                {/* Product selector */}
                <div className="flex-1 min-w-0">
                    <ProductCombobox
                        value={line.productId}
                        onSelect={handleProductSelect}
                        disabled={disabled}
                        placeholder="Seleccionar producto o escribir descripción..."
                    />
                </div>

                {/* Actions */}
                <div className="flex items-center gap-1">
                    <TooltipProvider>
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-9 w-9"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        onDuplicate(line.id);
                                    }}
                                    disabled={disabled}
                                    aria-label="Duplicar línea"
                                >
                                    <Copy className="h-4 w-4" />
                                </Button>
                            </TooltipTrigger>
                            <TooltipContent>Duplicar línea</TooltipContent>
                        </Tooltip>
                    </TooltipProvider>

                    <TooltipProvider>
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-9 w-9 text-destructive hover:text-destructive hover:bg-destructive/10"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        onRemove(line.id);
                                    }}
                                    disabled={disabled}
                                    aria-label="Eliminar línea"
                                >
                                    <Trash2 className="h-4 w-4" />
                                </Button>
                            </TooltipTrigger>
                            <TooltipContent>Eliminar línea</TooltipContent>
                        </Tooltip>
                    </TooltipProvider>
                </div>
            </div>

            {/* Description */}
            {!line.productId && (
                <div className="mb-3">
                    <Input
                        value={line.description}
                        onChange={(e) => handleFieldChange('description', e.target.value)}
                        placeholder="Descripción del producto o servicio..."
                        disabled={disabled}
                        aria-label="Descripción"
                        className={cn(hasErrors && "border-destructive")}
                    />
                </div>
            )}

            {/* Fields grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-3 items-end">
                {/* Quantity */}
                <div className="space-y-1">
                    <label className="text-xs font-medium text-muted-foreground">
                        Cantidad
                    </label>
                    <NumberInput
                        value={line.qty}
                        min={0.0001}
                        step={1}
                        onChange={(v) => handleFieldChange('qty', Number(v || 1))}
                        disabled={disabled}
                        aria-label="Cantidad"
                        className="h-9"
                    />
                </div>

                {/* Unit */}
                <div className="space-y-1">
                    <label className="text-xs font-medium text-muted-foreground">
                        Unidad
                    </label>
                    <Input
                        value={line.unit}
                        onChange={(e) => handleFieldChange('unit', e.target.value)}
                        disabled={disabled}
                        aria-label="Unidad"
                        className="h-9"
                        maxLength={10}
                    />
                </div>

                {/* Unit Price */}
                <div className="space-y-1">
                    <label className="text-xs font-medium text-muted-foreground">
                        Precio Unit.
                    </label>
                    <NumberInput
                        value={line.unitPrice}
                        min={0}
                        step={100}
                        onChange={(v) => handleFieldChange('unitPrice', Number(v || 0))}
                        disabled={disabled}
                        aria-label="Precio unitario"
                        className="h-9"
                    />
                </div>

                {/* Discount */}
                <div className="space-y-1">
                    <div className="flex items-center justify-between mb-0">
                        <label className="text-xs font-medium text-muted-foreground">
                            Descuento
                        </label>
                        <Button
                            variant="ghost"
                            size="sm"
                            className="h-5 w-5 p-0"
                            onClick={toggleDiscountMode}
                            disabled={disabled}
                            aria-label={`Cambiar a ${discountMode === 'percent' ? 'monto' : 'porcentaje'}`}
                        >
                            {discountMode === 'percent' ? (
                                <Percent className="h-2.5 w-2.5" size={10} />
                            ) : (
                                <DollarSign className="h-2.5 w-2.5" size={10} />
                            )}
                        </Button>
                    </div>
                    {discountMode === 'percent' ? (
                        <NumberInput
                            value={line.discountPercent ?? 0}
                            min={0}
                            max={100}
                            step={0.5}
                            decimalScale={2}
                            onChange={(v) => {
                                handleFieldChange('discountPercent', Number(v || 0));
                                handleFieldChange('discountAmount', undefined);
                            }}
                            disabled={disabled}
                            aria-label="Descuento porcentaje"
                            className="h-9"
                        />
                    ) : (
                        <NumberInput
                            value={line.discountAmount ?? 0}
                            min={0}
                            step={100}
                            onChange={(v) => {
                                handleFieldChange('discountAmount', Number(v || 0));
                                handleFieldChange('discountPercent', undefined);
                            }}
                            disabled={disabled}
                            aria-label="Descuento monto"
                            className="h-9"
                        />
                    )}
                </div>

                {/* Tax Rate */}
                <div className="space-y-1">
                    <label className="text-xs font-medium text-muted-foreground">
                        IVA %
                    </label>
                    <NumberInput
                        value={line.taxRate}
                        min={0}
                        max={30}
                        step={1}
                        onChange={(v) => handleFieldChange('taxRate', Number(v || 0))}
                        disabled={disabled}
                        aria-label="IVA porcentaje"
                        className="h-9"
                    />
                </div>

                {/* Line Total */}
                <div className="space-y-1">
                    <label className="text-xs font-medium text-muted-foreground">
                        Total
                    </label>
                    <div className="flex items-center gap-2 h-9">
                        <TooltipProvider>
                            {showTooltip ? (
                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <div className="font-semibold text-sm cursor-help">
                                            {fmt(line.lineTotal)}
                                        </div>
                                    </TooltipTrigger>
                                    <TooltipContent className="max-w-xs">
                                        <div className="text-xs space-y-1">
                                            <div>Subtotal: {fmt(line.lineBase)}</div>
                                            {(line.discountPercent || line.discountAmount) && (
                                                <div className="text-amber-600">
                                                    Descuento: -{fmt(discountAmount)}
                                                </div>
                                            )}
                                            {line.taxRate > 0 && (
                                                <div>IVA ({line.taxRate}%): +{fmt(line.lineTax)}</div>
                                            )}
                                            <div className="font-semibold border-t pt-1">
                                                Total: {fmt(line.lineTotal)}
                                            </div>
                                        </div>
                                    </TooltipContent>
                                </Tooltip>
                            ) : (
                                <div className="font-semibold text-sm">{fmt(line.lineTotal)}</div>
                            )}
                        </TooltipProvider>
                    </div>
                </div>
            </div>

            {/* Badges and indicators */}
            <div className="flex items-center gap-2 mt-3 flex-wrap">
                {line.productId && (
                    <Badge variant="secondary" className="text-xs">
                        <Package className="h-3 w-3 mr-1 opacity-70" />
                        {line.productId.slice(0, 8)}
                    </Badge>
                )}
                {hasChanges && (
                    <Badge variant="outline" className="text-xs">
                        Modificado
                    </Badge>
                )}
                {hasErrors && (
                    <TooltipProvider>
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <Badge variant="destructive" className="text-xs cursor-help">
                                    <AlertCircle className="h-3 w-3 mr-1" />
                                    {errors.length} error{errors.length > 1 ? 'es' : ''}
                                </Badge>
                            </TooltipTrigger>
                            <TooltipContent>
                                <ul className="text-xs list-disc pl-4">
                                    {errors.map((err, i) => (
                                        <li key={i}>{err}</li>
                                    ))}
                                </ul>
                            </TooltipContent>
                        </Tooltip>
                    </TooltipProvider>
                )}
            </div>
        </Reorder.Item>
    );
}
