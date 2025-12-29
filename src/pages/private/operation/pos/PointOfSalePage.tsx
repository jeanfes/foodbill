import { useMemo, useState } from "react";
import { useProductsMock } from "@/hooks/useProductsMock";
import { useOrdersMock } from "@/hooks/useOrdersMock";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

type CartItem = { productId: string; name: string; unitPrice: number; qty: number; categoryName?: string };

export default function PointOfSalePage() {
    const { filteredProducts } = useProductsMock();
    const { createOrder } = useOrdersMock();
    const [cart, setCart] = useState<Record<string, CartItem>>({});

    const products = useMemo(() => filteredProducts({ page: 0, pageSize: 12 }), [filteredProducts]);
    const total = Object.values(cart).reduce((a, c) => a + c.unitPrice * c.qty, 0);

    const addToCart = (p: any) => {
        setCart((prev) => {
            const existing = prev[p.id];
            const next: CartItem = existing
                ? { ...existing, qty: existing.qty + 1 }
                : { productId: p.id, name: p.name, unitPrice: p.price ?? 0, qty: 1, categoryName: p.categoryName };
            return { ...prev, [p.id]: next };
        });
    };

    const removeFromCart = (id: string) => {
        setCart((prev) => {
            const copy = { ...prev } as Record<string, CartItem>;
            delete copy[id];
            return copy;
        });
    };

    const sendOrder = () => {
        const items = Object.values(cart).map((c) => ({
            productId: c.productId,
            name: c.name,
            qty: c.qty,
            unitPrice: c.unitPrice,
            station: (c.categoryName === "Bebidas" ? "BAR" : "KITCHEN") as "BAR" | "KITCHEN",
        }));
        if (!items.length) return;
        createOrder({ items });
        setCart({});
    };

    return (
        <div className="container mx-auto p-6 grid gap-6 md:grid-cols-3">
            <div className="md:col-span-2 space-y-4">
                <h1 className="text-3xl font-bold">Punto de Venta</h1>
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {products.map((p: any) => (
                        <Card key={p.id}>
                            <CardHeader>
                                <CardTitle className="flex items-center justify-between text-base">
                                    <span>{p.name}</span>
                                    <Badge>${p.price?.toFixed(2)}</Badge>
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="flex justify-between items-center">
                                <div className="text-xs text-muted-foreground">{p.categoryName}</div>
                                <Button size="sm" onClick={() => addToCart(p)}>Agregar</Button>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>
            <div className="space-y-4">
                <Card>
                    <CardHeader>
                        <CardTitle>Carrito</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-3">
                            {Object.values(cart).length === 0 && (
                                <div className="text-sm text-muted-foreground">Sin productos</div>
                            )}
                            {Object.values(cart).map((c) => (
                                <div key={c.productId} className="flex items-center justify-between">
                                    <div>
                                        <div className="font-medium">{c.qty}× {c.name}</div>
                                        <div className="text-xs text-muted-foreground">${c.unitPrice.toFixed(2)}</div>
                                    </div>
                                    <Button size="sm" variant="destructive" onClick={() => removeFromCart(c.productId)}>Quitar</Button>
                                </div>
                            ))}
                        </div>
                        <div className="flex items-center justify-between mt-4">
                            <div className="font-semibold">Total</div>
                            <div className="font-bold">${total.toFixed(2)}</div>
                        </div>
                        <Button className="w-full mt-4" onClick={sendOrder} disabled={Object.values(cart).length === 0}>
                            Enviar orden
                        </Button>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
