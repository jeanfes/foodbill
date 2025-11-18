import { useState, useMemo } from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Edit, Lock, Unlock, Plus, FileDown, ChevronLeft, ChevronRight } from 'lucide-react';
import type { CashBox, CashBoxSession } from '@/interfaces/cashbox';
import { MovementItem } from './MovementItem';

const MOVEMENTS_PER_PAGE = 15;
const SESSIONS_PER_PAGE = 10;

interface CashBoxDetailProps {
    cashBox: CashBox;
    onEdit: () => void;
    onOpen: () => void;
    onClose: () => void;
    onAddMovement: () => void;
    canEdit: boolean;
    canManage: boolean;
}

export function CashBoxDetail({
    cashBox,
    onEdit,
    onOpen,
    onClose,
    onAddMovement,
    canEdit,
    canManage,
}: CashBoxDetailProps) {
    const [movementsPage, setMovementsPage] = useState(1);
    const [sessionsPage, setSessionsPage] = useState(1);

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('es-CO', {
            style: 'currency',
            currency: 'COP',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
        }).format(amount);
    };

    const isOpen = cashBox.status === 'OPEN';
    const session = cashBox.currentSession;

    const totalSales = session?.movements
        ?.filter(m => m.type === 'SALE')
        ?.reduce((sum, m) => sum + m.amount, 0) || 0;

    const totalExpenses = session?.movements
        ?.filter(m => m.type === 'EXPENSE' || m.type === 'WITHDRAWAL')
        ?.reduce((sum, m) => sum + m.amount, 0) || 0;

    const difference = session?.difference;

    const totalMovements = session?.movements.length || 0;
    const totalMovementsPages = Math.ceil(totalMovements / MOVEMENTS_PER_PAGE);
    const paginatedMovements = useMemo(() => {
        if (!session?.movements) return [];
        const start = (movementsPage - 1) * MOVEMENTS_PER_PAGE;
        return session.movements.slice(start, start + MOVEMENTS_PER_PAGE);
    }, [session?.movements, movementsPage]);

    const closedSessions = useMemo(() => {
        return cashBox.sessions
            ?.filter(s => s.closedAt)
            ?.sort((a, b) => new Date(b.closedAt!).getTime() - new Date(a.closedAt!).getTime()) || [];
    }, [cashBox.sessions]);

    const totalSessionsPages = Math.ceil(closedSessions.length / SESSIONS_PER_PAGE);
    const paginatedSessions = useMemo(() => {
        const start = (sessionsPage - 1) * SESSIONS_PER_PAGE;
        return closedSessions.slice(start, start + SESSIONS_PER_PAGE);
    }, [closedSessions, sessionsPage]);

    const renderSessionCard = (sessionItem: CashBoxSession) => {
        const duration = sessionItem.closedAt
            ? new Date(sessionItem.closedAt).getTime() - new Date(sessionItem.openedAt).getTime()
            : 0;
        const hours = Math.floor(duration / (1000 * 60 * 60));
        const minutes = Math.floor((duration % (1000 * 60 * 60)) / (1000 * 60));
        const diff = sessionItem.difference || 0;

        return (
            <Card key={sessionItem.id} className="p-4">
                <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                            <span className="text-sm font-semibold">
                                {new Date(sessionItem.openedAt).toLocaleDateString('es-ES', {
                                    day: '2-digit',
                                    month: 'short',
                                    year: 'numeric'
                                })}
                            </span>
                            <Badge variant={diff === 0 ? 'default' : diff > 0 ? 'default' : 'destructive'} className="text-xs">
                                {diff === 0 ? 'Exacto' : diff > 0 ? `+${formatCurrency(diff)}` : formatCurrency(diff)}
                            </Badge>
                        </div>
                        <p className="text-xs text-muted-foreground">
                            {hours}h {minutes}m de operación
                        </p>
                    </div>
                </div>

                <div className="grid grid-cols-3 gap-3 text-xs">
                    <div>
                        <p className="text-muted-foreground mb-1">Inicial</p>
                        <p className="font-semibold">{formatCurrency(sessionItem.initialAmount)}</p>
                    </div>
                    <div>
                        <p className="text-muted-foreground mb-1">Esperado</p>
                        <p className="font-semibold">{formatCurrency(sessionItem.expectedAmount)}</p>
                    </div>
                    <div>
                        <p className="text-muted-foreground mb-1">Contado</p>
                        <p className="font-semibold">{formatCurrency(sessionItem.countedAmount || 0)}</p>
                    </div>
                </div>

                {(sessionItem.openingNote || sessionItem.closingNote) && (
                    <div className="mt-3 pt-3 border-t text-xs">
                        {sessionItem.openingNote && (
                            <p className="text-muted-foreground mb-1">
                                <span className="font-medium">Apertura:</span> {sessionItem.openingNote}
                            </p>
                        )}
                        {sessionItem.closingNote && (
                            <p className="text-muted-foreground">
                                <span className="font-medium">Cierre:</span> {sessionItem.closingNote}
                            </p>
                        )}
                    </div>
                )}
            </Card>
        );
    };

    return (
        <div className="flex flex-col h-full">
            <div className="flex items-start justify-between mb-6">
                <div>
                    <h2 className="text-2xl font-bold tracking-tight">{cashBox.name}</h2>
                    <p className="text-sm text-muted-foreground">{cashBox.code}</p>
                </div>
                <div className="flex items-center gap-2">
                    <Badge
                        variant={isOpen ? 'default' : 'secondary'}
                        className="text-sm px-3 py-1"
                    >
                        {isOpen ? 'Abierta' : 'Cerrada'}
                    </Badge>
                    {canEdit && (
                        <Button variant="ghost" size="sm" onClick={onEdit} title="Editar caja">
                            <Edit className="h-4 w-4" />
                        </Button>
                    )}
                    <Button variant="ghost" size="sm" title="Exportar">
                        <FileDown className="h-4 w-4" />
                    </Button>
                </div>
            </div>

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
                <Card className="p-4">
                    <p className="text-xs text-muted-foreground mb-1">Monto inicial</p>
                    <p className="text-lg font-semibold tabular-nums">
                        {session ? formatCurrency(session.initialAmount) : '--'}
                    </p>
                </Card>
                <Card className="p-4">
                    <p className="text-xs text-muted-foreground mb-1">Total ventas</p>
                    <p className="text-lg font-semibold text-green-600 tabular-nums">
                        {formatCurrency(totalSales)}
                    </p>
                </Card>
                <Card className="p-4">
                    <p className="text-xs text-muted-foreground mb-1">Total gastos</p>
                    <p className="text-lg font-semibold text-red-600 tabular-nums">
                        {formatCurrency(totalExpenses)}
                    </p>
                </Card>
                <Card className="p-4">
                    <p className="text-xs text-muted-foreground mb-1">Saldo esperado</p>
                    <p className="text-lg font-semibold tabular-nums">
                        {session ? formatCurrency(session.expectedAmount) : '--'}
                    </p>
                </Card>
            </div>

            {canManage && (
                <div className="flex gap-2 mb-6">
                    {!isOpen ? (
                        <Button onClick={onOpen} className="flex-1">
                            <Unlock className="h-4 w-4 mr-2" />
                            Abrir caja
                        </Button>
                    ) : (
                        <>
                            <Button onClick={onAddMovement} variant="default" className="flex-1">
                                <Plus className="h-4 w-4 mr-2" />
                                Agregar movimiento
                            </Button>
                            <Button onClick={onClose} variant="destructive" className="flex-1">
                                <Lock className="h-4 w-4 mr-2" />
                                Cerrar caja
                            </Button>
                        </>
                    )}
                </div>
            )}

            <Tabs defaultValue="resumen" className="flex-1 flex flex-col">
                <TabsList className="grid w-full grid-cols-4 mb-4">
                    <TabsTrigger value="resumen">Resumen</TabsTrigger>
                    <TabsTrigger value="movimientos">Movimientos</TabsTrigger>
                    <TabsTrigger value="apertura">Sesión Actual</TabsTrigger>
                    <TabsTrigger value="historial">Historial</TabsTrigger>
                </TabsList>

                <TabsContent value="resumen" className="flex-1 overflow-auto">
                    <Card className="p-6">
                        <h3 className="font-semibold mb-4">Información general</h3>
                        <div className="space-y-3 text-sm">
                            <div className="flex justify-between">
                                <span className="text-muted-foreground">Estado</span>
                                <span className="font-medium">{isOpen ? 'Abierta' : 'Cerrada'}</span>
                            </div>
                            {cashBox.location && (
                                <div className="flex justify-between">
                                    <span className="text-muted-foreground">Ubicación</span>
                                    <span className="font-medium">{cashBox.location}</span>
                                </div>
                            )}
                            {cashBox.assignedUserName && (
                                <div className="flex justify-between">
                                    <span className="text-muted-foreground">Usuario asignado</span>
                                    <span className="font-medium">{cashBox.assignedUserName}</span>
                                </div>
                            )}
                            <div className="flex justify-between">
                                <span className="text-muted-foreground">Apertura/Cierre manual</span>
                                <span className="font-medium">{cashBox.requiresOpeningClosing ? 'Sí' : 'No'}</span>
                            </div>
                            {session && (
                                <>
                                    <div className="flex justify-between pt-3 border-t">
                                        <span className="text-muted-foreground">Abierta por</span>
                                        <span className="font-medium">{session.openedByUserId}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-muted-foreground">Fecha apertura</span>
                                        <span className="font-medium tabular-nums">
                                            {new Date(session.openedAt).toLocaleString('es-ES')}
                                        </span>
                                    </div>
                                    {difference !== undefined && (
                                        <div className="flex justify-between pt-3 border-t">
                                            <span className="text-muted-foreground">Diferencia</span>
                                            <span className={`font-semibold ${difference > 0 ? 'text-green-600' : difference < 0 ? 'text-red-600' : ''}`}>
                                                {difference > 0 ? `Sobrante ${formatCurrency(difference)}` : difference < 0 ? `Faltante ${formatCurrency(Math.abs(difference))}` : 'Exacto'}
                                            </span>
                                        </div>
                                    )}
                                </>
                            )}
                        </div>
                    </Card>
                </TabsContent>

                <TabsContent value="movimientos" className="flex-1 flex flex-col overflow-hidden">
                    {!session || session.movements.length === 0 ? (
                        <div className="text-center py-12 text-sm text-muted-foreground">
                            No hay movimientos registrados
                        </div>
                    ) : (
                        <>
                            <div className="flex-1 overflow-y-auto space-y-2 mb-4">
                                {paginatedMovements.map(movement => (
                                    <MovementItem key={movement.id} movement={movement} />
                                ))}
                            </div>
                            {totalMovementsPages > 1 && (
                                <div className="flex items-center justify-between pt-4 border-t">
                                    <p className="text-xs text-muted-foreground">
                                        {totalMovements} movimiento{totalMovements !== 1 ? 's' : ''}
                                    </p>
                                    <div className="flex items-center gap-2">
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => setMovementsPage(p => Math.max(1, p - 1))}
                                            disabled={movementsPage === 1}
                                        >
                                            <ChevronLeft className="h-4 w-4" />
                                        </Button>
                                        <span className="text-xs text-muted-foreground">
                                            {movementsPage} / {totalMovementsPages}
                                        </span>
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => setMovementsPage(p => Math.min(totalMovementsPages, p + 1))}
                                            disabled={movementsPage === totalMovementsPages}
                                        >
                                            <ChevronRight className="h-4 w-4" />
                                        </Button>
                                    </div>
                                </div>
                            )}
                        </>
                    )}
                </TabsContent>

                <TabsContent value="apertura" className="flex-1 overflow-auto">
                    {!session ? (
                        <div className="text-center py-12 text-sm text-muted-foreground">
                            {isOpen ? 'No hay sesión activa' : 'La caja está cerrada. Abre la caja para comenzar.'}
                        </div>
                    ) : (
                        <Card className="p-6">
                            <h3 className="font-semibold mb-4">Detalles de la sesión</h3>
                            <div className="space-y-4">
                                <div>
                                    <h4 className="text-sm font-medium mb-2">Apertura</h4>
                                    <div className="text-sm space-y-1">
                                        <p><span className="text-muted-foreground">Fecha:</span> {new Date(session.openedAt).toLocaleString('es-ES')}</p>
                                        <p><span className="text-muted-foreground">Usuario:</span> {session.openedByUserId}</p>
                                        <p><span className="text-muted-foreground">Monto inicial:</span> {formatCurrency(session.initialAmount)}</p>
                                        {session.openingNote && (
                                            <p><span className="text-muted-foreground">Nota:</span> {session.openingNote}</p>
                                        )}
                                    </div>
                                </div>

                                {session.closedAt && (
                                    <div className="pt-4 border-t">
                                        <h4 className="text-sm font-medium mb-2">Cierre</h4>
                                        <div className="text-sm space-y-1">
                                            <p><span className="text-muted-foreground">Fecha:</span> {new Date(session.closedAt).toLocaleString('es-ES')}</p>
                                            {session.closedByUserId && (
                                                <p><span className="text-muted-foreground">Usuario:</span> {session.closedByUserId}</p>
                                            )}
                                            {session.countedAmount !== undefined && (
                                                <>
                                                    <p><span className="text-muted-foreground">Monto contado:</span> {formatCurrency(session.countedAmount)}</p>
                                                    <p><span className="text-muted-foreground">Monto esperado:</span> {formatCurrency(session.expectedAmount)}</p>
                                                </>
                                            )}
                                            {session.closingNote && (
                                                <p><span className="text-muted-foreground">Observaciones:</span> {session.closingNote}</p>
                                            )}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </Card>
                    )}
                </TabsContent>

                <TabsContent value="historial" className="flex-1 flex flex-col overflow-hidden">
                    {closedSessions.length === 0 ? (
                        <div className="text-center py-12 text-sm text-muted-foreground">
                            No hay sesiones cerradas en el historial
                        </div>
                    ) : (
                        <>
                            <div className="flex-1 overflow-y-auto space-y-3 mb-4">
                                {paginatedSessions.map(renderSessionCard)}
                            </div>
                            {totalSessionsPages > 1 && (
                                <div className="flex items-center justify-between pt-4 border-t">
                                    <p className="text-xs text-muted-foreground">
                                        {closedSessions.length} sesión{closedSessions.length !== 1 ? 'es' : ''}
                                    </p>
                                    <div className="flex items-center gap-2">
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => setSessionsPage(p => Math.max(1, p - 1))}
                                            disabled={sessionsPage === 1}
                                        >
                                            <ChevronLeft className="h-4 w-4" />
                                        </Button>
                                        <span className="text-xs text-muted-foreground">
                                            {sessionsPage} / {totalSessionsPages}
                                        </span>
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => setSessionsPage(p => Math.min(totalSessionsPages, p + 1))}
                                            disabled={sessionsPage === totalSessionsPages}
                                        >
                                            <ChevronRight className="h-4 w-4" />
                                        </Button>
                                    </div>
                                </div>
                            )}
                        </>
                    )}
                </TabsContent>
            </Tabs>
        </div>
    );
}
