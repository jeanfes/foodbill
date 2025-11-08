import { Bar, BarChart, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from "recharts"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useState } from "react"

const data = [
  { day: "Lun", ventas: 8500 },
  { day: "Mar", ventas: 9200 },
  { day: "Mie", ventas: 10800 },
  { day: "Jue", ventas: 12400 },
  { day: "Vie", ventas: 15600 },
  { day: "Sab", ventas: 18900 },
  { day: "Dom", ventas: 14200 },
]

export function SalesByDayChart() {
  const [period, setPeriod] = useState("current")

  return (
    <div className="bg-card rounded-xl p-6 border border-border shadow-sm">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-card-foreground">Ventas por Día</h3>
          <p className="text-sm text-muted-foreground">Semana actual</p>
        </div>
        <Select value={period} onValueChange={setPeriod}>
          <SelectTrigger className="w-40">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="current">Esta Semana</SelectItem>
            <SelectItem value="previous">Semana Anterior</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <ChartContainer
        config={{
          ventas: {
            label: "Ventas",
            color: "hsl(250, 50%, 25%)",
          },
        }}
        className="h-[300px] w-full"
      >
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis dataKey="day" tick={{ fill: "#6b7280", fontSize: 12 }} />
            <YAxis tick={{ fill: "#6b7280", fontSize: 12 }} />
            <ChartTooltip content={<ChartTooltipContent />} />
            <Bar dataKey="ventas" fill="var(--color-ventas)" radius={[8, 8, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </ChartContainer>
    </div>
  )
}
