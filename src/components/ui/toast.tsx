import * as React from "react";
import { CheckCircle, XCircle, AlertCircle, X } from "lucide-react";
import { cn } from "@/lib/utils";

type ToastVariant = "success" | "error" | "warning";

interface Toast {
    id: string;
    message: string;
    variant: ToastVariant;
}

interface ToastContextType {
    show: (message: string, variant?: ToastVariant) => void;
}

const ToastContext = React.createContext<ToastContextType | null>(null);

export function useToast() {
    const ctx = React.useContext(ToastContext);
    if (!ctx) throw new Error("useToast must be used within ToastProvider");
    return ctx;
}

export function ToastProvider({ children }: { children: React.ReactNode }) {
    const [toasts, setToasts] = React.useState<Toast[]>([]);

    const show = (message: string, variant: ToastVariant = "success") => {
        const id = Math.random().toString(36);
        setToasts((prev) => [...prev, { id, message, variant }]);
        setTimeout(() => {
            setToasts((prev) => prev.filter((t) => t.id !== id));
        }, 3000);
    };

    const remove = (id: string) => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
    };

    return (
        <ToastContext.Provider value={{ show }}>
            {children}
            <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2">
                {toasts.map((toast) => (
                    <div
                        key={toast.id}
                        className={cn(
                            "flex items-center gap-3 p-4 rounded-lg shadow-lg border min-w-[300px] max-w-md animate-in slide-in-from-right",
                            toast.variant === "success" && "bg-emerald-50 border-emerald-200 text-emerald-900",
                            toast.variant === "error" && "bg-red-50 border-red-200 text-red-900",
                            toast.variant === "warning" && "bg-amber-50 border-amber-200 text-amber-900",
                        )}
                    >
                        {toast.variant === "success" && <CheckCircle className="h-5 w-5 text-emerald-600" />}
                        {toast.variant === "error" && <XCircle className="h-5 w-5 text-red-600" />}
                        {toast.variant === "warning" && <AlertCircle className="h-5 w-5 text-amber-600" />}
                        <span className="flex-1 text-sm font-medium">{toast.message}</span>
                        <button
                            onClick={() => remove(toast.id)}
                            className="shrink-0 text-current/50 hover:text-current"
                        >
                            <X className="h-4 w-4" />
                        </button>
                    </div>
                ))}
            </div>
        </ToastContext.Provider>
    );
}
