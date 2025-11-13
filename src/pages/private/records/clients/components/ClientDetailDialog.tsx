import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Mail, Phone, MapPin, Calendar, ShoppingCart, User, Edit, Ban, FileText } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { es } from "date-fns/locale";
import { Can } from "@/components/Can";
import { Permission } from "@/interfaces/role";
import { useEffect, useState } from "react";
import type { Client } from "../ClientsPage";
import { clientsService } from "@/services/clientsService";

interface Props {
    clientId: string | null;
    onOpenChange: (value: string | null) => void;
    onEdit: (id: string) => void;
}

const ClientDetailDialog = ({ clientId, onOpenChange, onEdit }: Props) => {
    const [client, setClient] = useState<Client | null>(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (clientId) {
            setLoading(true);
            clientsService.get(clientId).then(data => {
                setClient(data);
                setLoading(false);
            });
        } else {
            setClient(null);
        }
    }, [clientId]);

    const open = !!clientId;

    if (loading) {
        return (
            <Dialog open={open} onOpenChange={(v) => onOpenChange(v ? clientId : null)}>
                <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
                    <div className="flex items-center justify-center py-8">
                        <div className="text-muted-foreground">Cargando...</div>
                    </div>
                </DialogContent>
            </Dialog>
        );
    }

    if (!client) {
        return null;
    }

    const getClientTypeColor = (type: string) => {
        switch (type) {
            case "Frecuente": return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200";
            case "Corporativo": return "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200";
            default: return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200";
        }
    };

    return (
        <Dialog open={open} onOpenChange={(v) => onOpenChange(v ? clientId : null)}>
            <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <div className="flex items-start justify-between">
                        <div>
                            <DialogTitle className="text-2xl">{client.fullName}</DialogTitle>
                            {client.companyName && (
                                <p className="text-sm text-muted-foreground mt-1">{client.companyName}</p>
                            )}
                        </div>
                        <div className="flex gap-2">
                            <Badge variant="secondary" className={getClientTypeColor(client.type)}>
                                {client.type}
                            </Badge>
                            <Badge variant={client.active ? "default" : "secondary"} className={client.active ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200" : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"}>
                                {client.active ? "Activo" : "Inactivo"}
                            </Badge>
                        </div>
                    </div>
                </DialogHeader>

                <div className="space-y-6">
                    {/* Información de contacto */}
                    <div className="space-y-3">
                        <h3 className="font-semibold flex items-center gap-2">
                            <User className="h-4 w-4" />
                            Información de contacto
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                            <div className="flex items-center gap-2">
                                <FileText className="h-4 w-4 text-muted-foreground" />
                                <span className="text-muted-foreground">Documento:</span>
                                <span>{client.documentType} {client.document}</span>
                            </div>
                            {client.phone && (
                                <div className="flex items-center gap-2">
                                    <Phone className="h-4 w-4 text-muted-foreground" />
                                    <span className="text-muted-foreground">Teléfono:</span>
                                    <span>{client.phone}</span>
                                </div>
                            )}
                            {client.phone2 && (
                                <div className="flex items-center gap-2">
                                    <Phone className="h-4 w-4 text-muted-foreground" />
                                    <span className="text-muted-foreground">Teléfono 2:</span>
                                    <span>{client.phone2}</span>
                                </div>
                            )}
                            {client.email && (
                                <div className="flex items-center gap-2">
                                    <Mail className="h-4 w-4 text-muted-foreground" />
                                    <span className="text-muted-foreground">Email:</span>
                                    <span>{client.email}</span>
                                </div>
                            )}
                            {client.address && (
                                <div className="flex items-center gap-2 col-span-2">
                                    <MapPin className="h-4 w-4 text-muted-foreground" />
                                    <span className="text-muted-foreground">Dirección:</span>
                                    <span>{client.address}</span>
                                    {client.neighborhood && <span className="text-muted-foreground">({client.neighborhood})</span>}
                                </div>
                            )}
                        </div>
                    </div>

                    <Separator />

                    {/* Actividad del cliente */}
                    <div className="space-y-3">
                        <h3 className="font-semibold flex items-center gap-2">
                            <ShoppingCart className="h-4 w-4" />
                            Actividad
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                            <div className="space-y-1">
                                <div className="text-muted-foreground">Total compras</div>
                                <div className="text-2xl font-bold">{client.totalPurchases || 0}</div>
                            </div>
                            <div className="space-y-1">
                                <div className="text-muted-foreground">Última compra</div>
                                <div className="font-medium">
                                    {client.lastPurchaseDate
                                        ? formatDistanceToNow(new Date(client.lastPurchaseDate), { addSuffix: true, locale: es })
                                        : "Nunca"}
                                </div>
                            </div>
                            {client.pendingBalance !== undefined && (
                                <div className="space-y-1">
                                    <div className="text-muted-foreground">Saldo pendiente</div>
                                    <div className="text-2xl font-bold text-orange-600">
                                        ${client.pendingBalance.toLocaleString()}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    {client.tags && client.tags.length > 0 && (
                        <>
                            <Separator />
                            <div className="space-y-3">
                                <h3 className="font-semibold">Etiquetas</h3>
                                <div className="flex flex-wrap gap-2">
                                    {client.tags.map((tag, idx) => (
                                        <Badge key={idx} variant="outline">{tag}</Badge>
                                    ))}
                                </div>
                            </div>
                        </>
                    )}

                    {client.notes && (
                        <>
                            <Separator />
                            <div className="space-y-3">
                                <h3 className="font-semibold">Notas internas</h3>
                                <p className="text-sm text-muted-foreground whitespace-pre-wrap">{client.notes}</p>
                            </div>
                        </>
                    )}

                    {/* Auditoría */}
                    <Separator />
                    <div className="space-y-2 text-xs text-muted-foreground">
                        <div className="flex items-center gap-2">
                            <Calendar className="h-3 w-3" />
                            <span>Creado {formatDistanceToNow(new Date(client.audit.createdAt), { addSuffix: true, locale: es })} por {client.audit.createdBy}</span>
                        </div>
                        {client.audit.lastModifiedAt && (
                            <div className="flex items-center gap-2">
                                <Calendar className="h-3 w-3" />
                                <span>Modificado {formatDistanceToNow(new Date(client.audit.lastModifiedAt), { addSuffix: true, locale: es })} por {client.audit.lastModifiedBy}</span>
                            </div>
                        )}
                    </div>
                </div>

                <DialogFooter className="gap-2">
                    <Button variant="outline" onClick={() => onOpenChange(null)}>Cerrar</Button>
                    <Can permission={Permission.UPDATE_CLIENTS}>
                        <Button variant="secondary" onClick={() => { onEdit(client.id); onOpenChange(null); }}>
                            <Edit className="h-4 w-4 mr-2" />
                            Editar
                        </Button>
                    </Can>
                    <Can permission={Permission.UPDATE_CLIENTS}>
                        <Button variant="outline">
                            <Ban className="h-4 w-4 mr-2" />
                            {client.active ? "Inactivar" : "Activar"}
                        </Button>
                    </Can>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};

export default ClientDetailDialog;
