import { useState, useEffect, useMemo } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
// Mantener Label solo si es necesario en otros lugares del archivo
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Permission } from "@/interfaces/role";
import { Can } from "@/components/Can";
import { clientsService } from "@/services/clientsService";
import { Loader2, AlertTriangle } from "lucide-react";
import type { Client, ClientType } from "../ClientsPage";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";

interface Props {
    open: boolean;
    onOpenChange: (value: boolean) => void;
    clientId?: string;
}

// El tipo del formulario se define después del esquema

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
    const schema = useMemo(() => z.object({
        documentType: z.enum(["CC", "NIT", "CE", "PP", "Otro", ""]).default(""),
        document: z.string().optional().or(z.literal("")),
        fullName: z.string().min(2, "El nombre debe tener al menos 2 caracteres"),
        companyName: z.string().optional().or(z.literal("")),
        email: z.string().email("Email inválido").optional().or(z.literal("")),
        phone: z.string().optional().or(z.literal(""))
            .refine((val) => {
                if (!val) return true;
                const cleaned = val.replace(/\D/g, "");
                return cleaned.length >= 7 && cleaned.length <= 15;
            }, "Teléfono inválido (7-15 dígitos)"),
        phone2: z.string().optional().or(z.literal("")),
        address: z.string().optional().or(z.literal("")),
        neighborhood: z.string().optional().or(z.literal("")),
        type: z.custom<ClientType | "">().default("") as z.ZodType<ClientType | "">,
        notes: z.string().optional().or(z.literal("")),
        tags: z.string().optional().or(z.literal("")),
    }).superRefine((val, ctx) => {
        if (!val.phone && !val.email) {
            ctx.addIssue({ code: z.ZodIssueCode.custom, message: "Debe proporcionar al menos un teléfono o email", path: ["phone"] });
            ctx.addIssue({ code: z.ZodIssueCode.custom, message: "Debe proporcionar al menos un teléfono o email", path: ["email"] });
        }
        if (val.type === "Corporativo") {
            if (!val.document?.trim()) {
                ctx.addIssue({ code: z.ZodIssueCode.custom, message: "El NIT es obligatorio para clientes corporativos", path: ["document"] });
            }
            if (!val.companyName?.trim()) {
                ctx.addIssue({ code: z.ZodIssueCode.custom, message: "La razón social es obligatoria para clientes corporativos", path: ["companyName"] });
            }
        }
    }), []);
    type FormData = z.infer<typeof schema>;
    const [potentialDuplicates, setPotentialDuplicates] = useState<PotentialDuplicate[]>([]);
    const [showDuplicateWarning, setShowDuplicateWarning] = useState(false);
    const form = useForm<FormData>({
        resolver: zodResolver(schema) as any,
        mode: "onBlur",
        reValidateMode: "onBlur",
        criteriaMode: "firstError",
        defaultValues: {
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
        }
    });

    useEffect(() => {
        if (open && clientId) {
            setLoading(true);
            clientsService.get(clientId).then(client => {
                if (client) {
                    form.reset({
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
            form.reset({
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
            setPotentialDuplicates([]);
            setShowDuplicateWarning(false);
        }
    }, [open, clientId]);

    const checkDuplicates = async () => {
        if (isEdit) return [];

        const { data } = await clientsService.list();
        const duplicates: PotentialDuplicate[] = [];

        const values = form.getValues();
        data.forEach((client: Client) => {
            const reasons: string[] = [];

            if (values.fullName && client.fullName.toLowerCase() === values.fullName.toLowerCase()) {
                reasons.push("mismo nombre");
            }

            if (values.document && client.document === values.document) {
                reasons.push("mismo documento");
            }

            if (values.phone && client.phone === values.phone) {
                reasons.push("mismo teléfono");
            }

            if (values.email && client.email?.toLowerCase() === values.email.toLowerCase()) {
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

    const handleSubmit = async (values: FormData) => {
        const duplicates = await checkDuplicates();
        if (duplicates.length > 0 && !showDuplicateWarning) {
            setPotentialDuplicates(duplicates);
            setShowDuplicateWarning(true);
            return;
        }

        setSaving(true);
        try {
            const payload = {
                documentType: values.documentType || "Otro",
                document: values.document,
                fullName: values.fullName.trim(),
                companyName: values.companyName?.trim() || undefined,
                email: values.email?.trim().toLowerCase() || undefined,
                phone: values.phone?.trim() || undefined,
                phone2: values.phone2?.trim() || undefined,
                address: values.address?.trim() || undefined,
                neighborhood: values.neighborhood?.trim() || undefined,
                type: (values.type || "Particular") as ClientType,
                notes: values.notes?.trim() || undefined,
                tags: values.tags ? values.tags.split(",").map((t: string) => t.trim()).filter(Boolean) : [],
            };

            if (isEdit && clientId) {
                await clientsService.update(clientId, payload);
            } else {
                await clientsService.create(payload);
            }

            onOpenChange(false);
        } catch (error) {
            console.error("Error guardando cliente:", error);
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

                        <Form {...form}>
                            <div className="space-y-5">
                                <FormField
                                    control={form.control}
                                    name="type"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel htmlFor="type" className="text-sm mb-1.5 block">Tipo de cliente *</FormLabel>
                                            <FormControl>
                                                <Select value={field.value as any} onValueChange={field.onChange}>
                                                    <SelectTrigger id="type" className="h-10">
                                                        <SelectValue placeholder="Seleccionar tipo" />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        <SelectItem value="Particular">Particular</SelectItem>
                                                        <SelectItem value="Frecuente">Frecuente</SelectItem>
                                                        <SelectItem value="Corporativo">Corporativo</SelectItem>
                                                    </SelectContent>
                                                </Select>
                                            </FormControl>
                                            <FormMessage className="text-xs" />
                                        </FormItem>
                                    )}
                                />

                                <div className="grid grid-cols-2 gap-4">
                                    <FormField
                                        control={form.control}
                                        name="documentType"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel htmlFor="documentType" className="text-sm mb-1.5 block">Tipo documento</FormLabel>
                                                <FormControl>
                                                    <Select value={field.value} onValueChange={field.onChange}>
                                                        <SelectTrigger id="documentType" className="h-10">
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
                                                </FormControl>
                                                <FormMessage className="text-xs" />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name="document"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel htmlFor="document" className="text-sm mb-1.5 block">Número {form.watch("type") === "Corporativo" && "*"}</FormLabel>
                                                <FormControl>
                                                    <Input id="document" placeholder="Número documento" className="h-10" {...field} />
                                                </FormControl>
                                                <FormMessage className="text-xs" />
                                            </FormItem>
                                        )}
                                    />
                                </div>

                                <div className="grid grid-cols-1 gap-4">
                                    <FormField
                                        control={form.control}
                                        name="fullName"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel htmlFor="fullName" className="text-sm mb-1.5 block">Nombre completo *</FormLabel>
                                                <FormControl>
                                                    <Input id="fullName" placeholder="Juan Pérez" className="h-10" {...field} />
                                                </FormControl>
                                                <FormMessage className="text-xs" />
                                            </FormItem>
                                        )}
                                    />
                                    {form.watch("type") === "Corporativo" && (
                                        <FormField
                                            control={form.control}
                                            name="companyName"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel htmlFor="companyName" className="text-sm mb-1.5 block">Razón social *</FormLabel>
                                                    <FormControl>
                                                        <Input id="companyName" placeholder="Empresa XYZ SAS" className="h-10" {...field} />
                                                    </FormControl>
                                                    <FormMessage className="text-xs" />
                                                </FormItem>
                                            )}
                                        />
                                    )}
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <FormField
                                        control={form.control}
                                        name="phone"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel htmlFor="phone" className="text-sm mb-1.5 block">Teléfono *</FormLabel>
                                                <FormControl>
                                                    <Input id="phone" placeholder="3001234567" className="h-10" {...field} />
                                                </FormControl>
                                                <FormMessage className="text-xs" />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name="phone2"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel htmlFor="phone2" className="text-sm mb-1.5 block">Teléfono 2</FormLabel>
                                                <FormControl>
                                                    <Input id="phone2" placeholder="6012345678" className="h-10" {...field} />
                                                </FormControl>
                                                <FormMessage className="text-xs" />
                                            </FormItem>
                                        )}
                                    />
                                </div>

                                <FormField
                                    control={form.control}
                                    name="email"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel htmlFor="email" className="text-sm mb-1.5 block">Email *</FormLabel>
                                            <FormControl>
                                                <Input id="email" type="email" placeholder="correo@ejemplo.com" className="h-10" {...field} />
                                            </FormControl>
                                            <FormMessage className="text-xs" />
                                        </FormItem>
                                    )}
                                />

                                <div className="grid grid-cols-1 gap-4">
                                    <FormField
                                        control={form.control}
                                        name="address"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel htmlFor="address" className="text-sm mb-1.5 block">Dirección</FormLabel>
                                                <FormControl>
                                                    <Input id="address" placeholder="Calle 123 #45-67" className="h-10" {...field} />
                                                </FormControl>
                                                <FormMessage className="text-xs" />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name="neighborhood"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel htmlFor="neighborhood" className="text-sm mb-1.5 block">Barrio</FormLabel>
                                                <FormControl>
                                                    <Input id="neighborhood" placeholder="Centro" className="h-10" {...field} />
                                                </FormControl>
                                                <FormMessage className="text-xs" />
                                            </FormItem>
                                        )}
                                    />
                                </div>

                                <FormField
                                    control={form.control}
                                    name="tags"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel htmlFor="tags" className="text-sm mb-1.5 block">Etiquetas</FormLabel>
                                            <FormControl>
                                                <Input id="tags" placeholder="VIP, Mayorista (separadas por coma)" className="h-10" {...field} />
                                            </FormControl>
                                            <p className="text-xs text-muted-foreground mt-1">Separa las etiquetas con comas</p>
                                            <FormMessage className="text-xs" />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="notes"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel htmlFor="notes" className="text-sm mb-1.5 block">Notas internas</FormLabel>
                                            <FormControl>
                                                <Textarea id="notes" placeholder="Observaciones sobre el cliente..." rows={3} {...field} />
                                            </FormControl>
                                            <FormMessage className="text-xs" />
                                        </FormItem>
                                    )}
                                />
                            </div>
                        </Form>
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
                        className="h-9"
                    >
                        Cancelar
                    </Button>
                    {showDuplicateWarning && (
                        <Button
                            variant="outline"
                            onClick={() => setShowDuplicateWarning(false)}
                            disabled={saving}
                            className="h-9"
                        >
                            Revisar
                        </Button>
                    )}
                    <Can permission={isEdit ? Permission.UPDATE_CLIENTS : Permission.CREATE_CLIENTS}>
                        <Button onClick={form.handleSubmit(handleSubmit)} disabled={loading || saving} className="h-9">
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
