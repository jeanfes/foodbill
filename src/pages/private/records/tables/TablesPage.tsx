import { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card } from '@/components/ui/card';
import { Plus, Search } from 'lucide-react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { useTablesMock } from '@/hooks/useTablesMock';
import type { TableStatus } from '@/interfaces/table';
import { TableCard } from './components/TableCard';
import { usePermissions } from '@/hooks/usePermissions';
import { Permission } from '@/interfaces/role';
import { TableFormDialog } from './components/TableFormDialog';

export default function TablesPage() {
    const navigate = useNavigate();
    const location = useLocation();
    const params = useParams();
    const { filtered, remove, findById } = useTablesMock();
    const { hasPermission } = usePermissions();

    const [search, setSearch] = useState('');
    const [status, setStatus] = useState<'todas' | TableStatus>('todas');

    const items = useMemo(() => filtered({ search, status }), [filtered, search, status]);

    const isCreate = location.pathname.endsWith('/crear');
    const editId = (params as any).id as string | undefined;
    const editing = useMemo(() => (editId ? findById(editId) : null), [editId, findById]);
    const dialogOpen = isCreate || !!editId;

    return (
        <div className="space-y-4">
            <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
                <div>
                    <h1 className="text-2xl font-bold">Mesas</h1>
                    <p className="text-sm text-muted-foreground">Gestiona tu plano de mesas y ocupación</p>
                </div>
                <div className="flex gap-2">
                    {hasPermission(Permission.CREATE_TABLES) && (
                        <Button onClick={() => navigate('/mesas/crear')}>
                            <Plus className="h-4 w-4 mr-2" /> Nueva mesa
                        </Button>
                    )}
                </div>
            </motion.div>

            <Card className="p-3">
                <div className="flex gap-2 flex-col sm:flex-row">
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Buscar por nombre o ubicación" className="pl-9 h-10" />
                    </div>
                    <Select value={status} onValueChange={(v) => setStatus(v as any)}>
                        <SelectTrigger className="w-full sm:w-56 h-10">
                            <SelectValue placeholder="Estado" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="todas">Todas</SelectItem>
                            <SelectItem value="disponible">Disponible</SelectItem>
                            <SelectItem value="ocupada">Ocupada</SelectItem>
                            <SelectItem value="reservada">Reservada</SelectItem>
                            <SelectItem value="inactiva">Inactiva</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            </Card>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {items.map(t => (
                    <TableCard key={t.id} table={t} onEdit={(id) => navigate(`/mesas/${id}`)} onDelete={remove} />
                ))}
                {items.length === 0 && (
                    <div className="col-span-full text-center text-sm text-muted-foreground py-16 border rounded-md">
                        No hay mesas que coincidan con el criterio.
                    </div>
                )}
            </div>

            <TableFormDialog
                open={dialogOpen}
                editing={editing}
                onClose={() => navigate('/mesas')}
            />
        </div>
    );
}
