import { ArrowUpCircle, ArrowDownCircle, Minus, DollarSign } from 'lucide-react';
import type { CashBoxMovement, MovementType } from '@/interfaces/cashbox';
import { cn } from '@/lib/utils';

interface MovementItemProps {
    movement: CashBoxMovement;
    onAction?: (id: string) => void;
}

const movementConfig: Record<MovementType, {
    label: string;
    icon: React.ElementType;
    color: string;
    sign: '+' | '-';
}> = {
    SALE: { label: 'Venta', icon: ArrowUpCircle, color: 'text-green-600', sign: '+' },
    INCOME: { label: 'Ingreso', icon: ArrowUpCircle, color: 'text-green-600', sign: '+' },
    EXPENSE: { label: 'Gasto', icon: ArrowDownCircle, color: 'text-red-600', sign: '-' },
    WITHDRAWAL: { label: 'Retiro', icon: ArrowDownCircle, color: 'text-orange-600', sign: '-' },
    ADJUSTMENT: { label: 'Ajuste', icon: Minus, color: 'text-amber-600', sign: '+' },
    OPENING: { label: 'Apertura', icon: DollarSign, color: 'text-blue-600', sign: '+' },
    CLOSING: { label: 'Cierre', icon: DollarSign, color: 'text-gray-600', sign: '-' },
};

export function MovementItem({ movement }: MovementItemProps) {
    const config = movementConfig[movement.type];
    const Icon = config.icon;

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('es-CO', {
            style: 'currency',
            currency: 'COP',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
        }).format(amount);
    };

    const formatTime = (date: string) => {
        const d = new Date(date);
        return `${d.getHours().toString().padStart(2, '0')}:${d.getMinutes().toString().padStart(2, '0')}`;
    };

    return (
        <div className="flex items-start gap-4 p-3 rounded-md hover:bg-muted/50 transition-colors">
            <div className={cn("rounded-full p-2 shrink-0", config.color, "bg-current/10")}>
                <Icon className={cn("h-4 w-4", config.color)} />
            </div>

            <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2">
                    <div className="flex-1 min-w-0">
                        <div className="flex items-baseline gap-2">
                            <span className="font-medium text-sm">
                                {config.label}
                                {movement.reference && ` #${movement.reference}`}
                            </span>
                            <span className={cn("font-semibold text-sm tabular-nums", config.color)}>
                                {config.sign}{formatCurrency(movement.amount)}
                            </span>
                        </div>
                        <div className="text-xs text-muted-foreground mt-0.5 flex items-center gap-1.5">
                            <span>{movement.userName || 'Usuario'}</span>
                            <span>•</span>
                            <span className="tabular-nums">{formatTime(movement.createdAt)}</span>
                            {movement.note && (
                                <>
                                    <span>•</span>
                                    <span className="truncate" title={movement.note}>{movement.note}</span>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
