import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Permission } from "@/interfaces/role";
import { Can } from "@/components/Can";

interface Props {
    open: boolean;
    onOpenChange: (value: boolean) => void;
    clientId?: string; // si se pasa es edición
}

const ClientFormDialog = ({ open, onOpenChange, clientId }: Props) => {
    const isEdit = !!clientId;
    const [form, setForm] = useState({
        documentType: "",
        document: "",
        fullName: "",
        email: "",
        phone: "",
    });

    const update = (field: string, value: string) => setForm(f => ({ ...f, [field]: value }));

    const submit = () => {
        // TODO: integrar servicio create/update
        onOpenChange(false);
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>{isEdit ? "Editar cliente" : "Nuevo cliente"}</DialogTitle>
                </DialogHeader>
                <div className="space-y-3">
                    <Select value={form.documentType} onValueChange={(v) => update("documentType", v)}>
                        <SelectTrigger><SelectValue placeholder="Tipo documento" /></SelectTrigger>
                        <SelectContent>
                            <SelectItem value="CC">CC</SelectItem>
                            <SelectItem value="NIT">NIT</SelectItem>
                            <SelectItem value="CE">CE</SelectItem>
                            <SelectItem value="PP">Pasaporte</SelectItem>
                            <SelectItem value="Otro">Otro</SelectItem>
                        </SelectContent>
                    </Select>
                    <Input value={form.document} onChange={e => update("document", e.target.value)} placeholder="Número documento" />
                    <Input value={form.fullName} onChange={e => update("fullName", e.target.value)} placeholder="Nombre completo" />
                    <Input value={form.email} onChange={e => update("email", e.target.value)} placeholder="Email" />
                    <Input value={form.phone} onChange={e => update("phone", e.target.value)} placeholder="Teléfono" />
                    <div className="flex justify-end gap-2 pt-2">
                        <Button variant="outline" onClick={() => onOpenChange(false)}>Cancelar</Button>
                        <Can permission={isEdit ? Permission.UPDATE_CLIENTS : Permission.CREATE_CLIENTS}>
                            <Button onClick={submit}>{isEdit ? "Guardar" : "Crear"}</Button>
                        </Can>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
};

export default ClientFormDialog;
