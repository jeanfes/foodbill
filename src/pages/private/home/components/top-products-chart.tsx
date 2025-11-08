import { Pie, PieChart, Cell, ResponsiveContainer, Legend } from "recharts"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useState } from "react"

const data = [
  { name: "Pollo a la Parrilla", value: 28, color: "#1e3a8a" },
  { name: "Pizza Margarita", value: 22, color: "#3b82f6" },
  { name: "Hamburguesa Clásica", value: 18, color: "#60a5fa" },
  { name: "Ensalada César", value: 15, color: "#d97706" },
  { name: "Pasta Carbonara", value: 12, color: "#fbbf24" },
  { name: "Otros", value: 5, color: "#9ca3af" },
]

export function TopProductsChart() {
  const [period, setPeriod] = useState("current")

  return (
    <div className="bg-card rounded-xl p-6 border border-border shadow-sm">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-card-foreground">Productos Más Vendidos</h3>
          <p className="text-sm text-muted-foreground">Distribución por categoría</p>
        </div>
        <Select value={period} onValueChange={setPeriod}>
          <SelectTrigger className="w-36">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="current">Este Mes</SelectItem>
            <SelectItem value="previous">Mes Anterior</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <ChartContainer
        config={{
          value: {
            label: "Porcentaje",
          },
        }}
        className="h-[300px] w-full"
      >
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <ChartTooltip content={<ChartTooltipContent />} />
            <Pie data={data} cx="50%" cy="50%" innerRadius={60} outerRadius={100} paddingAngle={2} dataKey="value">
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </ChartContainer>
    </div>
  )
}
