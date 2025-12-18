import { useState } from 'react';
import { motion } from 'framer-motion';
import { useCashBoxesMock } from '@/hooks/useCashBoxesMock';
import { CashBoxFormDialog } from './components/CashBoxFormDialog';
import { CashBoxList } from './components/CashBoxList';
import { OpenBoxDialog } from './components/OpenBoxDialog';
import { CloseBoxDialog } from './components/CloseBoxDialog';
import { AddMovementDialog } from './components/AddMovementDialog';
import type {
    CashBox,
    CashBoxFormData,
    OpenCashBoxData,
    CloseCashBoxData,
    AddMovementData
} from '@/interfaces/cashbox';
import { usePermissions } from '@/hooks/usePermissions';
import { Permission } from '@/interfaces/role';
import { CashBoxDetail } from './components/CashBoxDetail';

const CashBoxesPageNew = () => {
    const {
        cashBoxes,
        create,
        update,
        openCashBox,
        closeCashBox,
        addMovement,
        findById
    } = useCashBoxesMock();

    const { hasPermission } = usePermissions();

    const [selectedId, setSelectedId] = useState<string | undefined>(
        cashBoxes.length > 0 ? cashBoxes[0].id : undefined
    );
    const [openForm, setOpenForm] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [openBoxDialog, setOpenBoxDialog] = useState(false);
    const [closeBoxDialog, setCloseBoxDialog] = useState(false);
    const [addMovementDialog, setAddMovementDialog] = useState(false);

    const selectedBox: CashBox | null = selectedId ? findById(selectedId) : null;
    const editingBox: CashBox | null = editingId ? findById(editingId) : null;

    const handleCreateNew = () => {
        setEditingId(null);
        setOpenForm(true);
    };

    const handleEdit = () => {
        if (!selectedBox) return;
        setEditingId(selectedBox.id);
        setOpenForm(true);
    };

    const handleFormSubmit = (data: CashBoxFormData) => {
        if (editingBox) {
            update(editingBox.id, data);
        } else {
            const newBox = create(data);
            setSelectedId(newBox.id);
        }
        setOpenForm(false);
    };

    const handleOpenBox = (data: OpenCashBoxData) => {
        if (!selectedBox) return;
        openCashBox(selectedBox.id, data);
        setOpenBoxDialog(false);
    };

    const handleCloseBox = (data: CloseCashBoxData) => {
        if (!selectedBox) return;
        closeCashBox(selectedBox.id, data);
        setCloseBoxDialog(false);
    };

    const handleAddMovement = (data: AddMovementData) => {
        if (!selectedBox) return;
        addMovement(selectedBox.id, data);
        setAddMovementDialog(false);
    };

    return (
        <div className="flex flex-col h-full">
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-6"
            >
                <h1 className="text-2xl font-bold tracking-tight">Cajas</h1>
                <p className="text-sm text-muted-foreground">
                    Gestiona terminales de cobro y movimientos de efectivo
                </p>
            </motion.div>

            <div className="flex-1 grid grid-cols-1 lg:grid-cols-[30%_1fr] gap-6 min-h-0">
                <div className="flex flex-col min-h-0 lg:border-r lg:pr-6">
                    <CashBoxList
                        cashBoxes={cashBoxes}
                        selectedId={selectedId}
                        onSelect={setSelectedId}
                        onCreateNew={handleCreateNew}
                        canCreate={hasPermission(Permission.MAE_CAJAS_CREATE)}
                    />
                </div>

                <div className="flex flex-col min-h-0 overflow-auto">
                    {selectedBox ? (
                        <CashBoxDetail
                            cashBox={selectedBox}
                            onEdit={handleEdit}
                            onOpen={() => setOpenBoxDialog(true)}
                            onClose={() => setCloseBoxDialog(true)}
                            onAddMovement={() => setAddMovementDialog(true)}
                            canEdit={hasPermission(Permission.MAE_CAJAS_UPDATE)}
                            canManage={hasPermission(Permission.MAE_CAJAS_UPDATE)}
                        />
                    ) : (
                        <div className="flex items-center justify-center h-full">
                            <div className="text-center text-muted-foreground">
                                <p className="text-lg font-medium mb-2">No hay caja seleccionada</p>
                                <p className="text-sm">
                                    Selecciona una caja de la lista o crea una nueva
                                </p>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            <CashBoxFormDialog
                open={openForm}
                onOpenChange={setOpenForm}
                initial={editingBox}
                onSubmit={handleFormSubmit}
            />

            {selectedBox && (
                <OpenBoxDialog
                    open={openBoxDialog}
                    onOpenChange={setOpenBoxDialog}
                    onSubmit={handleOpenBox}
                    cashBoxName={selectedBox.name}
                />
            )}

            {selectedBox?.currentSession && (
                <CloseBoxDialog
                    open={closeBoxDialog}
                    onOpenChange={setCloseBoxDialog}
                    onSubmit={handleCloseBox}
                    cashBoxName={selectedBox.name}
                    expectedAmount={selectedBox.currentSession.expectedAmount}
                />
            )}

            {selectedBox && (
                <AddMovementDialog
                    open={addMovementDialog}
                    onOpenChange={setAddMovementDialog}
                    onSubmit={handleAddMovement}
                    cashBoxName={selectedBox.name}
                />
            )}
        </div>
    );
};

export default CashBoxesPageNew;
