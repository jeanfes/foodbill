import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { ChevronDown, ChevronUp, Filter, X } from "lucide-react";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { cn } from "@/lib/utils";

interface FiltersState {
    documentType: string;
    clientType: string;
    status: string;
    createdFrom?: Date;
    createdTo?: Date;
    lastPurchaseDays: string;
}

const ClientsFilters = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [filters, setFilters] = useState<FiltersState>({
        documentType: "",
        clientType: "",
        status: "",
        lastPurchaseDays: "",
    });

    const hasActiveFilters = Object.values(filters).some(v => v !== "" && v !== undefined);

    const handleClear = () => {
        setFilters({
            documentType: "",
            clientType: "",
            status: "",
            lastPurchaseDays: "",
            createdFrom: undefined,
            createdTo: undefined,
        });
    };

    const handleApply = () => {
        console.log("Aplicando filtros:", filters);
    };

    return (
        <Card className="p-0 border-b-0">
            <Collapsible open={isOpen} onOpenChange={setIsOpen}>
                <CollapsibleTrigger asChild>
                    <Button variant="ghost" className="w-full justify-between p-4 hover:bg-accent">
                        <div className="flex items-center gap-2">
                            <Filter className="h-4 w-4" />
                            <span className="font-medium">Filtros avanzados</span>
                            {hasActiveFilters && (
                                <span className="ml-2 bg-primary text-primary-foreground text-xs px-2 py-0.5 rounded-full">
                                    Activos
                                </span>
                            )}
                        </div>
                        {isOpen ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                    </Button>
                </CollapsibleTrigger>
                <CollapsibleContent className="px-4 pb-4">
                    <div className="space-y-4 pt-4 border-t">
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Tipo de documento</label>
                                <Select value={filters.documentType} onValueChange={(v) => setFilters(f => ({ ...f, documentType: v }))}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Todos" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="CC">CC</SelectItem>
                                        <SelectItem value="NIT">NIT</SelectItem>
                                        <SelectItem value="CE">CE</SelectItem>
                                        <SelectItem value="PP">Pasaporte</SelectItem>
                                        <SelectItem value="Otro">Otro</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium">Tipo de cliente</label>
                                <Select value={filters.clientType} onValueChange={(v) => setFilters(f => ({ ...f, clientType: v }))}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Todos" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="Particular">Particular</SelectItem>
                                        <SelectItem value="Frecuente">Frecuente</SelectItem>
                                        <SelectItem value="Corporativo">Corporativo</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium">Estado</label>
                                <Select value={filters.status} onValueChange={(v) => setFilters(f => ({ ...f, status: v }))}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Todos" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="activo">Activo</SelectItem>
                                        <SelectItem value="inactivo">Inactivo</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium">Última compra</label>
                                <Select value={filters.lastPurchaseDays} onValueChange={(v) => setFilters(f => ({ ...f, lastPurchaseDays: v }))}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Cualquier fecha" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="7">Últimos 7 días</SelectItem>
                                        <SelectItem value="30">Últimos 30 días</SelectItem>
                                        <SelectItem value="60">Últimos 60 días</SelectItem>
                                        <SelectItem value="90">Últimos 90 días</SelectItem>
                                        <SelectItem value="180">Sin compras +180 días</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Creado desde</label>
                                <Popover>
                                    <PopoverTrigger asChild>
                                        <Button
                                            variant="outline"
                                            className={cn(
                                                "w-full justify-start text-left font-normal",
                                                !filters.createdFrom && "text-muted-foreground"
                                            )}
                                        >
                                            {filters.createdFrom ? format(filters.createdFrom, "PPP", { locale: es }) : "Seleccionar fecha"}
                                        </Button>
                                    </PopoverTrigger>
                                    <PopoverContent className="w-auto p-0">
                                        <Calendar
                                            mode="single"
                                            selected={filters.createdFrom}
                                            onSelect={(date) => setFilters(f => ({ ...f, createdFrom: date }))}
                                            locale={es}
                                        />
                                    </PopoverContent>
                                </Popover>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium">Creado hasta</label>
                                <Popover>
                                    <PopoverTrigger asChild>
                                        <Button
                                            variant="outline"
                                            className={cn(
                                                "w-full justify-start text-left font-normal",
                                                !filters.createdTo && "text-muted-foreground"
                                            )}
                                        >
                                            {filters.createdTo ? format(filters.createdTo, "PPP", { locale: es }) : "Seleccionar fecha"}
                                        </Button>
                                    </PopoverTrigger>
                                    <PopoverContent className="w-auto p-0">
                                        <Calendar
                                            mode="single"
                                            selected={filters.createdTo}
                                            onSelect={(date) => setFilters(f => ({ ...f, createdTo: date }))}
                                            locale={es}
                                        />
                                    </PopoverContent>
                                </Popover>
                            </div>
                        </div>

                        <div className="flex gap-2 pt-2">
                            <Button onClick={handleApply}>
                                <Filter className="h-4 w-4 mr-2" />
                                Aplicar filtros
                            </Button>
                            <Button variant="outline" onClick={handleClear} disabled={!hasActiveFilters}>
                                <X className="h-4 w-4 mr-2" />
                                Limpiar
                            </Button>
                        </div>
                    </div>
                </CollapsibleContent>
            </Collapsible>
        </Card>
    );
};

export default ClientsFilters;
