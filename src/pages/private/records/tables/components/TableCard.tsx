import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import type { Table } from '@/interfaces/table';
import { statusBadgeVariant } from '@/lib/mockData/tables';
import { Users2, Pencil, Trash2, MapPin } from 'lucide-react';

interface Props {
    table: Table;
    onEdit: (id: string) => void;
    onDelete: (id: string) => void;
}

export function TableCard({ table, onEdit, onDelete }: Props) {
    const badge = statusBadgeVariant(table.estado);

    return (
        <Card className="p-4 rounded-xl shadow-sm hover:shadow-md transition-all">
            <div className="flex items-start justify-between mb-2">
                <div>
                    <h3 className="font-semibold text-base leading-tight">{table.nombre}</h3>
                    {table.ubicacion && (
                        <div className="flex items-center gap-1 text-xs text-muted-foreground">
                            <MapPin className="h-3.5 w-3.5" /> {table.ubicacion}
                        </div>
                    )}
                </div>
                <Badge variant={badge.variant} className={badge.className}>{badge.label}</Badge>
            </div>

            <div className="flex items-center justify-between mt-2">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Users2 className="h-4 w-4" />
                    Capacidad: <span className="font-medium text-foreground">{table.capacidad}</span>
                </div>
                <div className="flex gap-2">
                    <Button size="sm" variant="outline" onClick={() => onEdit(table.id)}>
                        <Pencil className="h-4 w-4 mr-1" /> Editar
                    </Button>
                    <Button size="sm" variant="destructive" onClick={() => onDelete(table.id)}>
                        <Trash2 className="h-4 w-4 mr-1" /> Eliminar
                    </Button>
                </div>
            </div>
        </Card>
    );
}
