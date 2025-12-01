import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { useThemeStore } from "@/store/themeStore";
import { Monitor, Moon, Sun } from "lucide-react";

interface SettingsDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export const SettingsDialog = ({ open, onOpenChange }: SettingsDialogProps) => {
    const { theme, setTheme } = useThemeStore();

    const themes = [
        {
            value: "light" as const,
            label: "Claro",
            icon: Sun,
            description: "Tema claro para entornos con buena iluminación",
        },
        {
            value: "dark" as const,
            label: "Oscuro",
            icon: Moon,
            description: "Tema oscuro para reducir fatiga visual",
        },
        {
            value: "system" as const,
            label: "Sistema",
            icon: Monitor,
            description: "Adapta al tema de tu sistema operativo",
        },
    ];

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>Ajustes</DialogTitle>
                    <DialogDescription>
                        Personaliza la apariencia y configuración de tu aplicación
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-6 py-4">
                    <div className="space-y-4">
                        <div>
                            <h3 className="text-base font-semibold mb-1">Apariencia</h3>
                            <p className="text-sm text-muted-foreground">
                                Selecciona el tema que prefieras para la aplicación
                            </p>
                        </div>
                        <div className="space-y-3">
                            <Label className="text-sm">Tema de la aplicación</Label>
                            <div className="grid grid-cols-1 gap-3">
                                {themes.map((themeOption) => {
                                    const Icon = themeOption.icon;
                                    const isSelected = theme === themeOption.value;

                                    return (
                                        <button
                                            key={themeOption.value}
                                            onClick={() => setTheme(themeOption.value)}
                                            className={`
                                                relative flex items-center gap-4 rounded-lg border-2 p-4 
                                                transition-all hover:bg-accent/50
                                                ${isSelected
                                                    ? "border-primary bg-primary/5"
                                                    : "border-border bg-card hover:border-muted-foreground/50"
                                                }
                                            `}
                                        >
                                            <Icon className={`h-5 w-5 shrink-0 ${isSelected ? "text-primary" : "text-muted-foreground"}`} />
                                            <div className="flex-1 text-left">
                                                <p className={`font-semibold text-sm ${isSelected ? "text-primary" : "text-foreground"}`}>
                                                    {themeOption.label}
                                                </p>
                                                <p className="text-xs text-muted-foreground mt-1">
                                                    {themeOption.description}
                                                </p>
                                            </div>
                                            {isSelected && (
                                                <div className="h-2 w-2 rounded-full bg-primary shrink-0" />
                                            )}
                                        </button>
                                    );
                                })}
                            </div>
                        </div>
                    </div>

                    <div className="border-t pt-4 space-y-3">
                        <div>
                            <h3 className="text-base font-semibold mb-1">Información</h3>
                            <p className="text-sm text-muted-foreground">
                                Detalles sobre la versión y configuración actual
                            </p>
                        </div>
                        <div className="space-y-2">
                            <div className="flex justify-between items-center py-2">
                                <span className="text-sm text-muted-foreground">Versión</span>
                                <span className="text-sm font-medium">1.0.0</span>
                            </div>
                            <div className="flex justify-between items-center py-2">
                                <span className="text-sm text-muted-foreground">Tema activo</span>
                                <span className="text-sm font-medium capitalize">{theme}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
};
