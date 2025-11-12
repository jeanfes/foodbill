import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Can } from "@/components/Can";
import { Permission } from "@/interfaces/role";
import { Download, Upload, UserPlus } from "lucide-react";
import ClientsKpis from "./components/ClientsKpis.tsx";
import ClientsFilters from "./components/ClientsFilters.tsx";
import ClientsTable from "./components/ClientsTable.tsx";
import ClientDetailDialog from "./components/ClientDetailDialog.tsx";
import ClientFormDialog from "./components/ClientFormDialog.tsx";
import ImportCsvDialog from "./components/ImportCsvDialog.tsx";
import ExportDialog from "./components/ExportDialog.tsx";

export type ClientType = "Particular" | "Frecuente" | "Corporativo";

export interface ClientAudit {
    createdBy: string;
    createdAt: string;
    lastModifiedBy?: string;
    lastModifiedAt?: string;
}

export interface Client {
    id: string;
    documentType: "CC" | "NIT" | "CE" | "PP" | "Otro";
    document: string;
    fullName: string;
    companyName?: string; // Para corporativos
    email?: string;
    phone?: string;
    phone2?: string;
    address?: string;
    neighborhood?: string;
    type: ClientType;
    notes?: string;
    tags?: string[];
    lastPurchaseDate?: string;
    totalPurchases?: number;
    pendingBalance?: number;
    createdAt: string;
    active: boolean;
    audit: ClientAudit;
}

const ClientsPage = () => {
    const [query, setQuery] = useState("");
    const [showDetailId, setShowDetailId] = useState<string | null>(null);
    const [showFormOpen, setShowFormOpen] = useState(false);
    const [editClientId, setEditClientId] = useState<string | undefined>(undefined);
    const [importOpen, setImportOpen] = useState(false);
    const [exportOpen, setExportOpen] = useState(false);

    return (
        <div className="space-y-4">
            {/* Título y barra de acciones */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
                <div>
                    <h1 className="text-2xl font-bold">Clientes</h1>
                    <p className="text-sm text-muted-foreground">Gestiona tu base de clientes y su información</p>
                </div>
                <div className="flex gap-2">
                    <Button variant="outline" size="sm" onClick={() => setExportOpen(true)}>
                        <Download className="h-4 w-4 mr-2" />
                        Exportar
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => setImportOpen(true)}>
                        <Upload className="h-4 w-4 mr-2" />
                        Importar
                    </Button>
                    <Can permission={Permission.CREATE_CLIENTS}>
                        <Button size="sm" onClick={() => { setEditClientId(undefined); setShowFormOpen(true); }}>
                            <UserPlus className="h-4 w-4 mr-2" />
                            Nuevo cliente
                        </Button>
                    </Can>
                </div>
            </div>

            {/* Búsqueda global */}
            <Card className="p-4">
                <div className="flex gap-2">
                    <Input
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        placeholder="Buscar por nombre, documento o teléfono..."
                        className="flex-1"
                    />
                    <Button>Buscar</Button>
                </div>
            </Card>

            {/* Filtros colapsables */}
            <ClientsFilters />

            {/* KPIs */}
            <ClientsKpis />

            {/* Tabla principal */}
            <Card className="p-0 overflow-hidden">
                <ClientsTable
                    onOpenDetail={(id: string) => setShowDetailId(id)}
                    onEdit={(id: string) => { setEditClientId(id); setShowFormOpen(true); }}
                />
            </Card>

            {/* Diálogos */}
            <ClientDetailDialog
                clientId={showDetailId}
                onOpenChange={setShowDetailId}
                onEdit={(id: string) => { setEditClientId(id); setShowFormOpen(true); }}
            />
            <ClientFormDialog open={showFormOpen} onOpenChange={setShowFormOpen} clientId={editClientId} />
            <ImportCsvDialog open={importOpen} onOpenChange={setImportOpen} />
            <ExportDialog open={exportOpen} onOpenChange={setExportOpen} />
        </div>
    );
};

export default ClientsPage;
