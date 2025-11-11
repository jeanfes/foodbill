import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface FiltersState {
    documentType: string;
    isFrequent: string;
    status: string;
}

const ClientsFilters = () => {
    const [filters, setFilters] = useState<FiltersState>({ documentType: "", isFrequent: "", status: "" });

    return (
        <div className="space-y-3">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <Select value={filters.documentType} onValueChange={(v) => setFilters(f => ({ ...f, documentType: v }))}>
                    <SelectTrigger><SelectValue placeholder="Tipo documento" /></SelectTrigger>
                    <SelectContent>
                        <SelectItem value="CC">CC</SelectItem>
                        <SelectItem value="NIT">NIT</SelectItem>
                        <SelectItem value="CE">CE</SelectItem>
                        <SelectItem value="PP">Pasaporte</SelectItem>
                        <SelectItem value="Otro">Otro</SelectItem>
                    </SelectContent>
                </Select>
                <Select value={filters.isFrequent} onValueChange={(v) => setFilters(f => ({ ...f, isFrequent: v }))}>
                    <SelectTrigger><SelectValue placeholder="Frecuente" /></SelectTrigger>
                    <SelectContent>
                        <SelectItem value="SI">Sí</SelectItem>
                        <SelectItem value="NO">No</SelectItem>
                    </SelectContent>
                </Select>
                <Select value={filters.status} onValueChange={(v) => setFilters(f => ({ ...f, status: v }))}>
                    <SelectTrigger><SelectValue placeholder="Estado" /></SelectTrigger>
                    <SelectContent>
                        <SelectItem value="activo">Activo</SelectItem>
                        <SelectItem value="inactivo">Inactivo</SelectItem>
                    </SelectContent>
                </Select>
            </div>
            <div className="flex gap-2">
                <Button size="sm">Aplicar</Button>
                <Button variant="outline" size="sm" onClick={() => setFilters({ documentType: "", isFrequent: "", status: "" })}>Limpiar</Button>
            </div>
        </div>
    );
};

export default ClientsFilters;
