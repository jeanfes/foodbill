import { CreditCard, User, MapPin } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import type { CashBox } from '@/interfaces/cashbox';
import { cn } from '@/lib/utils';

interface CashBoxCardProps {
    cashBox: CashBox;
    onClick: () => void;
    isSelected?: boolean;
}

export function CashBoxCard({ cashBox, onClick, isSelected }: CashBoxCardProps) {
    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('es-CO', {
            style: 'currency',
            currency: 'COP',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
        }).format(amount);
    };

    const getLastUpdate = () => {
        if (cashBox.currentSession?.movements.length) {
            const lastMovement = cashBox.currentSession.movements[0];
            const date = new Date(lastMovement.createdAt);
            return `${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`;
        }
        return '--:--';
    };

    return (
        <div
            onClick={onClick}
            className={cn(
                "rounded-2xl p-4 shadow-sm hover:shadow-md bg-card flex flex-col justify-between gap-3 cursor-pointer transition-all duration-200",
                isSelected && "ring-2 ring-primary shadow-md"
            )}
        >
            <div className="flex items-start justify-between">
                <div className="flex items-center gap-2 flex-1 min-w-0">
                    <CreditCard className="h-4 w-4 text-muted-foreground shrink-0" />
                    <h3 className="font-bold text-sm truncate" title={cashBox.name}>
                        {cashBox.name}
                    </h3>
                </div>
                <Badge
                    variant={cashBox.status === 'OPEN' ? 'default' : 'secondary'}
                    className="text-xs shrink-0 ml-2"
                >
                    {cashBox.status === 'OPEN' ? 'Abierta' : 'Cerrada'}
                </Badge>
            </div>

            <div className="space-y-1">
                {cashBox.assignedUserName && (
                    <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                        <User className="h-3 w-3" />
                        <span className="truncate">{cashBox.assignedUserName}</span>
                    </div>
                )}
                {cashBox.location && (
                    <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                        <MapPin className="h-3 w-3" />
                        <span className="truncate">{cashBox.location}</span>
                    </div>
                )}
            </div>

            <div className="flex items-end justify-between pt-2 border-t">
                <div className="flex flex-col">
                    <span className="text-xs text-muted-foreground">Saldo actual</span>
                    <span className="text-lg font-semibold tabular-nums">
                        {formatCurrency(cashBox.currentAmount)}
                    </span>
                </div>
                <div className="text-right">
                    <span className="text-[10px] text-muted-foreground">
                        Últ. actualización
                    </span>
                    <div className="text-xs font-medium tabular-nums">
                        {getLastUpdate()}
                    </div>
                </div>
            </div>
        </div>
    );
}
