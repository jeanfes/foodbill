import { useMemo, useState } from "react";
import { useOrdersMock } from "@/hooks/useOrdersMock";
import type { OrderItemStatus } from "@/interfaces/order";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";

function StatusBadge({ status }: { status: OrderItemStatus }) {
    const map: Record<OrderItemStatus, string> = {
        queued: "secondary",
        preparing: "default",
        ready: "success",
        served: "outline",
        cancelled: "destructive",
    } as const;
    return <Badge variant={(map[status] as any) ?? "secondary"}>{status}</Badge>;
}

export default function OrdersBoard() {
    const { ordersByStation, updateItemStatus } = useOrdersMock();
    const [tab, setTab] = useState<"KITCHEN" | "BAR">("KITCHEN");
    const data = useMemo(() => ordersByStation(tab), [tab, ordersByStation]);

    // handled by advanceStatus helper

    return (
        <div className="container mx-auto p-6 space-y-4">
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold">Órdenes</h1>
            </div>

            <Tabs value={tab} onValueChange={(v) => setTab(v as any)}>
                <TabsList>
                    <TabsTrigger value="KITCHEN">Cocina</TabsTrigger>
                    <TabsTrigger value="BAR">Barra</TabsTrigger>
                </TabsList>
                <TabsContent value="KITCHEN">
                    <StationBoard stationName="Cocina" data={data} onAdvance={updateItemStatus} />
                </TabsContent>
                <TabsContent value="BAR">
                    <StationBoard stationName="Barra" data={data} onAdvance={updateItemStatus} />
                </TabsContent>
            </Tabs>
        </div>
    );
}

function StationBoard({
    stationName,
    data,
    onAdvance,
}: {
    stationName: string;
    data: Array<any>;
    onAdvance: (orderId: string, itemId: string, status: OrderItemStatus) => void;
}) {
    return (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {data.map((o) => (
                <Card key={o.id} className="overflow-hidden">
                    <CardHeader>
                        <CardTitle className="flex items-center justify-between">
                            <span>{o.table?.name ?? o.customerName ?? "Sin mesa"}</span>
                            <Badge>{stationName}</Badge>
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <ScrollArea className="h-56 pr-4">
                            <div className="space-y-3">
                                {o.stationItems.map((it: any) => (
                                    <div key={it.id} className="flex items-center justify-between border rounded-md p-2">
                                        <div>
                                            <div className="font-medium">
                                                {it.qty}× {it.name}
                                            </div>
                                            <div className="text-xs text-muted-foreground">
                                                <StatusBadge status={it.status} />
                                            </div>
                                        </div>
                                        <div className="flex gap-2">
                                            {it.status !== "served" && (
                                                <Button
                                                    size="sm"
                                                    onClick={() => onAdvance(o.id, it.id, advanceStatus(it.status))}
                                                >
                                                    Avanzar
                                                </Button>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </ScrollArea>
                    </CardContent>
                </Card>
            ))}
        </div>
    );
}

function advanceStatus(s: OrderItemStatus): OrderItemStatus {
    switch (s) {
        case "queued":
            return "preparing";
        case "preparing":
            return "ready";
        case "ready":
            return "served";
        default:
            return s;
    }
}
