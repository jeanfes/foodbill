const HomePage = () => {
    return (
        <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white p-6 rounded-lg border border-border">
                    <p className="text-sm text-muted-foreground mb-2">Total de pedidos</p>
                    <p className="text-3xl font-bold">48,652</p>
                </div>
                <div className="bg-white p-6 rounded-lg border border-border">
                    <p className="text-sm text-muted-foreground mb-2">Total de clientes</p>
                    <p className="text-3xl font-bold">1248</p>
                </div>
                <div className="bg-white p-6 rounded-lg border border-border">
                    <p className="text-sm text-muted-foreground mb-2">Ingresos totales</p>
                    <p className="text-3xl font-bold">$215,860</p>
                </div>
            </div>
        </div>
    )
}

export default HomePage
