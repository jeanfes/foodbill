import * as React from "react";
import { cn } from "@/lib/utils";

type TabsContextType = {
    value: string;
    setValue: (v: string) => void;
};

const TabsContext = React.createContext<TabsContextType | null>(null);

export interface TabsProps extends React.HTMLAttributes<HTMLDivElement> {
    defaultValue?: string;
    value?: string;
    onValueChange?: (v: string) => void;
}

export function Tabs({ defaultValue, value: valueProp, onValueChange, className, ...props }: TabsProps) {
    const [internal, setInternal] = React.useState(defaultValue ?? "");
    const value = valueProp ?? internal;
    const setValue = (v: string) => {
        if (onValueChange) onValueChange(v);
        setInternal(v);
    };
    return (
        <TabsContext.Provider value={{ value, setValue }}>
            <div className={cn("w-full", className)} {...props} />
        </TabsContext.Provider>
    );
}

export function TabsList({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
    return <div className={cn("inline-flex h-9 items-center justify-center rounded-lg bg-muted p-1 text-muted-foreground", className)} {...props} />;
}

export interface TabsTriggerProps extends React.ButtonHTMLAttributes<HTMLButtonElement> { value: string }
export function TabsTrigger({ value, className, ...props }: TabsTriggerProps) {
    const ctx = React.useContext(TabsContext)!;
    const active = ctx.value === value;
    return (
        <button
            type="button"
            onClick={() => ctx.setValue(value)}
            data-state={active ? "active" : "inactive"}
            className={cn(
                "inline-flex items-center justify-center whitespace-nowrap rounded-md px-3 py-1 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
                active ? "bg-background text-foreground shadow" : "",
                className,
            )}
            {...props}
        />
    );
}

export interface TabsContentProps extends React.HTMLAttributes<HTMLDivElement> { value: string }
export function TabsContent({ value, className, ...props }: TabsContentProps) {
    const ctx = React.useContext(TabsContext)!;
    if (ctx.value !== value) return null;
    return <div className={cn("mt-4", className)} {...props} />;
}
