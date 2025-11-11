import { Card } from "@/components/ui/card";

const KPI = ({ label, value }: { label: string; value: string }) => (
    <Card className="p-4">
        <div className="text-sm text-muted-foreground">{label}</div>
        <div className="text-2xl font-bold">{value}</div>
    </Card>
);

const ClientsKpis = () => {
    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            <KPI label="Clientes activos" value="128" />
            <KPI label="Frecuentes" value="42" />
            <KPI label="Nuevos (30d)" value="15" />
            <KPI label="Última visita promedio" value="18 días" />
        </div>
    );
};

export default ClientsKpis;
