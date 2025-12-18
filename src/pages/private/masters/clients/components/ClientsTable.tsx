import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import type { Client } from "../Clients";
import { Can } from "@/components/Can";
import { Permission } from "@/interfaces/role";
import { formatDistanceToNow } from "date-fns";
import { es } from "date-fns/locale";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface ClientsTableProps {
    onOpenDetail: (id: string) => void;
    onEdit: (id: string) => void;
}

const mockClients: Client[] = [
    {
        id: "1",
        documentType: "CC",
        document: "123456",
        fullName: "Juan Pérez",
        email: "juan@example.com",
        phone: "3001234567",
        type: "Frecuente",
        lastPurchaseDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
        totalPurchases: 45,
        createdAt: new Date(Date.now() - 180 * 24 * 60 * 60 * 1000).toISOString(),
        active: true,
        audit: {
            createdBy: "admin",
            createdAt: new Date(Date.now() - 180 * 24 * 60 * 60 * 1000).toISOString(),
        },
    },
    {
        id: "2",
        documentType: "NIT",
        document: "900123456",
        fullName: "Empresa XYZ",
        companyName: "Empresa XYZ SAS",
        email: "contacto@xyz.com",
        phone: "6012345678",
        type: "Corporativo",
        lastPurchaseDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
        totalPurchases: 120,
        createdAt: new Date(Date.now() - 365 * 24 * 60 * 60 * 1000).toISOString(),
        active: true,
        audit: {
            createdBy: "admin",
            createdAt: new Date(Date.now() - 365 * 24 * 60 * 60 * 1000).toISOString(),
        },
    },
    {
        id: "3",
        documentType: "CC",
        document: "789012",
        fullName: "Maria Gómez",
        phone: "3009876543",
        type: "Particular",
        lastPurchaseDate: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000).toISOString(),
        totalPurchases: 8,
        createdAt: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000).toISOString(),
        active: false,
        audit: {
            createdBy: "admin",
            createdAt: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000).toISOString(),
        },
    },
];

const ClientsTable = ({ onOpenDetail, onEdit }: ClientsTableProps) => {
    const [selected, setSelected] = useState<string[]>([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);

    const totalPages = Math.ceil(mockClients.length / pageSize);
    const startIndex = (currentPage - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    const paginatedClients = mockClients.slice(startIndex, endIndex);

    const toggle = (id: string) => {
        setSelected(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
    };

    const allSelected = selected.length === paginatedClients.length && paginatedClients.length > 0;
    const toggleAll = () => {
        setSelected(allSelected ? [] : paginatedClients.map(c => c.id));
    };

    const handlePageSizeChange = (value: string) => {
        setPageSize(Number(value));
        setCurrentPage(1);
    };

    const goToPage = (page: number) => {
        setCurrentPage(Math.max(1, Math.min(page, totalPages)));
    };

    const getClientTypeColor = (type: string) => {
        switch (type) {
            case "Frecuente": return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200";
            case "Corporativo": return "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200";
            default: return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200";
        }
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
                        <TableHead>Nombre</TableHead>
                        <TableHead>Documento</TableHead>
                        <TableHead>Contacto</TableHead>
                        <TableHead>Tipo</TableHead>
                        <TableHead>Creado</TableHead>
                        <TableHead>Últ. compra</TableHead>
                        <TableHead>Estado</TableHead>
                        <TableHead className="text-right">Acciones</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {paginatedClients.map(c => {
                        const isSelected = selected.includes(c.id);
                        return (
                            <TableRow key={c.id}>
                                <TableCell>
                                    <Checkbox
                                        checked={isSelected}
                                        onCheckedChange={() => toggle(c.id)}
                                    />
                                </TableCell>
                                <TableCell className="font-medium">{c.fullName}</TableCell>
                                <TableCell className="text-muted-foreground">{c.documentType} {c.document}</TableCell>
                                <TableCell className="text-sm">
                                    <div>{c.phone || "-"}</div>
                                    {c.email && <div className="text-muted-foreground">{c.email}</div>}
                                </TableCell>
                                <TableCell>
                                    <Badge variant="secondary" className={getClientTypeColor(c.type)}>
                                        {c.type}
                                    </Badge>
                                </TableCell>
                                <TableCell className="text-sm text-muted-foreground">
                                    {formatDistanceToNow(new Date(c.createdAt), { addSuffix: true, locale: es })}
                                </TableCell>
                                <TableCell className="text-sm text-muted-foreground">
                                    {c.lastPurchaseDate
                                        ? formatDistanceToNow(new Date(c.lastPurchaseDate), { addSuffix: true, locale: es })
                                        : "Nunca"}
                                </TableCell>
                                <TableCell>
                                    <Badge variant={c.active ? "default" : "secondary"} className={c.active ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200" : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"}>
                                        {c.active ? "Activo" : "Inactivo"}
                                    </Badge>
                                </TableCell>
                                <TableCell className="text-right">
                                    <div className="flex gap-2 justify-end">
                                        <Button size="sm" variant="outline" onClick={() => onOpenDetail(c.id)}>Ver</Button>
                                        <Can permission={Permission.MAE_CLIENTES_UPDATE}>
                                            <Button size="sm" variant="ghost" onClick={() => onEdit(c.id)}>Editar</Button>
                                        </Can>
                                    </div>
                                </TableCell>
                            </TableRow>
                        );
                    })}
                </TableBody>
            </Table>

            <div className="flex items-center justify-between px-2 py-2">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <span>Mostrar</span>
                    <Select value={pageSize.toString()} onValueChange={handlePageSizeChange}>
                        <SelectTrigger className="h-8 w-16">
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="10">10</SelectItem>
                            <SelectItem value="25">25</SelectItem>
                            <SelectItem value="50">50</SelectItem>
                            <SelectItem value="100">100</SelectItem>
                        </SelectContent>
                    </Select>
                    <span>de {mockClients.length} registros</span>
                </div>

                <div className="flex items-center gap-2">
                    <span className="text-sm text-muted-foreground">
                        Página {currentPage} de {totalPages}
                    </span>
                    <div className="flex gap-1">
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => goToPage(currentPage - 1)}
                            disabled={currentPage === 1}
                        >
                            <ChevronLeft className="h-4 w-4" />
                        </Button>
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => goToPage(currentPage + 1)}
                            disabled={currentPage === totalPages}
                        >
                            <ChevronRight className="h-4 w-4" />
                        </Button>
                    </div>
                </div>
            </div>

            {selected.length > 0 && (
                <div className="p-3 flex items-center gap-3 bg-muted rounded-md text-sm">
                    <div className="font-medium">{selected.length} seleccionados</div>
                    <Can permission={Permission.MAE_CLIENTES_UPDATE}>
                        <Button size="sm" variant="secondary">Marcar frecuentes</Button>
                    </Can>
                    <Can permission={Permission.MAE_CLIENTES_UPDATE}>
                        <Button size="sm" variant="outline">Activar/Inactivar</Button>
                    </Can>
                    <Can permission={Permission.MAE_CLIENTES_DELETE}>
                        <Button size="sm" variant="destructive">Eliminar</Button>
                    </Can>
                </div>
            )}
        </div>
    );
};

export default ClientsTable;
