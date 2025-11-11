import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import type { Client } from "../ClientsPage";
import { Can } from "@/components/Can";
import { Permission } from "@/interfaces/role";

interface ClientsTableProps {
    onOpenDetail: (id: string) => void;
}

const mockClients: Client[] = [
    { id: "1", documentType: "CC", document: "123456", fullName: "Juan Pérez", email: "juan@example.com", phone: "3001234567", isFrequent: true, createdAt: new Date().toISOString(), active: true },
    { id: "2", documentType: "NIT", document: "900123456", fullName: "Empresa XYZ", email: "contacto@xyz.com", phone: "6012345678", isFrequent: false, createdAt: new Date().toISOString(), active: true },
    { id: "3", documentType: "CC", document: "789012", fullName: "Maria Gómez", phone: "3009876543", isFrequent: true, createdAt: new Date().toISOString(), active: false },
];

const ClientsTable = ({ onOpenDetail }: ClientsTableProps) => {
    const [selected, setSelected] = useState<string[]>([]);

    const toggle = (id: string) => {
        setSelected(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
    };

    const allSelected = selected.length === mockClients.length && mockClients.length > 0;
    const toggleAll = () => {
        setSelected(allSelected ? [] : mockClients.map(c => c.id));
    };

    return (
        <div className="w-full">
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead className="w-12">
                            <Checkbox
                                checked={allSelected}
                                onCheckedChange={toggleAll}
                            />
                        </TableHead>
                        <TableHead>Documento</TableHead>
                        <TableHead>Nombre</TableHead>
                        <TableHead>Contacto</TableHead>
                        <TableHead>Frecuente</TableHead>
                        <TableHead>Estado</TableHead>
                        <TableHead className="text-right">Acciones</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {mockClients.map(c => {
                        const isSelected = selected.includes(c.id);
                        return (
                            <TableRow key={c.id}>
                                <TableCell>
                                    <Checkbox
                                        checked={isSelected}
                                        onCheckedChange={() => toggle(c.id)}
                                    />
                                </TableCell>
                                <TableCell>{c.documentType} {c.document}</TableCell>
                                <TableCell>{c.fullName}</TableCell>
                                <TableCell>{c.phone || c.email || "-"}</TableCell>
                                <TableCell>{c.isFrequent ? "Sí" : "No"}</TableCell>
                                <TableCell>
                                    <span className={c.active ? "text-green-600" : "text-red-600"}>
                                        {c.active ? "Activo" : "Inactivo"}
                                    </span>
                                </TableCell>
                                <TableCell className="text-right">
                                    <div className="flex gap-2 justify-end">
                                        <Button size="sm" variant="outline" onClick={() => onOpenDetail(c.id)}>Ver</Button>
                                        <Can permission={Permission.UPDATE_CLIENTS}>
                                            <Button size="sm" variant="ghost">Editar</Button>
                                        </Can>
                                    </div>
                                </TableCell>
                            </TableRow>
                        );
                    })}
                </TableBody>
            </Table>
            {selected.length > 0 && (
                <div className="p-3 flex items-center gap-3 bg-muted mt-2 rounded-md text-xs">
                    <div>{selected.length} seleccionados</div>
                    <Can permission={Permission.UPDATE_CLIENTS}>
                        <Button size="sm" variant="secondary">Marcar frecuentes</Button>
                    </Can>
                    <Can permission={Permission.UPDATE_CLIENTS}>
                        <Button size="sm" variant="outline">Activar/Inactivar</Button>
                    </Can>
                </div>
            )}
        </div>
    );
};

export default ClientsTable;
