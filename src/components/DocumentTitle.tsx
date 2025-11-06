import { useEffect } from "react";
import { useLocation } from "react-router-dom";

const routeTitles: Record<string, string> = {
    "/": "FoodBill",
    "/login": "Iniciar sesión | FoodBill",
    "/register": "Crear cuenta | FoodBill",
    "/forgot-password": "Restablecer contraseña | FoodBill",
    "/home": "Home | FoodBill",
    "/orders": "Pedidos | FoodBill",
    "/calendar": "Calendario | FoodBill",
    "/menu": "Menú | FoodBill",
    "/inventory": "Inventario | FoodBill",
    "/reviews": "Reseñas | FoodBill",
    "/not-found": "404 - Página no encontrada | FoodBill",
};

export function DocumentTitle() {
    const location = useLocation();

    useEffect(() => {
        const title = routeTitles[location.pathname] || "FoodBill";
        document.title = title;
    }, [location.pathname]);

    return null;
}
