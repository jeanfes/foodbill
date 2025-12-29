import type { Order } from "@/interfaces/order";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function OrderDetail({ order }: { order: Order }) {
    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center justify-between">
                    <span>Orden #{order.id}</span>
                    <Badge>{order.status}</Badge>
                </CardTitle>
            </CardHeader>
            <CardContent>
                <div className="space-y-2">
                    {order.items.map((it) => (
                        <div key={it.id} className="flex items-center justify-between">
                            <div>
                                <div className="font-medium">{it.qty}× {it.name}</div>
                                <div className="text-xs text-muted-foreground">{it.station} · {it.status}</div>
                            </div>
                            <div className="text-sm font-semibold">${(it.unitPrice * it.qty).toFixed(2)}</div>
                        </div>
                    ))}
                </div>
            </CardContent>
        </Card>
    );
}
