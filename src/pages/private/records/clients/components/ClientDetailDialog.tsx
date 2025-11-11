import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

interface Props {
    clientId: string | null;
    onOpenChange: (value: string | null) => void;
}

const ClientDetailDialog = ({ clientId, onOpenChange }: Props) => {
    const open = !!clientId;
    return (
        <Dialog open={open} onOpenChange={(v) => onOpenChange(v ? clientId : null)}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Detalle del cliente</DialogTitle>
                </DialogHeader>
                {!clientId ? (
                    <div className="text-sm text-muted-foreground">Sin selección</div>
                ) : (
                    <div className="space-y-2 text-sm">
                        <div>ID: {clientId}</div>
                        <div>Contenido del detalle (pendiente de integrar servicio)</div>
                    </div>
                )}
            </DialogContent>
        </Dialog>
    );
};

export default ClientDetailDialog;
