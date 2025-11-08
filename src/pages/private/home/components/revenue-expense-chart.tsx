import { Line, LineChart, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Legend } from "recharts"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import * as React from "react"

const data = [
  { month: "Ene", ingresos: 45000, gastos: 28000 },
  { month: "Feb", ingresos: 52000, gastos: 31000 },
  { month: "Mar", ingresos: 48000, gastos: 29000 },
  { month: "Abr", ingresos: 61000, gastos: 35000 },
  { month: "May", ingresos: 55000, gastos: 33000 },
  { month: "Jun", ingresos: 67000, gastos: 38000 },
  { month: "Jul", ingresos: 72000, gastos: 41000 },
  { month: "Ago", ingresos: 69000, gastos: 39000 },
]

export function RevenueExpenseChart() {
  const [year, setYear] = React.useState("2025")

  return (
    <div className="bg-card rounded-xl p-6 border border-border shadow-sm">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-card-foreground">Ingresos y Gastos</h3>
          <p className="text-sm text-muted-foreground">Evolución mensual del año</p>
        </div>
        <Select value={year} onValueChange={setYear}>
          <SelectTrigger className="w-[100px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="2025">2025</SelectItem>
            <SelectItem value="2024">2024</SelectItem>
            <SelectItem value="2023">2023</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <ChartContainer
        config={{
          ingresos: {
            label: "Ingresos",
            color: "hsl(250, 50%, 25%)",
          },
          gastos: {
            label: "Gastos",
            color: "hsl(70, 60%, 65%)",
          },
        }}
        className="h-[300px] w-full"
      >
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis dataKey="month" tick={{ fill: "#6b7280", fontSize: 12 }} />
            <YAxis tick={{ fill: "#6b7280", fontSize: 12 }} />
            <ChartTooltip content={<ChartTooltipContent />} />
            <Legend />
            <Line type="monotone" dataKey="ingresos" stroke="var(--color-ingresos)" strokeWidth={2} dot={{ r: 4 }} />
            <Line type="monotone" dataKey="gastos" stroke="var(--color-gastos)" strokeWidth={2} dot={{ r: 4 }} />
          </LineChart>
        </ResponsiveContainer>
      </ChartContainer>
    </div>
  )
}
