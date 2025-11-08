import * as React from "react"
import { CalendarIcon } from "lucide-react"
import { format } from "date-fns"
import { es } from "date-fns/locale"
import { Calendar } from "@/components/ui/calendar"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { cn } from "@/lib/utils"

export function DateFilter() {
  const [date, setDate] = React.useState<Date>()
  const [period, setPeriod] = React.useState("today")

  return (
    <div className="flex flex-wrap items-center justify-between gap-4 bg-card rounded-xl p-4 border border-border shadow-sm">
      <div className="flex items-center gap-3">
        <CalendarIcon className="w-5 h-5 text-primary" />
        <span className="text-sm font-semibold text-card-foreground">Período:</span>
        <Select value={period} onValueChange={setPeriod}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Seleccionar período" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="today">Hoy</SelectItem>
            <SelectItem value="week">Esta Semana</SelectItem>
            <SelectItem value="month">Este Mes</SelectItem>
            <SelectItem value="custom">Personalizado</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className={cn("justify-start text-left font-normal", !date && "text-muted-foreground")}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {date ? format(date, "PPP", { locale: es }) : <span>Seleccionar fecha</span>}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="end">
          <Calendar mode="single" selected={date} onSelect={setDate} initialFocus locale={es} />
        </PopoverContent>
      </Popover>
    </div>
  )
}
