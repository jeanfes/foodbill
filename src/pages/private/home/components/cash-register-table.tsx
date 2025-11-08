import { DollarSign } from "lucide-react"

const cashData = [
  { concept: "Ventas en Efectivo", amount: 8240, type: "ingreso" },
  { concept: "Ventas con Tarjeta", amount: 4210, type: "ingreso" },
  { concept: "Compras de Insumos", amount: -2150, type: "egreso" },
  { concept: "Servicios", amount: -890, type: "egreso" },
  { concept: "Otros Gastos", amount: -200, type: "egreso" },
]

const totalIngresos = cashData.filter((item) => item.type === "ingreso").reduce((acc, item) => acc + item.amount, 0)
const totalEgresos = Math.abs(
  cashData.filter((item) => item.type === "egreso").reduce((acc, item) => acc + item.amount, 0),
)
const saldo = totalIngresos - totalEgresos

export function CashRegisterTable() {
  return (
    <div className="bg-card rounded-xl p-6 border border-border shadow-sm">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
          <DollarSign className="w-5 h-5 text-primary-foreground" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-card-foreground">Cuadre de Caja</h3>
          <p className="text-sm text-muted-foreground">Movimientos del día</p>
        </div>
      </div>

      <div className="space-y-3">
        {cashData.map((item, index) => (
          <div key={index} className="flex items-center justify-between py-2 border-b border-border last:border-0">
            <span className="text-sm text-card-foreground">{item.concept}</span>
            <span className={`text-sm font-semibold ${item.type === "ingreso" ? "text-green-600" : "text-red-600"}`}>
              ${Math.abs(item.amount).toLocaleString()}
            </span>
          </div>
        ))}
      </div>

      <div className="mt-6 pt-4 border-t-2 border-primary/20 space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-muted-foreground">Total Ingresos</span>
          <span className="text-sm font-semibold text-green-600">${totalIngresos.toLocaleString()}</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-muted-foreground">Total Egresos</span>
          <span className="text-sm font-semibold text-red-600">${totalEgresos.toLocaleString()}</span>
        </div>
        <div className="flex items-center justify-between pt-2 border-t border-border">
          <span className="text-base font-bold text-card-foreground">Saldo</span>
          <span className="text-lg font-bold text-primary">${saldo.toLocaleString()}</span>
        </div>
      </div>
    </div>
  )
}
