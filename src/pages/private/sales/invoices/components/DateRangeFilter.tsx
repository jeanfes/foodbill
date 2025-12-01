import { useState } from 'react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { cn } from '@/lib/utils';
import { Calendar as CalendarIcon, X } from 'lucide-react';

export interface DateRange {
    from?: Date;
    to?: Date;
}

interface Props {
    value: DateRange;
    onChange: (range: DateRange) => void;
    disabled?: boolean;
}

export function DateRangeFilter({ value, onChange, disabled }: Props) {
    const [open, setOpen] = useState(false);

    const label = value.from && value.to
        ? `${value.from.toLocaleDateString()} – ${value.to.toLocaleDateString()}`
        : value.from
            ? `${value.from.toLocaleDateString()} – …`
            : 'Rango de fechas';

    return (
        <div className="flex items-center gap-2">
            <Popover open={open} onOpenChange={setOpen}>
                <PopoverTrigger asChild>
                    <Button
                        variant="outline"
                        className={cn('justify-start w-52', !value.from && 'text-muted-foreground')}
                        disabled={disabled}
                    >
                        <CalendarIcon className="h-4 w-4 mr-2" /> {label}
                    </Button>
                </PopoverTrigger>
                <PopoverContent align="start" className="p-2 w-auto" sideOffset={4}>
                    <Calendar
                        mode="range"
                        numberOfMonths={2}
                        selected={value as any}
                        onSelect={(range: any) => {
                            onChange(range || {});
                        }}
                        captionLayout="dropdown"
                        disabled={disabled}
                    />
                    <div className="flex justify-between items-center pt-2 border-t mt-2">
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                                onChange({});
                            }}
                        >
                            <X className="h-4 w-4 mr-1" /> Limpiar
                        </Button>
                        <Button size="sm" onClick={() => setOpen(false)}>Cerrar</Button>
                    </div>
                </PopoverContent>
            </Popover>
        </div>
    );
}
