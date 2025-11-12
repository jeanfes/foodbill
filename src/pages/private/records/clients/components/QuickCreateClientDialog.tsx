import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { clientsService } from "@/services/clientsService";
import { AlertCircle, Loader2, ExternalLink } from "lucide-react";
import { Link } from "react-router-dom";

interface Props {
    open: boolean;
    onOpenChange: (value: boolean) => void;
    onClientCreated?: (clientId: string) => void;
}

interface QuickFormData {
    fullName: string;
    phone: string;
    email: string;
}

interface FormErrors {
    [key: string]: string;
}

const QuickCreateClientDialog = ({ open, onOpenChange, onClientCreated }: Props) => {
    const [saving, setSaving] = useState(false);
    const [errors, setErrors] = useState<FormErrors>({});
    const [createdClientId, setCreatedClientId] = useState<string | null>(null);
    const [form, setForm] = useState<QuickFormData>({
        fullName: "",
        phone: "",
        email: "",
    });

    const update = (field: keyof QuickFormData, value: string) => {
        setForm(f => ({ ...f, [field]: value }));
        if (errors[field]) {
            setErrors(e => ({ ...e, [field]: "" }));
        }
    };

    const validateEmail = (email: string): boolean => {
        if (!email) return true;
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email.toLowerCase());
    };

    const validateForm = (): boolean => {
        const newErrors: FormErrors = {};

        if (!form.fullName.trim()) {
            newErrors.fullName = "El nombre es obligatorio";
        } else if (form.fullName.trim().length < 2) {
            newErrors.fullName = "El nombre debe tener al menos 2 caracteres";
        }

        if (!form.phone && !form.email) {
            newErrors.phone = "Proporciona al menos teléfono o email";
            newErrors.email = "Proporciona al menos teléfono o email";
        }

        if (form.email && !validateEmail(form.email)) {
            newErrors.email = "Email inválido";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async () => {
        if (!validateForm()) return;

        setSaving(true);
        try {
            const created = await clientsService.create({
                fullName: form.fullName.trim(),
                phone: form.phone.trim() || undefined,
                email: form.email.trim().toLowerCase() || undefined,
                type: "Particular",
                documentType: "Otro",
                document: "",
            });

            setCreatedClientId(created.id);

            if (onClientCreated) {
                onClientCreated(created.id);
            }

            // Mostrar mensaje de éxito con opción de completar
            setTimeout(() => {
                setForm({ fullName: "", phone: "", email: "" });
                setCreatedClientId(null);
                onOpenChange(false);
            }, 3000);
        } catch (error) {
            console.error("Error creando cliente:", error);
        } finally {
            setSaving(false);
        }
    };

    const handleClose = () => {
        setForm({ fullName: "", phone: "", email: "" });
        setErrors({});
        setCreatedClientId(null);
        onOpenChange(false);
    };

    return (
        <Dialog open={open} onOpenChange={handleClose}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>Crear cliente rápido</DialogTitle>
                    <DialogDescription>
                        Crea un cliente con los datos básicos. Podrás completar su información más tarde.
                    </DialogDescription>
                </DialogHeader>

                {createdClientId ? (
                    <div className="py-6 text-center space-y-4">
                        <div className="text-green-600 dark:text-green-400 text-lg font-semibold">
                            ✓ Cliente creado exitosamente
                        </div>
                        <div className="space-y-2">
                            <p className="text-sm text-muted-foreground">
                                El cliente ha sido registrado. Puedes continuar con la venta.
                            </p>
                            <Link
                                to={`/records/clients`}
                                className="inline-flex items-center gap-2 text-sm text-primary hover:underline"
                                onClick={handleClose}
                            >
                                <ExternalLink className="h-4 w-4" />
                                Completar información del cliente
                            </Link>
                        </div>
                    </div>
                ) : (
                    <div className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="quick-fullName">Nombre completo *</Label>
                            <Input
                                id="quick-fullName"
                                value={form.fullName}
                                onChange={e => update("fullName", e.target.value)}
                                placeholder="Juan Pérez"
                                autoFocus
                            />
                            {errors.fullName && (
                                <p className="text-sm text-red-600 flex items-center gap-1">
                                    <AlertCircle className="h-3 w-3" />
                                    {errors.fullName}
                                </p>
                            )}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="quick-phone">Teléfono *</Label>
                            <Input
                                id="quick-phone"
                                value={form.phone}
                                onChange={e => update("phone", e.target.value)}
                                placeholder="3001234567"
                            />
                            {errors.phone && (
                                <p className="text-sm text-red-600 flex items-center gap-1">
                                    <AlertCircle className="h-3 w-3" />
                                    {errors.phone}
                                </p>
                            )}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="quick-email">Email (opcional)</Label>
                            <Input
                                id="quick-email"
                                type="email"
                                value={form.email}
                                onChange={e => update("email", e.target.value)}
                                placeholder="correo@ejemplo.com"
                            />
                            {errors.email && (
                                <p className="text-sm text-red-600 flex items-center gap-1">
                                    <AlertCircle className="h-3 w-3" />
                                    {errors.email}
                                </p>
                            )}
                        </div>

                        <div className="bg-muted rounded-lg p-3 text-sm text-muted-foreground">
                            💡 Este cliente se creará como "Particular". Podrás completar más información después.
                        </div>
                    </div>
                )}

                {!createdClientId && (
                    <DialogFooter>
                        <Button variant="outline" onClick={handleClose} disabled={saving}>
                            Cancelar
                        </Button>
                        <Button onClick={handleSubmit} disabled={saving}>
                            {saving && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                            Crear cliente
                        </Button>
                    </DialogFooter>
                )}
            </DialogContent>
        </Dialog>
    );
};

export default QuickCreateClientDialog;
