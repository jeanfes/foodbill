import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Can } from "@/components/Can";
import { Permission } from "@/interfaces/role";
import ClientsKpis from "./components/ClientsKpis.tsx";
import ClientsFilters from "./components/ClientsFilters.tsx";
import ClientsTable from "./components/ClientsTable.tsx";
import ClientDetailDialog from "./components/ClientDetailDialog.tsx";
import ClientFormDialog from "./components/ClientFormDialog.tsx";
import ImportCsvDialog from "./components/ImportCsvDialog.tsx";

export interface Client {
    id: string;
    documentType: "CC" | "NIT" | "CE" | "PP" | "Otro";
    document: string;
    fullName: string;
    email?: string;
    phone?: string;
    address?: string;
    isFrequent?: boolean;
    createdAt: string; // ISO
    active: boolean;
}

const ClientsPage = () => {
    const [query, setQuery] = useState("");
    const [showDetailId, setShowDetailId] = useState<string | null>(null);
    const [showFormOpen, setShowFormOpen] = useState(false);
    const [importOpen, setImportOpen] = useState(false);

    return (
        <div className="space-y-4">
            <div className="flex flex-col md:flex-row md:items-center gap-3">
                <div className="flex-1 flex gap-2">
                    <Input
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        placeholder="Buscar por nombre, documento o teléfono"
                    />
                    <Button variant="secondary">Buscar</Button>
                </div>
                <div className="flex gap-2">
                    <Can permission={Permission.CREATE_CLIENTS}>
                        <Button onClick={() => setShowFormOpen(true)}>Nuevo cliente</Button>
                    </Can>
                    <Button variant="outline" onClick={() => setImportOpen(true)}>Importar CSV</Button>
                </div>
            </div>

            <Card className="p-4">
                <ClientsFilters />
            </Card>

            <ClientsKpis />

            <Card className="p-0 overflow-hidden">
                <ClientsTable onOpenDetail={(id: string) => setShowDetailId(id)} />
            </Card>

            <ClientDetailDialog clientId={showDetailId} onOpenChange={setShowDetailId} />
            <ClientFormDialog open={showFormOpen} onOpenChange={setShowFormOpen} />
            <ImportCsvDialog open={importOpen} onOpenChange={setImportOpen} />
        </div>
    );
};

export default ClientsPage;
