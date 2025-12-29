import { useOrdersMock } from "@/hooks/useOrdersMock";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { OrderItemStatus } from "@/interfaces/order";

export default function KitchenPage() {
    const { ordersByStation, updateItemStatus } = useOrdersMock();
    const data = ordersByStation("KITCHEN");

    const advance = (s: OrderItemStatus): OrderItemStatus => {
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
    };

    return (
        <div className="container mx-auto p-6 space-y-4">
            <h1 className="text-3xl font-bold">Cocina</h1>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {data.map((o: any) => (
                    <Card key={o.id}>
                        <CardHeader>
                            <CardTitle className="flex items-center justify-between text-base">
                                <span>{o.table?.name ?? o.customerName ?? "Sin mesa"}</span>
                                <Badge>Kitchen</Badge>
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-2">
                            {o.stationItems.map((it: any) => (
                                <div key={it.id} className="flex items-center justify-between border rounded-md p-2">
                                    <div>
                                        <div className="font-medium">{it.qty}× {it.name}</div>
                                        <div className="text-xs text-muted-foreground">{it.status}</div>
                                    </div>
                                    {it.status !== "served" && (
                                        <Button size="sm" onClick={() => updateItemStatus(o.id, it.id, advance(it.status))}>Avanzar</Button>
                                    )}
                                </div>
                            ))}
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    );
}
