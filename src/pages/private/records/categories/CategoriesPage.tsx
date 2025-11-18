import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Search, Plus, FolderOpen } from "lucide-react";
import { CategoryCard } from "./components/CategoryCard";
import { CategoryFormDialog } from "./components/CategoryFormDialog";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { useToast } from "@/components/ui/toast";
import { categoriesMock } from "./mock";
import type { Category, CategoryFormValues } from "@/interfaces/category";
import { Can } from "@/components/Can";
import { Permission } from "@/interfaces/role";

export default function CategoriesPage() {
    const toast = useToast();
    const [categories, setCategories] = useState<Category[]>(categoriesMock);
    const [searchQuery, setSearchQuery] = useState("");
    const [formOpen, setFormOpen] = useState(false);
    const [editing, setEditing] = useState<Category | null>(null);
    const [deleteTarget, setDeleteTarget] = useState<Category | null>(null);

    const filteredCategories = useMemo(() => {
        const query = searchQuery.toLowerCase();
        return categories.filter(
            (cat) =>
                cat.name.toLowerCase().includes(query) ||
                cat.description?.toLowerCase().includes(query)
        );
    }, [categories, searchQuery]);

    const handleCreate = () => {
        setEditing(null);
        setFormOpen(true);
    };

    const handleEdit = (category: Category) => {
        setEditing(category);
        setFormOpen(true);
    };

    const handleSubmit = (values: CategoryFormValues) => {
        if (editing) {
            setCategories((prev) =>
                prev.map((cat) =>
                    cat.id === editing.id
                        ? { ...cat, ...values, updatedAt: new Date().toISOString() }
                        : cat
                )
            );
            toast.show("Categoría actualizada correctamente", "success");
        } else {
            const newCategory: Category = {
                id: crypto.randomUUID(),
                ...values,
                productCount: 0,
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
            };
            setCategories((prev) => [newCategory, ...prev]);
            toast.show("Categoría creada exitosamente", "success");
        }
        setFormOpen(false);
    };

    const handleDelete = (category: Category) => {
        setDeleteTarget(category);
    };

    const confirmDelete = () => {
        if (deleteTarget) {
            setCategories((prev) => prev.filter((cat) => cat.id !== deleteTarget.id));
            toast.show("Categoría eliminada", "success");
            setDeleteTarget(null);
        }
    };

    return (
        <div className="space-y-6">

            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex flex-col gap-4"
            >
                <div>
                    <h1 className="text-2xl font-bold">Categorías de productos</h1>
                    <p className="text-sm text-muted-foreground">
                        Organiza y clasifica tus productos en categorías
                    </p>
                </div>
            </motion.div>
            <Card className="p-3">
                <div className="flex flex-col sm:flex-row gap-3">
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                            placeholder="Buscar categoría..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="pl-9 h-10"
                        />
                    </div>
                    <Can permission={Permission.CREATE_CATEGORIES}>
                        <Button onClick={handleCreate} className="h-10">
                            <Plus className="h-4 w-4 mr-2" />
                            Nueva categoría
                        </Button>
                    </Can>
                </div>
            </Card>
            {filteredCategories.length > 0 ? (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4"
                >
                    {filteredCategories.map((category) => (
                        <CategoryCard
                            key={category.id}
                            category={category}
                            onEdit={handleEdit}
                            onDelete={handleDelete}
                        />
                    ))}
                </motion.div>
            ) : searchQuery ? (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="flex flex-col items-center justify-center py-16 text-center"
                >
                    <Search className="h-16 w-16 text-muted-foreground/50 mb-4" />
                    <h3 className="text-lg font-semibold mb-2">No se encontraron resultados</h3>
                    <p className="text-sm text-muted-foreground max-w-sm">
                        No hay categorías que coincidan con "{searchQuery}"
                    </p>
                </motion.div>
            ) : (
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="flex flex-col items-center justify-center py-16 text-center"
                >
                    <div className="h-20 w-20 rounded-full bg-muted flex items-center justify-center mb-4">
                        <FolderOpen className="h-10 w-10 text-muted-foreground" />
                    </div>
                    <h3 className="text-lg font-semibold mb-2">Aún no hay categorías creadas</h3>
                    <p className="text-sm text-muted-foreground max-w-sm mb-6">
                        Usa el botón superior para registrar la primera categoría y comenzar a organizar tus productos
                    </p>
                    <Can permission={Permission.CREATE_CATEGORIES}>
                        <Button onClick={handleCreate}>
                            <Plus className="h-4 w-4 mr-2" />
                            Crear categoría
                        </Button>
                    </Can>
                </motion.div>
            )}
            <CategoryFormDialog
                open={formOpen}
                onOpenChange={setFormOpen}
                onSubmit={handleSubmit}
                initial={editing}
            />
            {deleteTarget && (
                <ConfirmDialog
                    open={!!deleteTarget}
                    onOpenChange={() => setDeleteTarget(null)}
                    title="¿Seguro que deseas eliminar esta categoría?"
                    description="Los productos asociados no se eliminarán, pero quedarán sin categoría. Esta acción no se puede deshacer."
                    onConfirm={confirmDelete}
                    variant="destructive"
                    confirmLabel="Eliminar"
                />
            )}
        </div>
    );
}
