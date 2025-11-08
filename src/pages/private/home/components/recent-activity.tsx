import { Clock, Package, AlertCircle, CheckCircle } from "lucide-react"

const activities = [
  {
    icon: CheckCircle,
    color: "bg-green-500",
    title: "Venta Registrada",
    description: "Orden #ORD1028 completada",
    time: "Hace 5 min",
  },
  {
    icon: Package,
    color: "bg-blue-500",
    title: "Inventario Actualizado",
    description: "10 unidades de Pollo agregadas",
    time: "Hace 15 min",
  },
  {
    icon: AlertCircle,
    color: "bg-orange-500",
    title: "Alerta de Stock",
    description: "Pan bajo en existencias (5 unid.)",
    time: "Hace 1 hora",
  },
  {
    icon: CheckCircle,
    color: "bg-green-500",
    title: "Pago Recibido",
    description: "Transferencia de $1,250",
    time: "Hace 2 horas",
  },
  {
    icon: Package,
    color: "bg-blue-500",
    title: "Nuevo Producto",
    description: "Ensalada Mediterránea añadida",
    time: "Hace 3 horas",
  },
]

export function RecentActivity() {
  return (
    <div className="bg-card rounded-xl p-6 border border-border shadow-sm h-full flex flex-col">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-purple-500 rounded-lg flex items-center justify-center">
            <Clock className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-card-foreground">Actividad Reciente</h3>
            <p className="text-sm text-muted-foreground">Últimos movimientos</p>
          </div>
        </div>
      </div>

      <div className="space-y-4 flex-1 overflow-y-auto">
        {activities.map((activity, index) => {
          const Icon = activity.icon
          return (
            <div key={index} className="flex items-start gap-3 pb-4 border-b border-border last:border-0 last:pb-0">
              <div className={`${activity.color} w-10 h-10 rounded-lg flex items-center justify-center shrink-0`}>
                <Icon className="w-5 h-5 text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-card-foreground mb-1">{activity.title}</p>
                <p className="text-sm text-muted-foreground mb-1 line-clamp-1">{activity.description}</p>
                <p className="text-xs text-muted-foreground">{activity.time}</p>
              </div>
            </div>
          )
        })}
      </div>

      <button className="w-full mt-4 py-2.5 text-sm font-medium text-primary hover:bg-accent rounded-lg transition-colors border border-border">
        Ver todas las actividades
      </button>
    </div>
  )
}
