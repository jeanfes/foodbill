import { ArrowUpIcon, ArrowDownIcon, DollarSign, TrendingUp, Calendar, Wallet } from "lucide-react"

const kpiData = [
  {
    title: "Ventas del Día",
    value: "$12,450",
    change: "+8.2%",
    trend: "up",
    icon: DollarSign,
    color: "bg-blue-500",
  },
  {
    title: "Ventas Semanales",
    value: "$68,340",
    change: "+12.5%",
    trend: "up",
    icon: TrendingUp,
    color: "bg-green-500",
  },
  {
    title: "Ventas Mensuales",
    value: "$284,850",
    change: "+5.8%",
    trend: "up",
    icon: Calendar,
    color: "bg-purple-500",
  },
  {
    title: "Gastos del Día",
    value: "$3,240",
    change: "-2.1%",
    trend: "down",
    icon: Wallet,
    color: "bg-orange-500",
  },
  {
    title: "Gastos Semanales",
    value: "$18,920",
    change: "+1.3%",
    trend: "up",
    icon: Wallet,
    color: "bg-red-500",
  },
]

export function KpiCards() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
      {kpiData.map((kpi) => {
        const Icon = kpi.icon
        return (
          <div
            key={kpi.title}
            className="bg-card rounded-xl p-6 border border-border shadow-sm hover:shadow-md transition-shadow"
          >
            <div className="flex items-start justify-between mb-4">
              <div className={`${kpi.color} w-12 h-12 rounded-lg flex items-center justify-center`}>
                <Icon className="w-6 h-6 text-white" />
              </div>
            </div>
            <p className="text-sm text-muted-foreground mb-1">{kpi.title}</p>
            <p className="text-2xl font-bold text-card-foreground mb-2">{kpi.value}</p>
            <div className="flex items-center gap-1">
              {kpi.trend === "up" ? (
                <ArrowUpIcon className="w-4 h-4 text-green-600" />
              ) : (
                <ArrowDownIcon className="w-4 h-4 text-red-600" />
              )}
              <span className={`text-sm font-medium ${kpi.trend === "up" ? "text-green-600" : "text-red-600"}`}>
                {kpi.change}
              </span>
              <span className="text-sm text-muted-foreground ml-1">vs periodo anterior</span>
            </div>
          </div>
        )
      })}
    </div>
  )
}
