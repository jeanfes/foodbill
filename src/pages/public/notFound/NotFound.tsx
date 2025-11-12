import React from "react";
import { Link } from "react-router-dom";
import LogoTransparent from "@/assets/images/logoTransparent.png";
import NotFoundIcon from "@/assets/icons/NotFoundIcon";
import { useAuthStore } from "@/store/authStore";
import { Button } from "@/components/ui/button";

const NotFound: React.FC = () => {
    const isAuth = useAuthStore((state) => state.isAuth);
    const homeRoute = isAuth ? "/home" : "/login";
    const buttonText = isAuth ? "Volver al inicio" : "Ir al login";

    return (
        <div className="min-h-screen bg-background flex items-center justify-center p-6">
            <main className="max-w-4xl w-full bg-card/80 dark:bg-card/70 backdrop-blur-md border border-border rounded-2xl shadow-lg p-8 md:p-12 flex flex-col md:flex-row items-center gap-8 transition-colors">
                <div className="w-full md:w-1/2 flex flex-col items-center md:items-start text-center md:text-left">
                    <div className="flex items-center gap-3 mb-6">
                        <img src={LogoTransparent} alt="logo" className="w-14 h-14 object-contain" />
                        <span className="text-xl font-semibold">FoodBill</span>
                    </div>

                    <h1 className="text-6xl md:text-7xl font-extrabold tracking-tight text-primary">404</h1>
                    <h2 className="mt-2 text-2xl md:text-3xl font-semibold text-foreground">Página no encontrada</h2>
                    <p className="mt-4 text-muted-foreground max-w-lg">
                        Lo sentimos — la página que buscas no existe o fue movida. Puedes volver al inicio o ponerte en
                        contacto con soporte si crees que esto es un error.
                    </p>

                    <div className="mt-6 flex flex-col sm:flex-row gap-3">
                        <Button asChild>
                            <Link to={homeRoute}>
                                {buttonText}
                            </Link>
                        </Button>
                        <Button asChild variant="outline">
                            <a href="mailto:soporte@tudominio.com">
                                Contactar soporte
                            </a>
                        </Button>
                    </div>
                </div>

                <aside className="w-full md:w-1/2 flex items-center justify-center">
                    <div className="w-54 h-54 rounded-full bg-primary/10 dark:bg-primary/15 flex items-center justify-center shadow-xl text-primary">
                        <NotFoundIcon width={160} height={160} />
                    </div>
                </aside>
            </main>
        </div>
    );
};

export default NotFound;