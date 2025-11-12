import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Permission } from "@/interfaces/role";
import { Can } from "@/components/Can";
import { clientsService } from "@/services/clientsService";
import { AlertCircle, Loader2, AlertTriangle } from "lucide-react";
import type { Client, ClientType } from "../ClientsPage";

interface Props {
    open: boolean;
    onOpenChange: (value: boolean) => void;
    clientId?: string;
}

interface FormData {
    documentType: "CC" | "NIT" | "CE" | "PP" | "Otro" | "";
    document: string;
    fullName: string;
    companyName: string;
    email: string;
    phone: string;
    phone2: string;
    address: string;
    neighborhood: string;
    type: ClientType | "";
    notes: string;
    tags: string;
}

interface FormErrors {
    [key: string]: string;
}

interface PotentialDuplicate {
    id: string;
    fullName: string;
    document: string;
    phone?: string;
    matchReason: string;
}

const ClientFormDialog = ({ open, onOpenChange, clientId }: Props) => {
    const isEdit = !!clientId;
    const [loading, setLoading] = useState(false);
    const [saving, setSaving] = useState(false);
    const [errors, setErrors] = useState<FormErrors>({});
    const [potentialDuplicates, setPotentialDuplicates] = useState<PotentialDuplicate[]>([]);
    const [showDuplicateWarning, setShowDuplicateWarning] = useState(false);
    const [form, setForm] = useState<FormData>({
        documentType: "",
        document: "",
        fullName: "",
        companyName: "",
        email: "",
        phone: "",
        phone2: "",
        address: "",
        neighborhood: "",
        type: "",
        notes: "",
        tags: "",
    });

    useEffect(() => {
        if (open && clientId) {
            setLoading(true);
            clientsService.get(clientId).then(client => {
                if (client) {
                    setForm({
                        documentType: client.documentType,
                        document: client.document,
                        fullName: client.fullName,
                        companyName: client.companyName || "",
                        email: client.email || "",
                        phone: client.phone || "",
                        phone2: client.phone2 || "",
                        address: client.address || "",
                        neighborhood: client.neighborhood || "",
                        type: client.type,
                        notes: client.notes || "",
                        tags: client.tags?.join(", ") || "",
                    });
                }
                setLoading(false);
            });
        } else if (open && !clientId) {
            // Reset form para crear nuevo
            setForm({
                documentType: "",
                document: "",
                fullName: "",
                companyName: "",
                email: "",
                phone: "",
                phone2: "",
                address: "",
                neighborhood: "",
                type: "Particular",
                notes: "",
                tags: "",
            });
            setErrors({});
            setPotentialDuplicates([]);
            setShowDuplicateWarning(false);
        }
    }, [open, clientId]);

    const update = (field: keyof FormData, value: string) => {
        setForm(f => ({ ...f, [field]: value }));
        // Limpiar error del campo al editar
        if (errors[field]) {
            setErrors(e => ({ ...e, [field]: "" }));
        }
    };

    const validateEmail = (email: string): boolean => {
        if (!email) return true; // Email es opcional
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email.toLowerCase());
    };

    const validatePhone = (phone: string): boolean => {
        if (!phone) return true; // Teléfono es opcional si hay email
        const cleaned = phone.replace(/\D/g, "");
        return cleaned.length >= 7 && cleaned.length <= 15;
    };

    const validateForm = (): boolean => {
        const newErrors: FormErrors = {};

        // Nombre obligatorio
        if (!form.fullName.trim()) {
            newErrors.fullName = "El nombre es obligatorio";
        } else if (form.fullName.trim().length < 2) {
            newErrors.fullName = "El nombre debe tener al menos 2 caracteres";
        }

        // Al menos teléfono o email
        if (!form.phone && !form.email) {
            newErrors.phone = "Debe proporcionar al menos un teléfono o email";
            newErrors.email = "Debe proporcionar al menos un teléfono o email";
        }

        // Validar email si se proporciona
        if (form.email && !validateEmail(form.email)) {
            newErrors.email = "Email inválido";
        }

        // Validar teléfono si se proporciona
        if (form.phone && !validatePhone(form.phone)) {
            newErrors.phone = "Teléfono inválido (7-15 dígitos)";
        }

        // Si es corporativo, exigir NIT y razón social
        if (form.type === "Corporativo") {
            if (!form.document.trim()) {
                newErrors.document = "El NIT es obligatorio para clientes corporativos";
            }
            if (!form.companyName.trim()) {
                newErrors.companyName = "La razón social es obligatoria para clientes corporativos";
            }
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const checkDuplicates = async () => {
        if (isEdit) return []; // No buscar duplicados al editar

        const { data } = await clientsService.list();
        const duplicates: PotentialDuplicate[] = [];

        data.forEach((client: Client) => {
            const reasons: string[] = [];

            if (form.fullName && client.fullName.toLowerCase() === form.fullName.toLowerCase()) {
                reasons.push("mismo nombre");
            }

            if (form.document && client.document === form.document) {
                reasons.push("mismo documento");
            }

            if (form.phone && client.phone === form.phone) {
                reasons.push("mismo teléfono");
            }

            if (form.email && client.email?.toLowerCase() === form.email.toLowerCase()) {
                reasons.push("mismo email");
            }

            if (reasons.length > 0) {
                duplicates.push({
                    id: client.id,
                    fullName: client.fullName,
                    document: client.document,
                    phone: client.phone,
                    matchReason: reasons.join(", "),
                });
            }
        });

        return duplicates;
    };

    const handleSubmit = async () => {
        if (!validateForm()) return;

        // Buscar duplicados antes de guardar
        const duplicates = await checkDuplicates();
        if (duplicates.length > 0 && !showDuplicateWarning) {
            setPotentialDuplicates(duplicates);
            setShowDuplicateWarning(true);
            return;
        }

        setSaving(true);
        try {
            const payload = {
                documentType: form.documentType || "Otro",
                document: form.document,
                fullName: form.fullName.trim(),
                companyName: form.companyName.trim() || undefined,
                email: form.email.trim().toLowerCase() || undefined,
                phone: form.phone.trim() || undefined,
                phone2: form.phone2.trim() || undefined,
                address: form.address.trim() || undefined,
                neighborhood: form.neighborhood.trim() || undefined,
                type: (form.type || "Particular") as ClientType,
                notes: form.notes.trim() || undefined,
                tags: form.tags ? form.tags.split(",").map(t => t.trim()).filter(Boolean) : [],
            };

            if (isEdit && clientId) {
                await clientsService.update(clientId, payload);
            } else {
                await clientsService.create(payload);
            }

            onOpenChange(false);
            // TODO: Mostrar notificación de éxito y recargar lista
        } catch (error) {
            console.error("Error guardando cliente:", error);
            // TODO: Mostrar notificación de error
        } finally {
            setSaving(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>{isEdit ? "Editar cliente" : "Nuevo cliente"}</DialogTitle>
                    <DialogDescription>
                        {isEdit ? "Actualiza la información del cliente" : "Completa los datos del nuevo cliente. Los campos marcados con * son obligatorios."}
                    </DialogDescription>
                </DialogHeader>

                {loading ? (
                    <div className="flex items-center justify-center py-8">
                        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                    </div>
                ) : (
                    <>
                        {showDuplicateWarning && potentialDuplicates.length > 0 && (
                            <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4">
                                <div className="flex items-start gap-3">
                                    <AlertTriangle className="h-5 w-5 text-yellow-600 dark:text-yellow-500 mt-0.5" />
                                    <div className="flex-1">
                                        <h4 className="font-semibold text-yellow-800 dark:text-yellow-200 mb-2">
                                            Posibles clientes duplicados
                                        </h4>
                                        <div className="space-y-2 text-sm">
                                            {potentialDuplicates.map(dup => (
                                                <div key={dup.id} className="bg-white dark:bg-gray-800 rounded p-2">
                                                    <div className="font-medium">{dup.fullName}</div>
                                                    <div className="text-muted-foreground">
                                                        {dup.document} {dup.phone && `• ${dup.phone}`}
                                                    </div>
                                                    <Badge variant="outline" className="mt-1 text-xs">
                                                        {dup.matchReason}
                                                    </Badge>
                                                </div>
                                            ))}
                                        </div>
                                        <p className="text-sm text-yellow-700 dark:text-yellow-300 mt-3">
                                            ¿Estás seguro de que deseas continuar creando este cliente?
                                        </p>
                                    </div>
                                </div>
                            </div>
                        )}

                        <div className="space-y-4">
                            {/* Tipo de cliente */}
                            <div className="space-y-2">
                                <Label htmlFor="type">Tipo de cliente *</Label>
                                <Select value={form.type} onValueChange={(v) => update("type", v)}>
                                    <SelectTrigger id="type">
                                        <SelectValue placeholder="Seleccionar tipo" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="Particular">Particular</SelectItem>
                                        <SelectItem value="Frecuente">Frecuente</SelectItem>
                                        <SelectItem value="Corporativo">Corporativo</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            {/* Documento */}
                            <div className="grid grid-cols-2 gap-3">
                                <div className="space-y-2">
                                    <Label htmlFor="documentType">Tipo documento</Label>
                                    <Select value={form.documentType} onValueChange={(v) => update("documentType", v)}>
                                        <SelectTrigger id="documentType">
                                            <SelectValue placeholder="Tipo" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="CC">CC</SelectItem>
                                            <SelectItem value="NIT">NIT</SelectItem>
                                            <SelectItem value="CE">CE</SelectItem>
                                            <SelectItem value="PP">Pasaporte</SelectItem>
                                            <SelectItem value="Otro">Otro</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="document">
                                        Número {form.type === "Corporativo" && "*"}
                                    </Label>
                                    <Input
                                        id="document"
                                        value={form.document}
                                        onChange={e => update("document", e.target.value)}
                                        placeholder="Número documento"
                                    />
                                    {errors.document && (
                                        <p className="text-sm text-red-600 flex items-center gap-1">
                                            <AlertCircle className="h-3 w-3" />
                                            {errors.document}
                                        </p>
                                    )}
                                </div>
                            </div>

                            {/* Nombre completo / Razón social */}
                            <div className="grid grid-cols-1 gap-3">
                                <div className="space-y-2">
                                    <Label htmlFor="fullName">Nombre completo *</Label>
                                    <Input
                                        id="fullName"
                                        value={form.fullName}
                                        onChange={e => update("fullName", e.target.value)}
                                        placeholder="Juan Pérez"
                                    />
                                    {errors.fullName && (
                                        <p className="text-sm text-red-600 flex items-center gap-1">
                                            <AlertCircle className="h-3 w-3" />
                                            {errors.fullName}
                                        </p>
                                    )}
                                </div>
                                {form.type === "Corporativo" && (
                                    <div className="space-y-2">
                                        <Label htmlFor="companyName">Razón social *</Label>
                                        <Input
                                            id="companyName"
                                            value={form.companyName}
                                            onChange={e => update("companyName", e.target.value)}
                                            placeholder="Empresa XYZ SAS"
                                        />
                                        {errors.companyName && (
                                            <p className="text-sm text-red-600 flex items-center gap-1">
                                                <AlertCircle className="h-3 w-3" />
                                                {errors.companyName}
                                            </p>
                                        )}
                                    </div>
                                )}
                            </div>

                            {/* Contacto */}
                            <div className="grid grid-cols-2 gap-3">
                                <div className="space-y-2">
                                    <Label htmlFor="phone">Teléfono *</Label>
                                    <Input
                                        id="phone"
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
                                    <Label htmlFor="phone2">Teléfono 2</Label>
                                    <Input
                                        id="phone2"
                                        value={form.phone2}
                                        onChange={e => update("phone2", e.target.value)}
                                        placeholder="6012345678"
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="email">Email *</Label>
                                <Input
                                    id="email"
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

                            {/* Dirección */}
                            <div className="grid grid-cols-1 gap-3">
                                <div className="space-y-2">
                                    <Label htmlFor="address">Dirección</Label>
                                    <Input
                                        id="address"
                                        value={form.address}
                                        onChange={e => update("address", e.target.value)}
                                        placeholder="Calle 123 #45-67"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="neighborhood">Barrio</Label>
                                    <Input
                                        id="neighborhood"
                                        value={form.neighborhood}
                                        onChange={e => update("neighborhood", e.target.value)}
                                        placeholder="Centro"
                                    />
                                </div>
                            </div>

                            {/* Etiquetas */}
                            <div className="space-y-2">
                                <Label htmlFor="tags">Etiquetas</Label>
                                <Input
                                    id="tags"
                                    value={form.tags}
                                    onChange={e => update("tags", e.target.value)}
                                    placeholder="VIP, Mayorista (separadas por coma)"
                                />
                                <p className="text-xs text-muted-foreground">
                                    Separa las etiquetas con comas
                                </p>
                            </div>

                            {/* Notas */}
                            <div className="space-y-2">
                                <Label htmlFor="notes">Notas internas</Label>
                                <Textarea
                                    id="notes"
                                    value={form.notes}
                                    onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => update("notes", e.target.value)}
                                    placeholder="Observaciones sobre el cliente..."
                                    rows={3}
                                />
                            </div>
                        </div>
                    </>
                )}

                <DialogFooter>
                    <Button
                        variant="outline"
                        onClick={() => {
                            setShowDuplicateWarning(false);
                            onOpenChange(false);
                        }}
                        disabled={saving}
                    >
                        Cancelar
                    </Button>
                    {showDuplicateWarning && (
                        <Button
                            variant="outline"
                            onClick={() => setShowDuplicateWarning(false)}
                            disabled={saving}
                        >
                            Revisar
                        </Button>
                    )}
                    <Can permission={isEdit ? Permission.UPDATE_CLIENTS : Permission.CREATE_CLIENTS}>
                        <Button onClick={handleSubmit} disabled={loading || saving}>
                            {saving && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                            {isEdit ? "Guardar cambios" : "Crear cliente"}
                        </Button>
                    </Can>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};

export default ClientFormDialog;
