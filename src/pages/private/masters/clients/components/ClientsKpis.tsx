import { Card } from "@/components/ui/card";
import { useEffect, useState } from "react";
import { clientsService } from "@/services/clientsService";
import { Users, TrendingUp, Star, Clock, DollarSign } from "lucide-react";
import type { Client } from "../Clients";

interface KpiData {
    total: number;
    active: number;
    new30Days: number;
    frequent: number;
    frequentPercentage: number;
    inactiveOver90Days: number;
    totalPendingBalance: number;
}

const KPI = ({
    label,
    value,
    subtitle,
    icon: Icon,
    trend
}: {
    label: string;
    value: string;
    subtitle?: string;
    icon?: React.ElementType;
    trend?: "up" | "down" | "neutral";
}) => (
    <Card className="p-4 hover:shadow-md transition-shadow">
        <div className="flex items-start justify-between">
            <div className="flex-1">
                <div className="text-sm text-muted-foreground mb-1">{label}</div>
                <div className="text-2xl font-bold">{value}</div>
                {subtitle && (
                    <div className="text-xs text-muted-foreground mt-1">{subtitle}</div>
                )}
            </div>
            {Icon && (
                <div className={`p-2 rounded-lg ${trend === "up" ? "bg-green-100 text-green-600 dark:bg-green-900 dark:text-green-200" :
                    trend === "down" ? "bg-red-100 text-red-600 dark:bg-red-900 dark:text-red-200" :
                        "bg-primary/10 text-primary"
                    }`}>
                    <Icon className="h-5 w-5" />
                </div>
            )}
        </div>
    </Card>
);

const ClientsKpis = () => {
    const [kpis, setKpis] = useState<KpiData>({
        total: 0,
        active: 0,
        new30Days: 0,
        frequent: 0,
        frequentPercentage: 0,
        inactiveOver90Days: 0,
        totalPendingBalance: 0,
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadKpis = async () => {
            try {
                const { data } = await clientsService.list();
                const now = new Date();
                const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
                const ninetyDaysAgo = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);

                const activeClients = data.filter((c: Client) => c.active);
                const frequentClients = data.filter((c: Client) => c.type === "Frecuente");
                const newClients = data.filter((c: Client) => new Date(c.createdAt) >= thirtyDaysAgo);
                const inactiveClients = data.filter((c: Client) => {
                    if (!c.lastPurchaseDate) return true;
                    return new Date(c.lastPurchaseDate) < ninetyDaysAgo;
                });
                const totalPending = data.reduce((sum: number, c: Client) => sum + (c.pendingBalance || 0), 0);

                setKpis({
                    total: data.length,
                    active: activeClients.length,
                    new30Days: newClients.length,
                    frequent: frequentClients.length,
                    frequentPercentage: data.length > 0 ? Math.round((frequentClients.length / data.length) * 100) : 0,
                    inactiveOver90Days: inactiveClients.length,
                    totalPendingBalance: totalPending,
                });
            } catch (error) {
                console.error("Error cargando KPIs:", error);
            } finally {
                setLoading(false);
            }
        };

        loadKpis();
    }, []);

    if (loading) {
        return (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
                {[...Array(5)].map((_, i) => (
                    <Card key={i} className="p-4 animate-pulse">
                        <div className="h-4 bg-muted rounded w-24 mb-2"></div>
                        <div className="h-8 bg-muted rounded w-16"></div>
                    </Card>
                ))}
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
            <KPI
                label="Total clientes"
                value={kpis.total.toString()}
                subtitle={`${kpis.active} activos`}
                icon={Users}
            />
            <KPI
                label="Nuevos (30d)"
                value={kpis.new30Days.toString()}
                subtitle="Este mes"
                icon={TrendingUp}
                trend="up"
            />
            <KPI
                label="Clientes frecuentes"
                value={`${kpis.frequentPercentage}%`}
                subtitle={`${kpis.frequent} clientes`}
                icon={Star}
                trend="neutral"
            />
            <KPI
                label="Sin compras +90d"
                value={kpis.inactiveOver90Days.toString()}
                subtitle="Requieren reactivación"
                icon={Clock}
                trend="down"
            />
            <KPI
                label="Saldo pendiente"
                value={`$${kpis.totalPendingBalance.toLocaleString()}`}
                subtitle="Por cobrar"
                icon={DollarSign}
                trend={kpis.totalPendingBalance > 0 ? "neutral" : "up"}
            />
        </div>
    );
};

export default ClientsKpis;
